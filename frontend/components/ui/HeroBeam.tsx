

import React, { useEffect, useRef } from 'react';

const HeroBeam: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform vec2 uMouse;

      float hash(float n) { return fract(sin(n) * 43758.5453123); }

      float noise(vec2 x) {
        vec2 p = floor(x);
        vec2 f = fract(x);
        f = f * f * (3.0 - 2.0 * f);
        float n = p.x + p.y * 57.0;
        return mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
                   mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y);
      }

      float fbm(vec2 p) {
        float f = 0.0;
        mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
        f += 0.5000 * noise(p); p = m * p;
        f += 0.2500 * noise(p); p = m * p;
        f += 0.1250 * noise(p); p = m * p;
        f += 0.0625 * noise(p); p = m * p;
        return f;
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / resolution.y;
        uv.x *= resolution.y / resolution.x;
        vec2 mouseEffect = uMouse * 0.8; 

        vec2 p = uv;
        float t = time * 1.2;
        
        float noiseInputX = p.x * 2.0 - t + mouseEffect.x;
        float noiseInputY = p.y * 1.5 + mouseEffect.y;
        float distortion = fbm(vec2(noiseInputX, noiseInputY)) * 0.15;
        
        float distFromCenter = abs(p.y + distortion * (p.x + 2.0) * 0.2); 
        float beam = 0.08 / (distFromCenter + 0.02);
        
        float textureInputX = p.x * 5.0 - t * 2.5 - mouseEffect.x * 2.0;
        float textureInputY = p.y * 10.0 - mouseEffect.y * 2.0;
        float horizontalTexture = fbm(vec2(textureInputX, textureInputY));

        float glowPulse = 1.0 + 0.2 * sin(time * 3.0);
        
        vec3 col = vec3(0.0);
        vec3 coreColor = vec3(0.2, 0.6, 1.0);
        vec3 glowColor = vec3(0.1, 0.2, 0.8);
        
        col += coreColor * beam * (0.8 + horizontalTexture * 0.4);
        col += glowColor * beam * 0.8;
        
        float core = 0.025 / (distFromCenter + 0.005);
        col += vec3(1.0, 1.0, 1.0) * core;

        col *= glowPulse;

        float vignette = 1.0 - smoothstep(0.7, 1.5, abs(uv.y));
        col *= vignette;

        col = col / (col + 0.8);
        
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, 'resolution');
    const timeLocation = gl.getUniformLocation(program, 'time');
    const mouseLocation = gl.getUniformLocation(program, 'uMouse');

    let startTime = Date.now();
    let frameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const x = (e.clientX / width) * 2.0 - 1.0;
      const y = -(e.clientY / height) * 2.0 + 1.0;
      targetMouseRef.current = { x, y };
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      if (!canvas) return;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }

      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.1;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.1;

      gl.uniform2f(resolutionLocation, width, height);
      gl.uniform1f(timeLocation, (Date.now() - startTime) * 0.001);
      gl.uniform2f(mouseLocation, mouseRef.current.x, mouseRef.current.y);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      frameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(frameId);
      gl.deleteProgram(program);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

export default HeroBeam;
