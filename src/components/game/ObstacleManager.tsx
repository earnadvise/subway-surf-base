import { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { useGameStore } from '../../store/useGameStore';

interface ObstacleData {
  id: number;
  type: 'train' | 'barrier' | 'pit';
  lane: number; // -1, 0, 1
  z: number;
}

const SPAWN_DISTANCE = 150;
const LANE_WIDTH = 3;

// Collision detection function
const checkCollision = (player: any, obstacle: ObstacleData) => {
  if (!player) return false;
  
  const obsX = obstacle.lane * LANE_WIDTH;
  const obsZ = obstacle.z;
  
  // Define hitboxes based on type
  let obsY = 0, obsW = 0, obsH = 0, obsD = 0;
  
  if (obstacle.type === 'train') {
    obsY = 1.5; obsW = 2.8; obsH = 3; obsD = 10;
  } else if (obstacle.type === 'barrier') {
    obsY = 1.5; obsW = 2.8; obsH = 0.5; obsD = 0.5; // High barrier, slide under
    // Wait, let's make it a full block to jump over, or slide under depending on Y position
    // Let's say barrier is at Y=1.5, H=1 (need to slide under)
    // Or Y=0.5, H=1 (need to jump over)
  }
  
  // Simple AABB Collision
  const dx = Math.abs(player.x - obsX);
  const dz = Math.abs(player.z - obsZ);
  
  if (dx < (player.width / 2 + obsW / 2) && dz < (player.depth / 2 + obsD / 2)) {
    // Check Y axis
    if (obstacle.type === 'train') {
      // Train is tall, almost always hits if X and Z overlap
      return player.y < 3;
    } else if (obstacle.type === 'barrier') {
      // Let's say barrier is floating (slide under)
      return player.y > 0.8; // Player hits it if standing, safe if sliding (y is lower)
    } else if (obstacle.type === 'pit') {
      // Pit, must jump over
      return player.y < 1.0; 
    }
  }
  return false;
};

export default function ObstacleManager() {
  const [obstacles, setObstacles] = useState<ObstacleData[]>([]);
  const groupRef = useRef<Group>(null);
  const { isPlaying, endGame, score } = useGameStore();
  const nextSpawnZ = useRef(-30);

  // Spawning logic
  useFrame(() => {
    if (!isPlaying) return;
    
    const playerZ = (window as any).playerPosition?.z || 0;
    
    // Spawn new obstacles ahead
    if (playerZ - SPAWN_DISTANCE < nextSpawnZ.current) {
      const typeRand = Math.random();
      const type: ObstacleData['type'] = typeRand < 0.4 ? 'train' : typeRand < 0.7 ? 'barrier' : 'pit';
      
      const newObs: ObstacleData = {
        id: Math.random(),
        type,
        lane: Math.floor(Math.random() * 3) - 1, // -1, 0, 1
        z: nextSpawnZ.current
      };
      
      setObstacles(prev => [...prev, newObs]);
      nextSpawnZ.current -= 20 + Math.random() * 20; // Gap between obstacles
    }
    
    // Collision detection and cleanup
    const pBox = (window as any).playerHitbox;
    setObstacles(prev => {
      let hit = false;
      const filtered = prev.filter(obs => {
        // Check collision
        if (!hit && checkCollision(pBox, obs)) {
          hit = true;
          endGame(); // Trigger game over
        }
        // Keep if it's not far behind player
        return obs.z < playerZ + 20;
      });
      return filtered;
    });
  });

  // Reset on restart
  useEffect(() => {
    if (isPlaying && score === 0) {
      setObstacles([]);
      nextSpawnZ.current = -50;
    }
  }, [isPlaying, score]);

  if (!isPlaying) return null;

  return (
    <group ref={groupRef}>
      {obstacles.map(obs => (
        <group key={obs.id} position={[obs.lane * LANE_WIDTH, 0, obs.z]}>
          {obs.type === 'train' && (
            <mesh position={[0, 1.5, 0]} castShadow>
              <boxGeometry args={[2.8, 3, 10]} />
              <meshStandardMaterial color="#B533FF" metalness={0.8} roughness={0.2} />
              {/* Train Neon details */}
              <mesh position={[0, 0, 5.01]}>
                <planeGeometry args={[2, 2]} />
                <meshBasicMaterial color="#00F0FF" />
              </mesh>
            </mesh>
          )}
          
          {obs.type === 'barrier' && (
            <mesh position={[0, 1.5, 0]} castShadow>
              {/* Floating energy barrier - Slide under */}
              <boxGeometry args={[2.8, 0.5, 0.5]} />
              <meshStandardMaterial color="#FF0055" emissive="#FF0055" emissiveIntensity={0.8} />
              {/* Energy beam down */}
              <mesh position={[0, -0.75, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 1.5]} />
                <meshBasicMaterial color="#FF0055" transparent opacity={0.5} />
              </mesh>
            </mesh>
          )}

          {obs.type === 'pit' && (
            <mesh position={[0, 0.25, 0]} castShadow>
              {/* Broken Road / Low barricade - Jump over */}
              <boxGeometry args={[2.8, 0.5, 1]} />
              <meshStandardMaterial color="#FFAA00" emissive="#FFAA00" emissiveIntensity={0.5} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}
