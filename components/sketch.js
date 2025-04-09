// components/MyP5Sketch.js
import dynamic from 'next/dynamic';
import React from 'react';

// Disable SSR for this component
const ReactP5Wrapper = dynamic(() => import('react-p5-wrapper').then(mod => mod.ReactP5Wrapper), {
  ssr: false,
});

const sketch = (p) => {
  let x = 0;
  p.setup = function () {
    p.createCanvas(400, 400);
  };

  p.draw = function () {
    p.background(220);
    p.ellipse(x, p.height / 2, 50, 50);
    x = (x + 2) % p.width;
  };
};

export default function MyP5Sketch() {
  return <ReactP5Wrapper sketch={sketch} />;
}