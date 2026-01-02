
import React, { useEffect, useRef } from 'react';

const BlackHole: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    // Standard fullscreen quad
    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    /**
     * HIGH FIDELITY BLACK HOLE SHADER
     * Features:
     * 1. Iterative Ray Bending (Gravitational Lensing)
     * 2. Volumetric Accretion Disk with Keplerian rotation
     * 3. Relativistic Doppler Beaming (Left side brighter)
     * 4. FBM Noise for gas texture
     * 5. Starfield background with distortion
     */
    const fsSource = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      #define MAX_STEPS 100
      #define STEPSIZE 0.05
      #define MIN_DIST 0.8
      #define DISK_RAD_MIN 1.8
      #define DISK_RAD_MAX 6.0
      #define DISK_HEIGHT 0.15
      
      // --- Noise Functions ---
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

      mat2 rot(float a) {
          float s = sin(a), c = cos(a);
          return mat2(c, -s, s, c);
      }

      void main() {
          // Normalize coordinates
          vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
          
          // Camera Setup
          // Pitch the camera slightly to see the disk structure
          vec3 ro = vec3(0.0, 2.0, -9.0); 
          vec3 rd = normalize(vec3(uv, 1.0));
          
          // Rotate camera pitch
          float tilt = -0.2;
          mat2 tiltMat = rot(tilt);
          ro.yz *= tiltMat;
          rd.yz *= tiltMat;

          vec3 col = vec3(0.0);
          vec3 p = ro;
          
          // Accumulators
          vec3 accDisk = vec3(0.0);
          float glow = 0.0;
          
          // Gravity Parameters
          // We simulate bending by adding a force vector towards center perpendicular to ray direction
          
          for(int i = 0; i < MAX_STEPS; i++) {
              float r = length(p);
              
              // 1. Event Horizon (The Black Hole)
              if (r < MIN_DIST) {
                  // Ray hit the black hole
                  col = vec3(0.0); // Pure black
                  break;
              }

              // 2. Gravity Bending (Simplified Geodesic)
              // Force inversely proportional to square distance
              vec3 force = -normalize(p) * (0.15 / (r * r)); 
              rd = normalize(rd + force * STEPSIZE);
              
              // Move ray
              p += rd * STEPSIZE * 2.0; // Speed up marching for performance

              // 3. Accretion Disk Rendering
              // We check distance to the XZ plane (y=0)
              float distToPlane = abs(p.y);
              float radius = length(p.xz);
              
              // If we are inside the disk volume
              if (distToPlane < DISK_HEIGHT * 3.0 && radius > DISK_RAD_MIN && radius < DISK_RAD_MAX) {
                  
                  // Calculate gas density falloff
                  float density = smoothstep(DISK_HEIGHT, 0.0, distToPlane); // Fade vertically
                  density *= smoothstep(DISK_RAD_MIN, DISK_RAD_MIN + 0.5, radius); // Fade inner
                  density *= smoothstep(DISK_RAD_MAX, DISK_RAD_MAX - 1.0, radius); // Fade outer
                  
                  if (density > 0.01) {
                      // Texture Coordinates (Polar)
                      float angle = atan(p.x, p.z);
                      
                      // Keplerian Rotation: Inner parts spin faster
                      float rotationSpeed = 2.5 / (radius * radius); // 1/r^2 falloff approx
                      float spiral = angle + time * rotationSpeed;
                      
                      // Sample Noise
                      float gas = fbm(vec2(radius * 1.5, spiral * 2.0));
                      
                      // Intensify contrast
                      gas = pow(gas, 3.0) * 4.0;
                      
                      // --- Doppler Beaming ---
                      // Matter on left is approaching (brighter/bluer), right is receding (dimmer/redder)
                      // We assume counter-clockwise rotation seen from top
                      float doppler = 1.0 + dot(normalize(vec3(-p.z, 0.0, p.x)), rd) * 0.8;
                      doppler = clamp(doppler, 0.2, 2.0);
                      
                      // Temperature Gradient Color
                      // Hot/Fast (Inner) -> Cold/Slow (Outer)
                      vec3 hotColor = vec3(0.8, 0.9, 1.0); // Blue-white
                      vec3 coldColor = vec3(1.0, 0.3, 0.05); // Deep orange-red
                      
                      // Mix based on radius and doppler
                      vec3 diskCol = mix(hotColor, coldColor, smoothstep(DISK_RAD_MIN, DISK_RAD_MAX, radius));
                      
                      // Apply Doppler to color intensity and shift
                      diskCol *= doppler;
                      
                      // Add shift to blue for high energy
                      if (doppler > 1.4) diskCol += vec3(0.2, 0.2, 0.5) * 0.2;

                      // Accumulate
                      // Simple alpha blending approximation for volumetric rendering
                      float alpha = density * gas * 0.1; // Low opacity per step
                      accDisk += diskCol * alpha * (1.0 - length(accDisk)); // Front-to-back accumulation
                  }
              }
              
              // 4. Photon Ring (Glow near event horizon)
              if (r < MIN_DIST * 1.5) {
                  glow += 0.002 / (r - MIN_DIST + 0.01);
              }
          }
          
          // Background Stars (if ray didn't hit BH)
          if (length(accDisk) < 0.9) {
             vec2 starUV = rd.xy * 10.0;
             float star = fract(sin(dot(starUV, vec2(12.9898, 78.233))) * 43758.5453);
             if (star > 0.97) {
                 col += vec3(star) * 0.5 * (1.0 - length(accDisk));
             }
          }

          // Combine
          col += accDisk;
          
          // Add Photon Ring Glow
          col += vec3(1.0, 0.8, 0.6) * glow * 0.05;

          // Tone Mapping (ACES approximation)
          col = col / (col + vec3(1.0));
          col = pow(col, vec3(1.0 / 2.2)); // Gamma Correction
          
          // Vignette
          col *= 1.0 - smoothstep(0.5, 1.5, length(uv));

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

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, 'resolution');
    const timeLocation = gl.getUniformLocation(program, 'time');

    let startTime = Date.now();
    let animationFrameId: number;

    const render = () => {
      // Handle resizing
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      
      // Only update drawing buffer size if display size changed
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }

      gl.uniform2f(resolutionLocation, width, height);
      gl.uniform1f(timeLocation, (Date.now() - startTime) * 0.001); // Pass time in seconds

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 1 }} // Ensure visible
    />
  );
};

export default BlackHole;
