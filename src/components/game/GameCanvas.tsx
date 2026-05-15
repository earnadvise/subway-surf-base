import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import Player from './Player';
import Environment from './Environment';
import ObstacleManager from './ObstacleManager';
import CollectibleManager from './CollectibleManager';

// We could add Effects like Bloom here but they require @react-three/postprocessing
// To keep dependencies clean and performant, we'll use good lighting and materials to simulate neon.

export default function GameCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 5, 10], fov: 60 }}
      shadows
      gl={{ antialias: false, powerPreference: 'high-performance' }} // Optimize for performance
    >
      <color attach="background" args={['#050510']} /> {/* Very dark blue/black background */}
      <fog attach="fog" args={['#050510', 10, 80]} /> {/* Fade to black/dark blue in distance */}
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 20, 5]} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize-width={1024} 
        shadow-mapSize-height={1024} 
      />
      <pointLight position={[0, 5, -20]} intensity={2} color="#00F0FF" distance={50} />
      
      <Suspense fallback={null}>
        <Environment />
        <Player />
        <ObstacleManager />
        <CollectibleManager />
      </Suspense>
    </Canvas>
  );
}
