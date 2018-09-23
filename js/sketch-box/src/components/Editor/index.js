import React from 'react';
import Shape from '../Shape';
import Canvas from '../Canvas';

export default function App() {
  const shape = {
    top: 100,
    left: 100,
    width: 100,
    height: 100,
  };

  return (
    <Canvas style={{ position: 'fixed', top: 20, right: 20, bottom: 20, left: 20 }}>
      <Shape shape={shape} />
    </Canvas>
  );
}
