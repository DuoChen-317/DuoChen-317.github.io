// A living scene: only the clouds, lake, foliage, and a few leaves move.
// The static CSS image remains visible if WebGL or motion is unavailable.
const wallpaper = document.querySelector('.hero-wallpaper');
const leafCanvas = document.querySelector('.hero-leaves');
const art = document.querySelector('.hero-art');
const motionToggle = document.querySelector('.motion-toggle');
const scene = document.querySelector('.hero-scene');
const seasonButtons = [...document.querySelectorAll('.season-button')];

const seasons = ['spring', 'summer', 'autumn', 'winter'];
const currentSeason = () => {
  const month = new Date().getMonth();
  return month >= 2 && month <= 4 ? 'spring' : month >= 5 && month <= 7 ? 'summer'
    : month >= 8 && month <= 10 ? 'autumn' : 'winter';
};
let storedSeason;
try { storedSeason = localStorage.getItem('tiyamo-season'); } catch { /* Storage can be unavailable. */ }
let activeSeason = seasons.includes(storedSeason) ? storedSeason : currentSeason();
let updateTexture = () => {};
const selectSeason = name => {
  if (!seasons.includes(name) || !art || !scene) return;
  activeSeason = name;
  art.dataset.season = name;
  const source = art.dataset[`${name}Src`];
  scene.style.backgroundImage = `url("${source}")`;
  seasonButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.season === name)));
  updateTexture(source);
  try { localStorage.setItem('tiyamo-season', name); } catch { /* Storage can be unavailable. */ }
};
seasonButtons.forEach(button => button.addEventListener('click', () => selectSeason(button.dataset.season)));
selectSeason(activeSeason);

const header = document.querySelector('.site-header');
const syncHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 48);
window.addEventListener('scroll', syncHeader, { passive: true });
syncHeader();

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
        float sky = smoothstep(0.24, 0.48, uv.y);
        float building = smoothstep(0.76, 0.91, uv.x)
          * (1.0 - smoothstep(0.47, 0.76, uv.y));
        vec3 base = texture2D(uScene, uv).rgb;
        float cloudPixel = smoothstep(0.34, 0.61, dot(base, vec3(0.3, 0.56, 0.14)));

        vec2 sampleUv = uv;
        float drift = sky * cloudPixel * (1.0 - building);
        sampleUv.x += drift * (0.005 * sin(t * 0.29 + uv.y * 8.0) + 0.002 * sin(t * 0.16));
        sampleUv.y += drift * 0.0015 * sin(t * 0.22 + uv.x * 9.0);
        vec3 color = texture2D(uScene, clamp(sampleUv, 0.001, 0.999)).rgb;

        float movingFog = clouds(vec2(uv.x * 4.0 - t * 0.035, uv.y * 7.0));
        float horizon = smoothstep(0.10, 0.26, uv.y) * (1.0 - smoothstep(0.41, 0.57, uv.y));
        color = mix(color, vec3(0.78, 0.82, 0.77), horizon * movingFog * (1.0 - building) * 0.10);
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
        let userPaused = false;
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
              const position = window.matchMedia('(max-width: 760px)').matches ? 0.83
                : window.matchMedia('(max-width: 1000px)').matches ? 0.65 : 0.5;
              gl.uniform4f(cropUniform, (1 - cropWidth) * position, 0, cropWidth, 1);
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
          for (const [index, leaf] of particles.entries()) {
            if (activeSeason === 'summer' && index > 11) continue;
            const x = width * ((leaf.side ? 0.78 : 0.05) + leaf.x * 0.17
              + Math.sin(time * 0.75 + leaf.phase) * 0.05);
            const y = height * ((leaf.y + time * leaf.speed) % 1.15 - 0.08);
            ctx.save();
            ctx.translate(x, y);
            if (activeSeason === 'winter') {
              ctx.globalAlpha = 0.38 + leaf.x * 0.28;
              ctx.fillStyle = '#edf4ef';
              ctx.beginPath(); ctx.arc(0, 0, leaf.size * 0.34, 0, Math.PI * 2); ctx.fill();
            } else if (activeSeason === 'summer') {
              ctx.globalAlpha = 0.26 + Math.sin(time * 1.4 + leaf.phase) ** 2 * 0.32;
              ctx.fillStyle = '#f5d48d';
              ctx.shadowBlur = 12; ctx.shadowColor = '#f5d48d';
              ctx.beginPath(); ctx.arc(0, 0, leaf.size * 0.35, 0, Math.PI * 2); ctx.fill();
            } else {
              ctx.rotate(time * 0.65 + leaf.phase);
              ctx.globalAlpha = activeSeason === 'spring' ? 0.5 : 0.42;
              ctx.fillStyle = activeSeason === 'spring' ? '#f4cfcb' : '#d5a36f';
              ctx.beginPath();
              ctx.ellipse(0, 0, leaf.size * 0.68, leaf.size * 0.44, 0, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.restore();
          }
        };

        const renderFrame = now => {
          frameId = requestAnimationFrame(renderFrame);
          if (now - previousFrame < 32) return;
          previousFrame = now;
          if (!loaded) return;
          const time = now / 1000;
          gl.uniform1f(timeUniform, time);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
          drawLeaves(time);
          wallpaper.classList.add('is-ready');
          leafCanvas.classList.add('is-ready');
        };

        const syncPlayback = () => {
          const shouldPlay = loaded && inView && !document.hidden && !reducedMotion.matches && !userPaused;
          if (shouldPlay && !frameId) frameId = requestAnimationFrame(renderFrame);
          if (!shouldPlay && frameId) {
            cancelAnimationFrame(frameId);
            frameId = 0;
          }
        };

        const syncToggle = () => {
          if (!motionToggle) return;
          motionToggle.hidden = !loaded || reducedMotion.matches;
          motionToggle.setAttribute('aria-pressed', String(userPaused));
          motionToggle.setAttribute('aria-label', userPaused ? motionToggle.dataset.playLabel : motionToggle.dataset.pauseLabel);
          motionToggle.querySelector('.motion-label').textContent = userPaused ? motionToggle.dataset.playLabel : motionToggle.dataset.pauseLabel;
        };
        motionToggle?.addEventListener('click', () => {
          userPaused = !userPaused;
          syncToggle();
          syncPlayback();
        });

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
          syncToggle();
          syncPlayback();
        };
        updateTexture = source => {
          loaded = false;
          wallpaper.classList.remove('is-ready');
          leafCanvas.classList.remove('is-ready');
          syncPlayback();
          image.src = source;
        };
        updateTexture(art.dataset[`${activeSeason}Src`]);

        new ResizeObserver(resize).observe(art);
        new IntersectionObserver(([entry]) => {
          inView = entry.isIntersecting;
          syncPlayback();
        }).observe(art);
        reducedMotion.addEventListener('change', () => { syncToggle(); syncPlayback(); });
        document.addEventListener('visibilitychange', syncPlayback);
      }
    }
  }
}
