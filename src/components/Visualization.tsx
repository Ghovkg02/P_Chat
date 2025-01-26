import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { EnvironmentalData } from '../types';

interface VisualizationProps {
  data?: EnvironmentalData;
}

function TerrainMesh({ elevation = 0 }) {
  return (
    <mesh position={[0, elevation / 2, 0]}>
      <boxGeometry args={[10, elevation || 0.1, 10]} />
      <meshStandardMaterial color="#2F4858" />
    </mesh>
  );
}

function WindIndicator({ direction = 0, speed = 0 }) {
  return (
    <group position={[0, 5, 0]} rotation={[0, direction * Math.PI / 180, 0]}>
      <mesh>
        <cylinderGeometry args={[0.1, 0.1, speed]} />
        <meshStandardMaterial color="#60A5FA" emissive="#60A5FA" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0, speed / 2, 0]}>
        <coneGeometry args={[0.3, 1, 32]} />
        <meshStandardMaterial color="#60A5FA" emissive="#60A5FA" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

function SunPath({ azimuth = 0, elevation = 45 }) {
  return (
    <group
      position={[0, 10, 0]}
      rotation={[
        (90 - elevation) * Math.PI / 180,
        azimuth * Math.PI / 180,
        0
      ]}
    >
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#FCD34D" emissive="#FCD34D" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

export function Visualization({ data }: VisualizationProps) {
  useEffect(() => {
    console.log('Visualization component received data:', data);
  }, [data]);

  return (
    <div className="w-full h-full bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
      <Canvas camera={{ position: [15, 15, 15], fov: 50 }}>
        <color attach="background" args={['#111827']} />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.6} />
        
        <TerrainMesh elevation={data?.elevation?.height || 0} />
        
        {data?.wind && (
          <WindIndicator
            direction={parseFloat(data.wind.direction) || 0}
            speed={data.wind.speed || 0}
          />
        )}
        
        {data?.sunPath && (
          <SunPath
            azimuth={data.sunPath.azimuth || 0}
            elevation={data.sunPath.elevation || 45}
          />
        )}

        <Text
          position={[0, 6, 0]}
          color="white"
          fontSize={0.5}
          anchorX="center"
          anchorY="middle"
        >
          {`Elevation: ${data?.elevation?.height || 0}m`}
        </Text>

        <OrbitControls />
        <gridHelper args={[20, 20]} color="#374151" />
      </Canvas>
    </div>
  );
}