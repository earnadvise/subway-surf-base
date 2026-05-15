import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh } from 'three';
import { useGameStore } from '../../store/useGameStore';

const SEGMENT_LENGTH = 100;
const SEGMENT_COUNT = 3;

export default function Environment() {
  const groupRef = useRef<Group>(null);
  const { isPlaying } = useGameStore();

  useFrame(() => {
    if (!isPlaying || !groupRef.current) return;
    
    const playerZ = (window as any).playerPosition?.z || 0;
    
    // Infinite scrolling ground logic
    groupRef.current.children.forEach((segment) => {
      // If segment is far behind the player, move it forward
      if (segment.position.z - playerZ > 20) {
        segment.position.z -= SEGMENT_LENGTH * SEGMENT_COUNT;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Generate segments */}
      {Array.from({ length: SEGMENT_COUNT }).map((_, i) => (
        <group key={i} position={[0, 0, -i * SEGMENT_LENGTH]}>
          
          {/* Main Road */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[10, SEGMENT_LENGTH]} />
            <meshStandardMaterial color="#0A0B0D" roughness={0.8} metalness={0.2} />
          </mesh>

          {/* Lane dividers (Neon strips) */}
          <mesh position={[-1.5, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
             <planeGeometry args={[0.1, SEGMENT_LENGTH]} />
             <meshBasicMaterial color="#0052FF" />
          </mesh>
          <mesh position={[1.5, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
             <planeGeometry args={[0.1, SEGMENT_LENGTH]} />
             <meshBasicMaterial color="#0052FF" />
          </mesh>

          {/* Side Barriers */}
          <mesh position={[-5.5, 1, 0]} receiveShadow>
            <boxGeometry args={[1, 2, SEGMENT_LENGTH]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          <mesh position={[5.5, 1, 0]} receiveShadow>
            <boxGeometry args={[1, 2, SEGMENT_LENGTH]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          
          {/* Neon grid details on side walls */}
          <mesh position={[-4.9, 1, 0]}>
             <planeGeometry args={[SEGMENT_LENGTH, 0.2]} />
             <meshBasicMaterial color="#B533FF" transparent opacity={0.5} />
          </mesh>
          <mesh position={[4.9, 1, 0]} rotation={[0, Math.PI, 0]}>
             <planeGeometry args={[SEGMENT_LENGTH, 0.2]} />
             <meshBasicMaterial color="#B533FF" transparent opacity={0.5} />
          </mesh>

          {/* Background Cyber Buildings */}
          {Array.from({ length: 5 }).map((_, j) => (
            <mesh key={`bL-${j}`} position={[-15, 10, -j * 20 + (Math.random() * 5)]}>
              <boxGeometry args={[8, 20 + Math.random() * 20, 8]} />
              <meshStandardMaterial color="#000" emissive="#0052FF" emissiveIntensity={Math.random() * 0.5} wireframe />
            </mesh>
          ))}
          {Array.from({ length: 5 }).map((_, j) => (
            <mesh key={`bR-${j}`} position={[15, 10, -j * 20 + (Math.random() * 5)]}>
              <boxGeometry args={[8, 20 + Math.random() * 20, 8]} />
              <meshStandardMaterial color="#000" emissive="#00F0FF" emissiveIntensity={Math.random() * 0.5} wireframe />
            </mesh>
          ))}
          
        </group>
      ))}
    </group>
  );
}
