// A living scene: clouds, mist, and seasonal particles move.
// The static CSS image remains visible if WebGL or motion is unavailable.
const wallpaper = document.querySelector('.hero-wallpaper');
const leafCanvas = document.querySelector('.hero-leaves');
const art = document.querySelector('.hero-art');
const motionToggle = document.querySelector('.motion-toggle');
const scene = document.querySelector('.hero-scene');
const seasonDock = document.querySelector('.season-dock');
const seasonButtons = [...document.querySelectorAll('.season-button')];
let manualSeason = false;

const seasons = ['spring', 'summer', 'autumn', 'winter'];
const currentSeason = () => {
  const month = new Date().getMonth();
  return month >= 2 && month <= 4 ? 'spring' : month >= 5 && month <= 7 ? 'summer'
    : month >= 8 && month <= 10 ? 'autumn' : 'winter';
};
let activeSeason = currentSeason();
let updateTexture = () => {};
const selectSeason = name => {
  if (!seasons.includes(name) || !art || !scene) return;
  activeSeason = name;
  art.dataset.season = name;
  const source = art.dataset[`${name}Src`];
  scene.style.backgroundImage = `url("${source}")`;
  updateTexture(source);
  if (seasonDock) {
    seasonDock.hidden = false;
    seasonDock.style.setProperty('--season-index', seasons.indexOf(name));
    seasonButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.season === name)));
  }
};
seasonButtons.forEach(button => button.addEventListener('click', () => {
  manualSeason = true;
  selectSeason(button.dataset.season);
}));
seasonDock?.addEventListener('keydown', event => {
  const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
  if (!keys.includes(event.key)) return;
  const index = seasonButtons.indexOf(document.activeElement);
  if (index < 0) return;
  event.preventDefault();
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? seasons.length - 1
    : (index + (event.key === 'ArrowRight' ? 1 : -1) + seasons.length) % seasons.length;
  seasonButtons[next].focus();
  seasonButtons[next].click();
});
selectSeason(activeSeason);
// Recheck the calendar after midnight or when returning to an open tab.
const syncSeason = () => {
  if (manualSeason) return;
  const season = currentSeason();
  if (season !== activeSeason) selectSeason(season);
};
setInterval(syncSeason, 60_000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) syncSeason(); });

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
        const texture = gl.createTexture();
        let loaded = false;
        let inView = true;
        let frameId = 0;
        let previousFrame = 0;
        let userPaused = false;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const ctx = leaves;
        const particles = Array.from({ length: 80 }, (_, index) => ({
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
              gl.uniform4f(cropUniform, 0, 0, 1, cropHeight);
            }
          }
        };

        const drawParticles = time => {
          const width = art.clientWidth;
          const height = art.clientHeight;
          const counts = { spring: 32, summer: 14, autumn: 28, winter: 80 };
          const count = Math.round(counts[activeSeason] * (width < 600 ? 0.55 : 1));
          ctx.clearRect(0, 0, width, height);
          for (const [index, particle] of particles.slice(0, count).entries()) {
            const depth = 0.45 + particle.x * 0.55;
            const wind = activeSeason === 'winter' ? 0.016 : 0.045;
            const x = width * ((particle.x + Math.sin(time * 0.35 + particle.phase) * wind + 1) % 1);
            const fallingSpeed = particle.speed * (activeSeason === 'winter' ? 0.42 : 0.55);
            const y = activeSeason === 'summer'
              ? height * (0.65 + particle.y * 0.29 + Math.sin(time * 0.28 + particle.phase) * 0.035)
              : height * ((particle.y + time * fallingSpeed) % 1.14 - 0.07);
            const size = particle.size * depth;
            const behindCopy = x > width * 0.32 && x < width * 0.68 ? 0.6 : 1;
            ctx.save();
            ctx.translate(x, y);
            if (activeSeason === 'winter') {
              ctx.globalAlpha = (0.32 + depth * 0.42) * behindCopy;
              if (index % 8 === 0) {
                // A few visible six-armed crystals among many distant snow dots.
                ctx.rotate(time * 0.12 + particle.phase);
                ctx.strokeStyle = '#f2f8ff';
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                for (let arm = 0; arm < 6; arm++) {
                  const angle = arm * Math.PI / 3;
                  const radius = size * 0.8;
                  ctx.moveTo(0, 0);
                  ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
                  for (const direction of [-1, 1]) {
                    const branch = angle + direction * Math.PI / 3;
                    ctx.moveTo(Math.cos(angle) * radius * 0.55, Math.sin(angle) * radius * 0.55);
                    ctx.lineTo(Math.cos(angle) * radius * 0.55 + Math.cos(branch) * radius * 0.3,
                      Math.sin(angle) * radius * 0.55 + Math.sin(branch) * radius * 0.3);
                  }
                }
                ctx.stroke();
              } else {
                ctx.fillStyle = '#e8f3ff';
                ctx.beginPath(); ctx.arc(0, 0, size * 0.23, 0, Math.PI * 2); ctx.fill();
              }
            } else if (activeSeason === 'summer') {
              // Fireflies hover near the trees, rather than falling from the sky.
              ctx.globalAlpha = 0.16 + Math.sin(time * 0.75 + particle.phase) ** 4 * 0.48;
              ctx.fillStyle = '#f4edac';
              ctx.shadowBlur = 10; ctx.shadowColor = '#eaf69a';
              ctx.beginPath(); ctx.arc(0, 0, size * 0.28, 0, Math.PI * 2); ctx.fill();
            } else if (activeSeason === 'spring') {
              ctx.rotate(time * 0.45 + particle.phase);
              ctx.scale(0.4 + Math.abs(Math.sin(time * 0.65 + particle.phase)) * 0.6, 1);
              ctx.globalAlpha = (0.45 + depth * 0.25) * behindCopy;
              ctx.fillStyle = index % 3 === 0 ? '#fce2e9' : '#efb1c5';
              // The small notch distinguishes a cherry blossom petal from a leaf.
              ctx.beginPath();
              ctx.moveTo(0, size * 0.85);
              ctx.bezierCurveTo(-size, size * 0.1, -size * 0.75, -size * 0.85, -size * 0.18, -size * 0.7);
              ctx.lineTo(0, -size * 0.4);
              ctx.lineTo(size * 0.18, -size * 0.7);
              ctx.bezierCurveTo(size * 0.75, -size * 0.85, size, size * 0.1, 0, size * 0.85);
              ctx.fill();
            } else {
              ctx.rotate(time * 0.35 + particle.phase);
              ctx.scale(0.45 + Math.abs(Math.sin(time * 0.5 + particle.phase)) * 0.55, 1);
              ctx.globalAlpha = (0.43 + depth * 0.2) * behindCopy;
              ctx.fillStyle = ['#d99543', '#cf6944', '#e8b965', '#b95a3d'][index % 4];
              const outline = [[0,-1], [.22,-.4], [.62,-.66], [.51,-.16], [1,-.1],
                [.54,.28], [.61,.65], [.12,.49], [0,.82], [-.12,.49], [-.61,.65],
                [-.54,.28], [-1,-.1], [-.51,-.16], [-.62,-.66], [-.22,-.4]];
              ctx.beginPath();
              outline.forEach(([px, py], point) => point
                ? ctx.lineTo(px * size, py * size) : ctx.moveTo(px * size, py * size));
              ctx.closePath(); ctx.fill();
              ctx.strokeStyle = '#76422a'; ctx.lineWidth = 0.65;
              ctx.beginPath(); ctx.moveTo(0, -size * 0.62); ctx.lineTo(0, size); ctx.stroke();
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
          drawParticles(time);
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
