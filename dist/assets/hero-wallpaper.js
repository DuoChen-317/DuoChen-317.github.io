// A living scene: only the clouds, lake, foliage, and a few leaves move.
// The static CSS image remains visible if WebGL or motion is unavailable.
const wallpaper = document.querySelector('.hero-wallpaper');
const leafCanvas = document.querySelector('.hero-leaves');
const art = document.querySelector('.hero-art');

if (wallpaper && leafCanvas && art) {
  const gl = wallpaper.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power' });
  const leaves = leafCanvas.getContext('2d');

  if (gl && leaves) {
    const vertexSource = `
      attribute vec2 aPosition;
      varying vec2 vUv;
      void main() {
        vUv = (aPosition + 1.0) * 0.5;
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;
    const fragmentSource = `
      precision highp float;
      uniform sampler2D uScene;
      uniform vec4 uCrop;
      uniform float uTime;
      varying vec2 vUv;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }
      float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + 1.0), f.x), f.y);
      }
      float clouds(vec2 p) {
        return 0.57 * noise(p) + 0.29 * noise(p * 2.03) + 0.14 * noise(p * 4.07);
      }

      void main() {
        vec2 uv = uCrop.xy + vUv * uCrop.zw;
        float t = uTime;
        float valley = smoothstep(0.27, 0.40, uv.y) * (1.0 - smoothstep(0.68, 0.78, uv.y));
        float water = smoothstep(0.08, 0.15, uv.y) * (1.0 - smoothstep(0.27, 0.36, uv.y))
                    * smoothstep(0.34, 0.43, uv.x) * (1.0 - smoothstep(0.70, 0.78, uv.x));
        float falls = smoothstep(0.84, 0.88, uv.x) * (1.0 - smoothstep(0.94, 0.98, uv.x))
                    * smoothstep(0.25, 0.34, uv.y) * (1.0 - smoothstep(0.65, 0.76, uv.y));
        float branches = smoothstep(0.72, 0.87, uv.y) * (1.0 - smoothstep(0.25, 0.48, uv.x));
        vec3 base = texture2D(uScene, uv).rgb;
        float cloudPixel = smoothstep(0.40, 0.68, dot(base, vec3(0.3, 0.56, 0.14)));
        float waterPixel = smoothstep(0.30, 0.58, dot(base, vec3(0.3, 0.56, 0.14)));

        vec2 sampleUv = uv;
        sampleUv.x += valley * cloudPixel * (0.009 * sin(uv.y * 18.0 + t * 0.7)
                     + 0.006 * sin(uv.y * 9.0 - t * 0.34));
        sampleUv.x += water * waterPixel * 0.0025 * sin(uv.y * 120.0 + t * 2.1 + uv.x * 12.0);
        sampleUv.y += falls * cloudPixel * 0.002 * sin(uv.x * 72.0 + t * 2.3);
        sampleUv.x += branches * 0.007 * sin(t * 1.4 + uv.y * 11.0);
        vec3 color = texture2D(uScene, clamp(sampleUv, 0.001, 0.999)).rgb;

        float movingFog = smoothstep(0.48, 0.69,
          clouds(vec2(uv.x * 5.3 - t * 0.10, uv.y * 5.0 + t * 0.018)));
        color = mix(color, vec3(0.82, 0.85, 0.78), valley * cloudPixel * movingFog * 0.38);

        float glint = pow(max(0.0, sin(uv.y * 240.0 + t * 2.8 + sin(uv.x * 36.0 + t))), 8.0);
        color += vec3(0.17, 0.13, 0.07) * water * waterPixel * glint * 0.45;
        float waterfallGlint = pow(max(0.0, sin(uv.y * 95.0 - t * 4.0 + uv.x * 33.0)), 8.0);
        color += vec3(0.10, 0.11, 0.09) * falls * waterfallGlint * cloudPixel * 0.33;
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn('Wallpaper shader unavailable:', gl.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    };

    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    if (vertex && fragment) {
      const program = gl.createProgram();
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.useProgram(program);
        const position = gl.getAttribLocation(program, 'aPosition');
        const cropUniform = gl.getUniformLocation(program, 'uCrop');
        const timeUniform = gl.getUniformLocation(program, 'uTime');
        const sceneUniform = gl.getUniformLocation(program, 'uScene');
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
        gl.uniform1i(sceneUniform, 0);

        const image = new Image();
        let loaded = false;
        let inView = true;
        let frameId = 0;
        let previousFrame = 0;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const ctx = leaves;
        const particles = Array.from({ length: 24 }, (_, index) => ({
          side: index % 2,
          x: ((index * 73) % 101) / 101,
          y: ((index * 47) % 97) / 97,
          speed: 0.05 + (index % 5) * 0.011,
          size: 4.5 + (index % 4) * 1.5,
          phase: index * 1.71
        }));

        const resize = () => {
          const width = art.clientWidth;
          const height = art.clientHeight;
          if (!width || !height) return;
          const scale = Math.min(window.devicePixelRatio || 1, 1.25, 1600 / width, 900 / height);
          const pixelWidth = Math.max(1, Math.round(width * scale));
          const pixelHeight = Math.max(1, Math.round(height * scale));
          if (wallpaper.width !== pixelWidth || wallpaper.height !== pixelHeight) {
            wallpaper.width = leafCanvas.width = pixelWidth;
            wallpaper.height = leafCanvas.height = pixelHeight;
          }
          gl.viewport(0, 0, pixelWidth, pixelHeight);
          ctx.setTransform(scale, 0, 0, scale, 0, 0);
          if (loaded) {
            const imageAspect = image.width / image.height;
            const viewAspect = width / height;
            if (imageAspect > viewAspect) {
              const cropWidth = viewAspect / imageAspect;
              gl.uniform4f(cropUniform, (1 - cropWidth) / 2, 0, cropWidth, 1);
            } else {
              const cropHeight = imageAspect / viewAspect;
              gl.uniform4f(cropUniform, 0, (1 - cropHeight) * 0.57, 1, cropHeight);
            }
          }
        };

        const drawLeaves = time => {
          const width = art.clientWidth;
          const height = art.clientHeight;
          ctx.clearRect(0, 0, width, height);
          for (const leaf of particles) {
            const x = width * ((leaf.side ? 0.78 : 0.05) + leaf.x * 0.17
              + Math.sin(time * 0.75 + leaf.phase) * 0.05);
            const y = height * ((leaf.y + time * leaf.speed) % 1.15 - 0.08);
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(time * 0.65 + leaf.phase);
            ctx.globalAlpha = 0.42 + (leaf.x * 0.30);
            ctx.fillStyle = leaf.side ? '#d5b36f' : '#b5a56a';
            ctx.beginPath();
            ctx.moveTo(0, -leaf.size);
            ctx.quadraticCurveTo(leaf.size * 0.9, 0, 0, leaf.size);
            ctx.quadraticCurveTo(-leaf.size * 0.9, 0, 0, -leaf.size);
            ctx.fill();
            ctx.restore();
          }
        };

        const renderFrame = now => {
          frameId = requestAnimationFrame(renderFrame);
          if (now - previousFrame < 32) return;
          previousFrame = now;
          const time = now / 1000;
          gl.uniform1f(timeUniform, time);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
          drawLeaves(time);
          wallpaper.classList.add('is-ready');
          leafCanvas.classList.add('is-ready');
        };

        const syncPlayback = () => {
          const shouldPlay = loaded && inView && !document.hidden && !reducedMotion.matches;
          if (shouldPlay && !frameId) frameId = requestAnimationFrame(renderFrame);
          if (!shouldPlay && frameId) {
            cancelAnimationFrame(frameId);
            frameId = 0;
          }
        };

        image.onload = () => {
          const texture = gl.createTexture();
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          loaded = true;
          resize();
          syncPlayback();
        };
        image.src = '/assets/sengoku-hero.webp';

        new ResizeObserver(resize).observe(art);
        new IntersectionObserver(([entry]) => {
          inView = entry.isIntersecting;
          syncPlayback();
        }).observe(art);
        reducedMotion.addEventListener('change', syncPlayback);
        document.addEventListener('visibilitychange', syncPlayback);
      }
    }
  }
}
