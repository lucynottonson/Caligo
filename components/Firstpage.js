"use client";

import React, { useEffect, useRef } from "react";
import p5 from "p5";

export default function FirstPageComponent() {
  const containerRef = useRef(null);

  useEffect(() => {
    let globbyShader;

    // Define the sketch function
    const sketch = (p) => {
      // Preload shader code
      p.preload = function () {
        const vertShader = `
          precision mediump float;
          
          uniform mat4 projectionMatrix;
          uniform mat4 modelViewMatrix;
          uniform float uTime;
          
          attribute vec3 aPosition;
          attribute vec3 aNormal;
          
          varying vec3 vNormal;
          varying vec3 vPosition;
          
          void main() {
            float displacement = sin(uTime + aPosition.y * 10.0) * 10.0;
            vec3 newPosition = aPosition + aNormal * displacement;
            
            vNormal = aNormal;
            vPosition = newPosition;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
          }
        `;

        const fragShader = `
          precision mediump float;
          
          varying vec3 vNormal;
          varying vec3 vPosition;
          uniform float uTime;
          
          void main() {
            vec3 lightDir = normalize(vec3(0.5, 1.0, 0.8));
            vec3 normal = normalize(vNormal);
            float diff = max(dot(normal, lightDir), 0.0);
            
            vec3 viewDir = normalize(-vPosition);
            vec3 reflectDir = reflect(-lightDir, normal);
            float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
            
            vec3 baseColor = vec3(0.2, 0.6, 0.9);
            vec3 color = baseColor * diff + vec3(1.0) * spec;
            
            gl_FragColor = vec4(color, 1.0);
          }
        `;
        globbyShader = p.createShader(vertShader, fragShader);
      };

      p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
        p.noStroke();
      };

      p.draw = function () {
        p.shader(globbyShader);
        globbyShader.setUniform("uTime", p.millis() / 1000.0);
        p.rotateY(p.millis() / 2000.0);
        p.sphere(150, 100, 100);
      };

      p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    };

    const myP5 = new p5(sketch, containerRef.current);

    return () => {
      myP5.remove();
    };
  }, []);

  return <div ref={containerRef} />;
}