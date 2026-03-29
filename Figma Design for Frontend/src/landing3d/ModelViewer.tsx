import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF } from '@react-three/drei';
import { ErrorBoundary } from './ErrorBoundary';
import { useInView } from 'framer-motion';
import { useViewerSlot } from './ViewerSlotContext';

function Model({ url }: { url: string }) {
  if (!url) return null;
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

function FallbackContent({ image, name }: { image?: string; name?: string }) {
  if (image) {
    return <img src={image} alt={name || 'Product'} className="w-full h-full object-cover" />;
  }
  return (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-xl">
      <span className="text-gray-400 text-xs text-center p-2">3D view</span>
    </div>
  );
}

export function ModelViewer({
  modelPath,
  className,
  image,
  name,
}: {
  modelPath: string;
  className?: string;
  image?: string;
  name?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.05 });
  const slot = useViewerSlot();
  const [hasSlot, setHasSlot] = useState(false);
  const hadSlotRef = useRef(false);

  useEffect(() => {
    if (!slot) {
      setHasSlot(true);
      return;
    }
    if (isInView) {
      const got = slot.requestSlot();
      hadSlotRef.current = got;
      setHasSlot(got);
      return () => {
        if (hadSlotRef.current) {
          slot.releaseSlot();
          hadSlotRef.current = false;
        }
      };
    } else {
      if (hadSlotRef.current) {
        slot.releaseSlot();
        hadSlotRef.current = false;
      }
      setHasSlot(false);
    }
  }, [isInView, slot]);

  const show3D = isInView && (slot ? hasSlot : true);

  return (
    <ErrorBoundary fallback={<FallbackContent image={image} name={name} />}>
      <div ref={containerRef} className={`absolute inset-0 w-full h-full min-h-[200px] bg-gray-50 rounded-xl overflow-hidden ${className ?? ''}`}>
        {show3D ? (
          <Canvas
            shadows
            camera={{ position: [0, 0, 3], fov: 45 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, preserveDrawingBuffer: true, powerPreference: 'low-power', failIfMajorPerformanceCaveat: false }}
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            <Suspense fallback={null}>
              <Stage environment="city" intensity={0.6} adjustCamera={1.15}>
                <Model url={modelPath} />
              </Stage>
            </Suspense>
            <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} enableZoom={false} />
          </Canvas>
        ) : (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-50">
            {isInView && !hasSlot && slot ? (
              <FallbackContent image={image} name={name} />
            ) : (
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full mb-2" />
                <span className="text-gray-300 text-[10px]">Loading 3D...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
