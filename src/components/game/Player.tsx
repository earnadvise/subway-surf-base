import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import { useGameStore } from '../../store/useGameStore';

const LANE_WIDTH = 3;
const JUMP_FORCE = 15;
const GRAVITY = -40;
const FORWARD_BASE_SPEED = 15;

export default function Player() {
  const meshRef = useRef<Mesh>(null);
  const { camera } = useThree();
  const { isPlaying, isGameOver, speed, increaseSpeed, score, addScore, endGame } = useGameStore();
  
  // Player state
  const [lane, setLane] = useState(0); // -1 (left), 0 (center), 1 (right)
  const [yVelocity, setYVelocity] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [slideTimer, setSlideTimer] = useState(0);
  
  // Input handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || isGameOver) return;
      
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setLane(l => Math.max(l - 1, -1));
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setLane(l => Math.min(l + 1, 1));
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') {
        if (meshRef.current && meshRef.current.position.y <= 0.6) { // if grounded
          setYVelocity(JUMP_FORCE);
        }
      } else if (e.key === 'ArrowDown' || e.key === 's') {
        if (!isSliding && meshRef.current && meshRef.current.position.y <= 0.6) {
          setIsSliding(true);
          setSlideTimer(0.8); // slide for 0.8 seconds
        } else if (meshRef.current && meshRef.current.position.y > 0.6) {
           // fast fall
           setYVelocity(-JUMP_FORCE);
        }
      }
    };

    // Touch/Swipe handling (basic implementation for mobile)
    let touchStartX = 0;
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (!isPlaying || isGameOver) return;
      
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const dx = touchEndX - touchStartX;
      const dy = touchEndY - touchStartY;
      
      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        if (dx > 30) setLane(l => Math.min(l + 1, 1));
        if (dx < -30) setLane(l => Math.max(l - 1, -1));
      } else {
        // Vertical swipe
        if (dy < -30 && meshRef.current && meshRef.current.position.y <= 0.6) setYVelocity(JUMP_FORCE); // Swipe up (jump)
        if (dy > 30 && !isSliding && meshRef.current && meshRef.current.position.y <= 0.6) { // Swipe down (slide)
          setIsSliding(true);
          setSlideTimer(0.8);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPlaying, isGameOver, isSliding]);

  useFrame((state, delta) => {
    if (!isPlaying || isGameOver || !meshRef.current) return;

    // Forward movement (Player stays at Z=0, world elements move +Z? No, standard is moving player -Z)
    // Actually, moving player -Z means we have to move camera too. Let's do that, it's easier.
    meshRef.current.position.z -= speed * delta;
    
    // Update score based on distance
    addScore(speed * delta * 0.1);
    
    // Gradually increase speed
    if (Math.floor(score) % 50 === 0 && Math.floor(score) > 0) {
      increaseSpeed(0.01);
    }

    // Lane movement (smooth X transition)
    const targetX = lane * LANE_WIDTH;
    meshRef.current.position.x += (targetX - meshRef.current.position.x) * 10 * delta;

    // Jumping physics (Y axis)
    if (meshRef.current.position.y > 0.5 || yVelocity > 0) {
      meshRef.current.position.y += yVelocity * delta;
      setYVelocity(v => v + GRAVITY * delta);
    }
    
    // Floor collision
    const baseHeight = isSliding ? 0.25 : 0.5;
    if (meshRef.current.position.y <= baseHeight) {
      meshRef.current.position.y = baseHeight;
      setYVelocity(0);
    }

    // Slide logic
    if (isSliding) {
      setSlideTimer(t => t - delta);
      if (slideTimer <= 0) {
        setIsSliding(false);
      }
      meshRef.current.scale.set(1, 0.5, 1); // squish down
    } else {
      meshRef.current.scale.set(1, 1, 1);
    }

    // Update Camera to follow player
    camera.position.x = meshRef.current.position.x * 0.5; // slight pan
    camera.position.y = 5;
    camera.position.z = meshRef.current.position.z + 10;
    camera.lookAt(meshRef.current.position.x * 0.5, 2, meshRef.current.position.z - 10);
    
    // Export player position to a global variable or store for collision detection by obstacles
    // Using window object for high frequency game loop sharing without React render cycle
    (window as any).playerPosition = meshRef.current.position.clone();
    (window as any).playerHitbox = {
      x: meshRef.current.position.x,
      y: meshRef.current.position.y,
      z: meshRef.current.position.z,
      width: 1,
      height: isSliding ? 0.5 : 1.5,
      depth: 1
    };
  });

  // Reset player when game restarts
  useEffect(() => {
    if (isPlaying && score === 0 && meshRef.current) {
      meshRef.current.position.set(0, 0.5, 0);
      setLane(0);
      setYVelocity(0);
      setIsSliding(false);
    }
  }, [isPlaying, score]);

  return (
    <mesh ref={meshRef} position={[0, 0.5, 0]} castShadow>
      <boxGeometry args={[1, 1.5, 1]} />
      {/* Base ecosystem blue glow character */}
      <meshStandardMaterial color="#0052FF" emissive="#0052FF" emissiveIntensity={0.5} />
      
      {/* Add a neon trail or highlight */}
      <mesh position={[0, 0, 0.6]}>
         <boxGeometry args={[0.8, 1.2, 0.1]} />
         <meshBasicMaterial color="#00F0FF" />
      </mesh>
    </mesh>
  );
}
