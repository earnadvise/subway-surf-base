import { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { useGameStore } from '../../store/useGameStore';
import { useUserStore } from '../../store/useUserStore';

interface CoinData {
  id: number;
  lane: number;
  y: number; // For jump-to-collect coins
  z: number;
}

const SPAWN_DISTANCE = 100;
const LANE_WIDTH = 3;

export default function CollectibleManager() {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const groupRef = useRef<Group>(null);
  const { isPlaying, addScore, score } = useGameStore();
  const { addXp } = useUserStore();
  const nextSpawnZ = useRef(-20);

  // Spawning logic
  useFrame((state, delta) => {
    if (!isPlaying) return;
    
    const playerZ = (window as any).playerPosition?.z || 0;
    
    // Spawn new coin lines
    if (playerZ - SPAWN_DISTANCE < nextSpawnZ.current) {
      const lane = Math.floor(Math.random() * 3) - 1;
      const length = Math.floor(Math.random() * 5) + 3; // 3 to 7 coins
      const yPos = Math.random() > 0.7 ? 2 : 0.5; // Sometimes spawn in air
      
      const newCoins: CoinData[] = [];
      for (let i = 0; i < length; i++) {
        newCoins.push({
          id: Math.random(),
          lane,
          y: yPos,
          z: nextSpawnZ.current - (i * 2)
        });
      }
      
      setCoins(prev => [...prev, ...newCoins]);
      nextSpawnZ.current -= 40 + Math.random() * 20; // Gap to next pattern
    }
    
    // Rotate coins
    if (groupRef.current) {
      groupRef.current.children.forEach(child => {
        child.rotation.y += 2 * delta;
      });
    }

    // Collision detection
    const pBox = (window as any).playerHitbox;
    if (pBox) {
      setCoins(prev => {
        return prev.filter(coin => {
          // Check collision
          const dx = Math.abs(pBox.x - (coin.lane * LANE_WIDTH));
          const dy = Math.abs(pBox.y - coin.y);
          const dz = Math.abs(pBox.z - coin.z);
          
          if (dx < 1 && dy < 1.5 && dz < 1) {
            // Collected!
            addScore(10); // 10 points per coin
            addXp(1); // 1 XP per coin
            return false; // Remove coin
          }
          
          // Keep if not missed
          return coin.z < playerZ + 10;
        });
      });
    }
  });

  // Reset
  useEffect(() => {
    if (isPlaying && score === 0) {
      setCoins([]);
      nextSpawnZ.current = -20;
    }
  }, [isPlaying, score]);

  if (!isPlaying) return null;

  return (
    <group ref={groupRef}>
      {coins.map(coin => (
        <mesh key={coin.id} position={[coin.lane * LANE_WIDTH, coin.y, coin.z]}>
          <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
          <meshStandardMaterial color="#0052FF" emissive="#0052FF" emissiveIntensity={0.8} />
        </mesh>
      ))}
    </group>
  );
}
