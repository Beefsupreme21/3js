import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

export default function Water() {
    const meshRef = useRef<Mesh>(null);

    // Animate water with gentle waves
    useFrame((_, delta) => {
        if (meshRef.current) {
            // Simple wave animation using vertex shader-like effect
            // For now, just rotate slightly for visual interest
            meshRef.current.rotation.x = Math.sin(Date.now() * 0.0005) * 0.01;
            meshRef.current.rotation.z = Math.cos(Date.now() * 0.0007) * 0.01;
        }
    });

    return (
        <>
            {/* Water plane */}
            <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[50, 50, 32, 32]} />
                <meshStandardMaterial 
                    color="#1e3a5f" 
                    metalness={0.1}
                    roughness={0.2}
                    transparent
                    opacity={0.8}
                />
            </mesh>

            {/* Additional water layers for depth */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
                <planeGeometry args={[50, 50]} />
                <meshStandardMaterial 
                    color="#0f2a4a" 
                    metalness={0.2}
                    roughness={0.3}
                />
            </mesh>

            {/* Ambient lighting for water */}
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={0.8} />
        </>
    );
}

