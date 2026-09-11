const API_KEY = "b20ca97941e5c4cb4f7c5d3961c051b1";
const API_BASE = "https://api.openweathermap.org/data/2.5";

const elements = {
  form: document.querySelector("#search-form"),
  input: document.querySelector("#city-input"),
  locationButton: document.querySelector("#location-button"),
  soundButton: document.querySelector("#sound-button"),
  ambientAudio: document.querySelector("#ambient-audio"),
  voiceTool: document.querySelector("#voice-tool"),
  voiceButton: document.querySelector("#voice-button"),
  voiceState: document.querySelector("#voice-state"),
  status: document.querySelector("#status"),
  nowTab: document.querySelector("#now-tab"),
  tomorrowTab: document.querySelector("#tomorrow-tab"),
  content: document.querySelector("#weather-content"),
  viewLabel: document.querySelector("#view-label"),
  city: document.querySelector("#city-name"),
  date: document.querySelector("#current-date"),
  icon: document.querySelector("#weather-icon"),
  temperature: document.querySelector("#temperature"),
  condition: document.querySelector("#condition"),
  feelsLike: document.querySelector("#feels-like"),
  humidity: document.querySelector("#humidity"),
  wind: document.querySelector("#wind"),
  visibility: document.querySelector("#visibility"),
  forecastTitle: document.querySelector("#forecast-title"),
  forecast: document.querySelector("#forecast"),
  updated: document.querySelector("#updated-at")
};

let weatherData;
let activeView = "now";
let voicePhase = "idle";
let recognition;
let recognitionLanguage = "es-419";
let voiceUnavailable = false;
let soundEnabled = false;

const weatherIcons = {
  Clear: "☀",
  Clouds: "☁",
  Rain: "☂",
  Drizzle: "☂",
  Thunderstorm: "ϟ",
  Snow: "❄",
  Mist: "≋",
  Smoke: "≋",
  Haze: "≋",
  Dust: "≋",
  Fog: "≋",
  Sand: "≋",
  Ash: "≋",
  Squall: "≋",
  Tornado: "ϟ"
};

const spanishConditions = {
  Clear: "Despejado",
  Clouds: "Nublado",
  Rain: "Lluvia",
  Drizzle: "Llovizna",
  Thunderstorm: "Tormenta",
  Snow: "Nieve",
  Mist: "Neblina",
  Smoke: "Humo",
  Haze: "Calima",
  Dust: "Polvo",
  Fog: "Niebla",
  Sand: "Arena",
  Ash: "Ceniza",
  Squall: "Ráfagas",
  Tornado: "Tornado"
};

function setStatus(message = "") { elements.status.textContent = message; }
function celsius(value) { return Math.round(value); }
function dayName(timestamp) { return new Intl.DateTimeFormat("es", { weekday: "short" }).format(new Date(timestamp * 1000)).replace(".", ""); }
function formatDate(timestamp) { return new Intl.DateTimeFormat("es", { weekday: "long", day: "numeric", month: "short" }).format(new Date(timestamp * 1000)); }
function iconFor(condition) { return weatherIcons[condition] || "·"; }
function apiError(response, fallback) { return response.status === 401 ? new Error("La API key no está autorizada.") : new Error(fallback); }
function localDateKey(timestamp, timezoneOffset) {
  return new Date((timestamp + timezoneOffset) * 1000).toISOString().slice(0, 10);
}

class WeatherFX {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.width = 0;
    this.height = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.rafId = null;
    this.lastTime = performance.now();
    this.paused = false;

    this.state = {
      type: "clear",
      isNight: false,
      windSpeed: 2.5,
      windTilt: 0,
      cloudiness: 20,
      rainIntensity: 0.5,
      snowIntensity: 0.5,
      visibility: 10000,
      description: ""
    };

    this.particles = [];
    this.clouds = [];
    this.splashes = [];
    this.stars = [];
    this.sunMotes = [];
    this.mistLayers = [];
    this.sunRaysAngle = 0;
    this.meteor = null;
    this.lastMeteorTime = performance.now();
    this.lightning = { active: false, opacity: 0, timer: performance.now() + 5000, strikeTime: 0, bolts: [] };

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener("resize", () => this.resize());
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    });

    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotionQuery.matches) {
      this.paused = true;
    }
    reduceMotionQuery.addEventListener("change", (e) => {
      this.paused = e.matches;
      if (!this.paused) this.resume();
    });

    this.startLoop();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width || window.innerWidth;
    this.height = rect.height || window.innerHeight;
    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.dpr, this.dpr);
    this.rebuildEntities();
  }

  pause() {
    this.paused = true;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  resume() {
    if (this.paused && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.paused = false;
      this.lastTime = performance.now();
      this.startLoop();
    }
  }

  startLoop() {
    if (this.rafId) return;
    const loop = (now) => {
      if (this.paused) return;
      const dt = Math.min((now - this.lastTime) / 1000, 0.1);
      this.lastTime = now;
      this.update(dt, now);
      this.draw(now);
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  setWeather(params) {
    const main = params.main || "Clear";
    const desc = (params.description || "").toLowerCase();
    const id = params.id || 800;
    const isNight = !!params.isNight;
    const windSpeed = typeof params.windSpeed === "number" ? params.windSpeed : 3;
    const clouds = typeof params.clouds === "number" ? params.clouds : 0;
    const visibility = typeof params.visibility === "number" ? params.visibility : 10000;

    let type = "clear";
    let rainIntensity = 0.5;
    let snowIntensity = 0.5;

    if (main === "Thunderstorm" || (id >= 200 && id < 300)) {
      type = "thunderstorm";
      rainIntensity = 0.95;
    } else if (main === "Rain" || main === "Drizzle" || (id >= 300 && id < 600)) {
      type = "rain";
      if ((id >= 300 && id < 400) || desc.includes("llovizna") || desc.includes("drizzle")) {
        rainIntensity = 0.25;
      } else if (id === 500 || desc.includes("ligera") || desc.includes("light")) {
        rainIntensity = 0.4;
      } else if (id === 501 || desc.includes("moderada") || desc.includes("moderate")) {
        rainIntensity = 0.65;
      } else {
        rainIntensity = 0.95;
      }
    } else if (main === "Snow" || (id >= 600 && id < 700)) {
      type = "snow";
      if (desc.includes("ligera") || id === 600) snowIntensity = 0.3;
      else if (desc.includes("fuerte") || desc.includes("densa") || id === 602) snowIntensity = 0.95;
      else snowIntensity = 0.6;
    } else if (["Mist", "Smoke", "Haze", "Dust", "Fog", "Sand", "Ash", "Squall"].includes(main) || (id >= 700 && id < 800)) {
      type = "mist";
    } else if (main === "Clouds" || (id > 800 && id < 900)) {
      type = "clouds";
    } else {
      type = "clear";
    }

    const windTilt = Math.max(-0.7, Math.min(0.7, (windSpeed - 2) * 0.045));

    this.state = {
      type,
      isNight,
      windSpeed,
      windTilt,
      cloudiness: clouds,
      rainIntensity,
      snowIntensity,
      visibility,
      description: desc
    };

    this.rebuildEntities();
  }

  rebuildEntities() {
    if (!this.width || !this.height) return;
    const w = this.width;
    const h = this.height;

    this.particles = [];
    this.splashes = [];

    if (this.state.type === "clear") {
      if (this.state.isNight) {
        this.stars = [];
        const starCount = Math.floor(Math.min(140, (w * h) / 7500));
        for (let i = 0; i < starCount; i++) {
          this.stars.push({
            x: Math.random() * w,
            y: Math.random() * h * 0.75,
            radius: 0.5 + Math.random() * 1.5,
            baseAlpha: 0.35 + Math.random() * 0.55,
            twinkleSpeed: 1.2 + Math.random() * 2.5,
            twinklePhase: Math.random() * Math.PI * 2
          });
        }
      } else {
        this.sunMotes = [];
        const moteCount = 42;
        for (let i = 0; i < moteCount; i++) {
          this.sunMotes.push({
            x: Math.random() * w,
            y: Math.random() * h,
            radius: 1 + Math.random() * 2,
            speedY: -0.15 - Math.random() * 0.35,
            speedX: (Math.random() - 0.5) * 0.35,
            alpha: 0.2 + Math.random() * 0.55,
            pulseSpeed: 1 + Math.random() * 2,
            pulsePhase: Math.random() * Math.PI * 2
          });
        }
      }
    } else if (this.state.type === "rain" || this.state.type === "thunderstorm") {
      const baseCount = this.state.type === "thunderstorm" ? 380 : Math.round(90 + this.state.rainIntensity * 260);
      const dropCount = Math.floor(baseCount * Math.min(1.2, w / 900));

      for (let i = 0; i < dropCount; i++) {
        const speed = (12 + this.state.rainIntensity * 12) * (0.85 + Math.random() * 0.3);
        this.particles.push({
          x: Math.random() * (w + 240) - 120,
          y: Math.random() * h,
          speed,
          length: (14 + this.state.rainIntensity * 18) * (0.8 + Math.random() * 0.4),
          width: 1 + (this.state.rainIntensity > 0.6 ? 0.7 : 0.2) * Math.random(),
          alpha: 0.35 + Math.random() * 0.4
        });
      }
    } else if (this.state.type === "snow") {
      const baseCount = Math.round(70 + this.state.snowIntensity * 150);
      const flakeCount = Math.floor(baseCount * Math.min(1.2, w / 900));

      for (let i = 0; i < flakeCount; i++) {
        const depth = 0.35 + Math.random() * 0.65;
        this.particles.push({
          x: Math.random() * (w + 160) - 80,
          y: Math.random() * h,
          depth,
          radius: depth * (1.6 + Math.random() * 2.6),
          speedY: depth * (0.7 + Math.random() * 1.3),
          swayAmp: depth * (1.5 + Math.random() * 2.5),
          swaySpeed: 0.02 + Math.random() * 0.025,
          phase: Math.random() * Math.PI * 2,
          alpha: 0.35 + depth * 0.55
        });
      }
    } else if (this.state.type === "clouds") {
      this.clouds = [];
      const clusterCount = Math.max(3, Math.min(9, Math.round((this.state.cloudiness / 100) * 8) + 1));
      for (let i = 0; i < clusterCount; i++) {
        const scale = 0.7 + Math.random() * 0.7;
        const puffCount = 5 + Math.floor(Math.random() * 4);
        const puffs = [];
        for (let p = 0; p < puffCount; p++) {
          puffs.push({
            dx: (p - puffCount / 2) * 45 * scale + (Math.random() - 0.5) * 20,
            dy: (Math.random() - 0.5) * 25 * scale,
            r: (40 + Math.random() * 35) * scale
          });
        }
        this.clouds.push({
          x: (i / clusterCount) * (w + 400) - 200,
          y: 50 + Math.random() * (h * 0.42),
          puffs,
          speed: (0.15 + this.state.windSpeed * 0.04) * (0.8 + Math.random() * 0.4),
          alpha: (0.18 + (this.state.cloudiness / 100) * 0.22) * (0.85 + Math.random() * 0.3)
        });
      }
    } else if (this.state.type === "mist") {
      this.mistLayers = [];
      const count = 5;
      for (let i = 0; i < count; i++) {
        this.mistLayers.push({
          y: h * 0.2 + (i / count) * (h * 0.65),
          height: 90 + Math.random() * 60,
          speed: (0.12 + Math.random() * 0.16) * (i % 2 === 0 ? 1 : -1),
          phase: Math.random() * Math.PI * 2,
          alpha: 0.15 + (1 - Math.min(1, this.state.visibility / 10000)) * 0.25
        });
      }
    }
  }

  triggerLightning(now) {
    this.lightning.active = true;
    this.lightning.strikeTime = now;
    this.lightning.opacity = 0.95;
    this.lightning.bolts = [];

    const w = this.width;
    const startX = w * (0.2 + Math.random() * 0.6);
    const bolt = [];
    let currX = startX;
    let currY = 0;
    const targetY = this.height * (0.55 + Math.random() * 0.35);

    bolt.push({ x: currX, y: currY });
    while (currY < targetY) {
      currY += 12 + Math.random() * 16;
      currX += (Math.random() - 0.5) * 36;
      bolt.push({ x: currX, y: currY });

      if (Math.random() < 0.22 && bolt.length > 3) {
        const branch = [{ x: currX, y: currY }];
        let bX = currX;
        let bY = currY;
        for (let b = 0; b < 4; b++) {
          bY += 10 + Math.random() * 12;
          bX += (Math.random() - 0.4) * 32;
          branch.push({ x: bX, y: bY });
        }
        this.lightning.bolts.push(branch);
      }
    }
    this.lightning.bolts.unshift(bolt);

    const shell = document.querySelector(".weather-shell");
    if (shell) shell.classList.add("is-flash");
  }

  update(dt, now) {
    const w = this.width;
    const h = this.height;
    const windTilt = this.state.windTilt;

    if (this.state.type === "clear") {
      if (this.state.isNight) {
        if (!this.meteor && now - this.lastMeteorTime > 9000 + Math.random() * 10000) {
          this.lastMeteorTime = now;
          const startX = Math.random() * w * 0.8;
          const startY = Math.random() * h * 0.3;
          this.meteor = {
            x: startX,
            y: startY,
            len: 90 + Math.random() * 70,
            dx: 8 + Math.random() * 6,
            dy: 5 + Math.random() * 4,
            life: 1.0,
            decay: 0.035
          };
        }
        if (this.meteor) {
          this.meteor.x += this.meteor.dx;
          this.meteor.y += this.meteor.dy;
          this.meteor.life -= this.meteor.decay;
          if (this.meteor.life <= 0) this.meteor = null;
        }
      } else {
        this.sunRaysAngle += dt * 0.035;
        for (const m of this.sunMotes) {
          m.y += m.speedY;
          m.x += m.speedX + windTilt * 0.3;
          if (m.y < -10) {
            m.y = h + 10;
            m.x = Math.random() * w;
          }
          if (m.x < -20) m.x = w + 20;
          if (m.x > w + 20) m.x = -20;
        }
      }
    } else if (this.state.type === "rain" || this.state.type === "thunderstorm") {
      const windSpeedFactor = windTilt * 0.45;
      for (const drop of this.particles) {
        drop.y += drop.speed;
        drop.x += drop.speed * windSpeedFactor;

        if (drop.y >= h - 25) {
          if (Math.random() < 0.28) {
            this.splashes.push({
              x: drop.x,
              y: Math.min(h - 5, drop.y + Math.random() * 15),
              radius: 1,
              maxRadius: 4 + Math.random() * 5,
              alpha: 0.45
            });
          }
          drop.y = -drop.length - Math.random() * 40;
          drop.x = Math.random() * (w + 240) - 120;
        }
      }

      for (let i = this.splashes.length - 1; i >= 0; i--) {
        const s = this.splashes[i];
        s.radius += 0.45;
        s.alpha -= 0.04;
        if (s.alpha <= 0 || s.radius >= s.maxRadius) {
          this.splashes.splice(i, 1);
        }
      }

      if (this.state.type === "thunderstorm") {
        if (now > this.lightning.timer) {
          this.triggerLightning(now);
        }
        if (this.lightning.active) {
          const elapsed = now - this.lightning.strikeTime;
          if (elapsed < 60) {
            this.lightning.opacity = 0.9;
          } else if (elapsed < 110) {
            this.lightning.opacity = 0.25;
          } else if (elapsed < 190) {
            this.lightning.opacity = 1.0;
          } else if (elapsed < 420) {
            this.lightning.opacity = Math.max(0, 1 - (elapsed - 190) / 230);
          } else {
            this.lightning.active = false;
            this.lightning.opacity = 0;
            this.lightning.timer = now + 4000 + Math.random() * 7000;
            const shell = document.querySelector(".weather-shell");
            if (shell) shell.classList.remove("is-flash");
          }
        }
      }
    } else if (this.state.type === "snow") {
      for (const flake of this.particles) {
        flake.phase += flake.swaySpeed;
        flake.x += Math.sin(flake.phase) * flake.swayAmp + windTilt * flake.speedY * 2.2;
        flake.y += flake.speedY;

        if (flake.y > h + 10) {
          flake.y = -10;
          flake.x = Math.random() * (w + 160) - 80;
        }
        if (flake.x < -40) flake.x = w + 40;
        if (flake.x > w + 40) flake.x = -40;
      }
    } else if (this.state.type === "clouds") {
      for (const c of this.clouds) {
        c.x += c.speed;
        if (c.x > w + 260) {
          c.x = -260;
        }
      }
    } else if (this.state.type === "mist") {
      for (const m of this.mistLayers) {
        m.phase += 0.008;
      }
    }
  }

  draw(now) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);

    if (this.state.type === "clear") {
      if (this.state.isNight) {
        for (const s of this.stars) {
          const twinkle = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(now * 0.002 * s.twinkleSpeed + s.twinklePhase));
          ctx.fillStyle = `rgba(240, 245, 255, ${s.baseAlpha * twinkle})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        if (this.meteor) {
          const m = this.meteor;
          const grad = ctx.createLinearGradient(m.x - m.dx * 8, m.y - m.dy * 8, m.x, m.y);
          grad.addColorStop(0, "rgba(255, 255, 255, 0)");
          grad.addColorStop(1, `rgba(255, 250, 240, ${m.life * 0.8})`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(m.x - m.dx * 8, m.y - m.dy * 8);
          ctx.lineTo(m.x, m.y);
          ctx.stroke();
        }

        const moonX = w * 0.84;
        const moonY = h * 0.16;
        const moonGrad = ctx.createRadialGradient(moonX, moonY, 15, moonX, moonY, 120);
        moonGrad.addColorStop(0, "rgba(220, 230, 255, 0.16)");
        moonGrad.addColorStop(0.5, "rgba(180, 205, 245, 0.06)");
        moonGrad.addColorStop(1, "rgba(180, 205, 245, 0)");
        ctx.fillStyle = moonGrad;
        ctx.beginPath();
        ctx.arc(moonX, moonY, 120, 0, Math.PI * 2);
        ctx.fill();

      } else {
        const sunX = w * 0.82;
        const sunY = h * 0.15;
        const breathe = Math.sin(now * 0.0016) * 10;

        const sunGrad = ctx.createRadialGradient(sunX, sunY, 20, sunX, sunY, 160 + breathe);
        sunGrad.addColorStop(0, "rgba(255, 220, 160, 0.38)");
        sunGrad.addColorStop(0.4, "rgba(255, 180, 110, 0.14)");
        sunGrad.addColorStop(1, "rgba(255, 180, 110, 0)");
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 160 + breathe, 0, Math.PI * 2);
        ctx.fill();

        for (const m of this.sunMotes) {
          const alphaPulse = m.alpha * (0.6 + 0.4 * Math.sin(now * 0.002 * m.pulseSpeed + m.pulsePhase));
          ctx.fillStyle = `rgba(255, 235, 195, ${alphaPulse})`;
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (this.state.type === "rain" || this.state.type === "thunderstorm") {
      const windSpeedFactor = this.state.windTilt * 0.45;

      ctx.lineCap = "round";
      for (const drop of this.particles) {
        ctx.lineWidth = drop.width;
        ctx.strokeStyle = `rgba(215, 235, 255, ${drop.alpha})`;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + drop.length * windSpeedFactor, drop.y + drop.length);
        ctx.stroke();
      }

      for (const s of this.splashes) {
        ctx.strokeStyle = `rgba(230, 242, 255, ${s.alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(s.x, s.y, s.radius * 1.6, s.radius * 0.5, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (this.state.type === "thunderstorm" && this.lightning.active && this.lightning.opacity > 0) {
        ctx.fillStyle = `rgba(255, 252, 245, ${this.lightning.opacity * 0.35})`;
        ctx.fillRect(0, 0, w, h);

        ctx.save();
        ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
        ctx.shadowBlur = 15;
        for (const bolt of this.lightning.bolts) {
          if (bolt.length < 2) continue;
          ctx.strokeStyle = `rgba(255, 255, 255, ${this.lightning.opacity * 0.9})`;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(bolt[0].x, bolt[0].y);
          for (let i = 1; i < bolt.length; i++) {
            ctx.lineTo(bolt[i].x, bolt[i].y);
          }
          ctx.stroke();
        }
        ctx.restore();
      }
    } else if (this.state.type === "snow") {
      for (const flake of this.particles) {
        ctx.fillStyle = `rgba(248, 252, 255, ${flake.alpha})`;
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (this.state.type === "clouds") {
      for (const c of this.clouds) {
        for (const p of c.puffs) {
          const px = c.x + p.dx;
          const py = c.y + p.dy;
          const puffGrad = ctx.createRadialGradient(px, py, 0, px, py, p.r);
          puffGrad.addColorStop(0, `rgba(255, 248, 240, ${c.alpha})`);
          puffGrad.addColorStop(0.6, `rgba(245, 240, 235, ${c.alpha * 0.5})`);
          puffGrad.addColorStop(1, "rgba(240, 235, 230, 0)");
          ctx.fillStyle = puffGrad;
          ctx.beginPath();
          ctx.arc(px, py, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (this.state.type === "mist") {
      for (const m of this.mistLayers) {
        const mistGrad = ctx.createLinearGradient(0, m.y - m.height / 2, 0, m.y + m.height / 2);
        const waveAlpha = m.alpha * (0.8 + 0.2 * Math.sin(m.phase));
        mistGrad.addColorStop(0, "rgba(235, 240, 245, 0)");
        mistGrad.addColorStop(0.5, `rgba(235, 240, 245, ${waveAlpha})`);
        mistGrad.addColorStop(1, "rgba(235, 240, 245, 0)");
        ctx.fillStyle = mistGrad;
        ctx.fillRect(0, m.y - m.height / 2, w, m.height);
      }
    }
  }
}

let weatherFXInstance = null;

function updateWeatherIconAnimation(condition, isNight) {
  const iconEl = elements.icon;
  if (!iconEl) return;
  iconEl.className = "weather-icon";
  if (condition === "Clear") {
    iconEl.classList.add(isNight ? "anim-moon" : "anim-sun");
  } else if (condition === "Clouds") {
    iconEl.classList.add("anim-cloud");
  } else if (condition === "Rain" || condition === "Drizzle") {
    iconEl.classList.add("anim-rain");
  } else if (condition === "Thunderstorm") {
    iconEl.classList.add("anim-thunder");
  } else if (condition === "Snow") {
    iconEl.classList.add("anim-snow");
  } else if (["Mist", "Fog", "Haze", "Dust", "Smoke", "Sand", "Ash", "Squall", "Tornado"].includes(condition)) {
    iconEl.classList.add("anim-mist");
  }
}

function setWeatherEffect(data) {
  const item = typeof data === "string" ? { main: data } : data;
  const weatherObj = (item.weather && item.weather[0]) ? item.weather[0] : {};
  const main = item.main || weatherObj.main || "Clear";
  const desc = item.description || weatherObj.description || "";
  const id = item.id || weatherObj.id || 800;
  const icon = item.icon || weatherObj.icon || "01d";
  const isNight = icon.includes("n");
  const windSpeed = item.wind ? item.wind.speed : 3;
  const windDeg = item.wind ? item.wind.deg : 0;
  const clouds = item.clouds ? item.clouds.all : 0;
  const visibility = item.visibility || 10000;

  if (weatherFXInstance) {
    weatherFXInstance.setWeather({
      main,
      description: desc,
      id,
      isNight,
      windSpeed,
      windDeg,
      clouds,
      visibility
    });
  }

  const shell = document.querySelector(".weather-shell");
  if (shell) {
    shell.className = shell.className.replace(/\bis-[\w-]+\b/g, "").trim();
    if (main === "Clear") {
      shell.classList.add(isNight ? "is-clear-night" : "is-clear-day");
    } else if (main === "Rain" || main === "Drizzle") {
      shell.classList.add("is-rain");
    } else if (main === "Thunderstorm") {
      shell.classList.add("is-thunderstorm");
    } else if (main === "Snow") {
      shell.classList.add("is-snow");
    } else if (["Mist", "Fog", "Haze", "Dust", "Smoke", "Sand", "Ash", "Squall", "Tornado"].includes(main)) {
      shell.classList.add("is-mist");
    } else if (main === "Clouds") {
      shell.classList.add("is-clouds");
    } else {
      shell.classList.add(isNight ? "is-clear-night" : "is-clear-day");
    }
  }

  updateWeatherIconAnimation(main, isNight);
}

async function toggleAmbientSound() {
  if (soundEnabled) {
    elements.ambientAudio.pause();
    soundEnabled = false;
    elements.soundButton.classList.remove("is-on");
    elements.soundButton.setAttribute("aria-label", "Activar sonido ambiente");
    return;
  }
  try {
    await elements.ambientAudio.play();
    soundEnabled = true;
    elements.soundButton.classList.add("is-on");
    elements.soundButton.setAttribute("aria-label", "Desactivar sonido ambiente");
  } catch (error) {
    setStatus("El sonido no pudo iniciarse. Pulsa de nuevo para intentarlo.");
  }
}

// Adaptadores de voz sobre los datos y vistas que ya existen en el widget.
function obtenerClimaActual() {
  if (!weatherData) throw new Error("El clima todavía se está cargando.");
  setActiveView("now");
  return { temperature: elements.temperature.textContent, condition: elements.condition.textContent };
}

function obtenerClimaManana() {
  if (!weatherData) throw new Error("El pronóstico todavía se está cargando.");
  setActiveView("tomorrow");
  return { temperature: elements.temperature.textContent, condition: elements.condition.textContent };
}

function obtenerTemperaturaActual() {
  if (!weatherData) throw new Error("El clima todavía se está cargando.");
  setActiveView("now");
  return { temperature: elements.temperature.textContent };
}

function normalizeVoiceText(text) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function setVoiceState(phase, message = "") {
  voicePhase = phase;
  const labels = { idle: "voz inactiva", listening: "escuchando...", processing: "procesando...", speaking: "hablando..." };
  elements.voiceTool.classList.toggle("is-listening", phase === "listening");
  elements.voiceTool.classList.toggle("is-processing", phase === "processing");
  elements.voiceTool.classList.toggle("is-speaking", phase === "speaking");
  elements.voiceState.textContent = message || labels[phase];
  elements.voiceButton.setAttribute("aria-label", phase === "listening" ? "Detener comandos de voz" : "Activar comandos de voz");
}

function speakWeather(message) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  setVoiceState("speaking");
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = recognitionLanguage;
  utterance.rate = 0.98;
  utterance.pitch = 1;
  utterance.onend = () => setVoiceState("idle");
  utterance.onerror = () => setVoiceState("idle", "voz no disponible");
  window.speechSynthesis.speak(utterance);
}

let pendingWeatherReading = false;

function speakTodayWeather() {
  if (!weatherData) {
    pendingWeatherReading = true;
    return;
  }
  const result = obtenerClimaActual();
  speakWeather(`El clima de hoy en ${elements.city.textContent} es ${result.condition.toLowerCase()} con ${result.temperature} grados.`);
}

window.addEventListener("message", (event) => {
  if (event.source !== window.parent || event.data?.type !== "read-weather-today") return;
  speakTodayWeather();
});

function processVoiceCommand(transcript) {
  const command = normalizeVoiceText(transcript);
  setVoiceState("processing");
  try {
    if (command.includes("manana")) {
      const result = obtenerClimaManana();
      speakWeather(`Mañana en ${elements.city.textContent}: ${result.condition.toLowerCase()} con ${result.temperature} grados.`);
    } else if (command.includes("temperatura")) {
      const result = obtenerTemperaturaActual();
      speakWeather(`La temperatura actual en ${elements.city.textContent} es de ${result.temperature} grados.`);
    } else if (command.includes("ahora") || command.includes("hoy")) {
      const result = obtenerClimaActual();
      speakWeather(`El clima ahora en ${elements.city.textContent} es ${result.condition.toLowerCase()} con ${result.temperature} grados.`);
    } else {
      setVoiceState("idle");
      setStatus("No entendí el comando. Di clima ahora, clima mañana o temperatura hoy.");
      speakWeather("No entendí el comando. Puedes decir clima ahora, clima mañana o temperatura hoy.");
    }
  } catch (error) {
    setVoiceState("idle");
    setStatus(error.message);
    speakWeather(error.message);
  }
}

function setupVoiceRecognition() {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const secureContext = window.isSecureContext || ["localhost", "127.0.0.1"].includes(window.location.hostname);
  if (!Recognition || !("speechSynthesis" in window) || !secureContext) {
    voiceUnavailable = true;
    elements.voiceTool.hidden = true;
    elements.status.textContent = "Función de voz no disponible en este navegador o contexto. Usa HTTPS o localhost.";
    return;
  }

  recognition = new Recognition();
  recognition.lang = recognitionLanguage;
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.onstart = () => setVoiceState("listening");
  recognition.onresult = (event) => processVoiceCommand(event.results[0][0].transcript);
  recognition.onerror = (event) => {
    if (event.error === "language-not-supported" && recognitionLanguage === "es-419") {
      recognitionLanguage = "es-ES";
      recognition.lang = recognitionLanguage;
      setVoiceState("idle", "intenta de nuevo");
      return;
    }
    setVoiceState("idle");
    if (event.error !== "no-speech" && event.error !== "aborted") setStatus("No pude escuchar el comando. Intenta de nuevo.");
  };
  recognition.onend = () => {
    if (voicePhase === "listening") setVoiceState("idle");
  };
  elements.voiceButton.addEventListener("click", toggleVoiceRecognition);
}

function toggleVoiceRecognition() {
  if (voicePhase === "speaking" || voicePhase === "processing") {
    window.speechSynthesis.cancel();
    setVoiceState("idle");
    return;
  }
  if (voicePhase === "listening") {
    recognition.stop();
    setVoiceState("idle");
    return;
  }
  window.speechSynthesis.cancel();
  setStatus("");
  try {
    recognition.start();
  } catch (error) {
    setVoiceState("idle");
    setStatus("No se pudo activar el micrófono.");
  }
}

async function getWeather(city) {
  const currentResponse = await fetch(`${API_BASE}/weather?q=${encodeURIComponent(city)}&units=metric&lang=es&appid=${API_KEY}`);
  if (!currentResponse.ok) throw currentResponse.status === 404 ? new Error("No encontramos esa ciudad.") : apiError(currentResponse, "No pudimos leer el clima.");
  const current = await currentResponse.json();
  const forecastResponse = await fetch(`${API_BASE}/forecast?lat=${current.coord.lat}&lon=${current.coord.lon}&units=metric&lang=es&appid=${API_KEY}`);
  if (!forecastResponse.ok) throw apiError(forecastResponse, "El pronóstico no está disponible ahora.");
  return { current, forecast: await forecastResponse.json() };
}

async function getWeatherByCoordinates(latitude, longitude) {
  const currentResponse = await fetch(`${API_BASE}/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=es&appid=${API_KEY}`);
  if (!currentResponse.ok) throw apiError(currentResponse, "No pudimos usar esta ubicación.");
  const current = await currentResponse.json();
  const forecastResponse = await fetch(`${API_BASE}/forecast?lat=${latitude}&lon=${longitude}&units=metric&lang=es&appid=${API_KEY}`);
  if (!forecastResponse.ok) throw apiError(forecastResponse, "El pronóstico no está disponible ahora.");
  return { current, forecast: await forecastResponse.json() };
}

function renderForecast(list) {
  const days = list.filter((item) => item.dt_txt.includes("12:00:00")).slice(0, 4);
  elements.forecast.classList.remove("is-hourly");
  elements.forecast.setAttribute("aria-label", "Pronóstico de los próximos días");
  elements.forecast.innerHTML = days.map((item) => `
    <div class="forecast-day">
      <span>${dayName(item.dt)}</span>
      <div class="forecast-icon" aria-hidden="true">${iconFor(item.weather[0].main)}</div>
      <strong>${celsius(item.main.temp)}°</strong>
      <small>${celsius(item.main.temp_min)}°</small>
    </div>
  `).join("");
}

function formatHour(timestamp, timezoneOffset) {
  return new Date((timestamp + timezoneOffset) * 1000).toISOString().slice(11, 16);
}

function renderHourlyForecast(list, timezoneOffset) {
  elements.forecast.classList.add("is-hourly");
  elements.forecast.setAttribute("aria-label", "Pronóstico de mañana por horas");
  elements.forecast.innerHTML = list.map((item) => `
    <div class="forecast-day hourly-day">
      <span>${formatHour(item.dt, timezoneOffset)}</span>
      <div class="forecast-icon" aria-hidden="true">${iconFor(item.weather[0].main)}</div>
      <strong>${celsius(item.main.temp)}°</strong>
      <small>${spanishConditions[item.weather[0].main] || item.weather[0].description}</small>
    </div>
  `).join("");
}

function renderReading(current, forecastItem, isTomorrow) {
  const condition = forecastItem.weather[0].main;
  const isNight = forecastItem.weather[0].icon ? forecastItem.weather[0].icon.includes("n") : false;
  elements.viewLabel.textContent = isTomorrow ? "mañana en" : "ahora en";
  elements.city.textContent = `${current.name}, ${current.sys.country}`;
  elements.date.textContent = formatDate(forecastItem.dt);
  elements.icon.textContent = isNight && condition === "Clear" ? "☾" : iconFor(condition);
  elements.temperature.textContent = celsius(forecastItem.main.temp);
  elements.condition.textContent = spanishConditions[condition] || forecastItem.weather[0].description;
  elements.feelsLike.textContent = `sensación de ${celsius(forecastItem.main.feels_like)}°`;
  elements.humidity.textContent = `${forecastItem.main.humidity}%`;
  elements.wind.textContent = `${Math.round(forecastItem.wind.speed * 3.6)} km/h`;
  elements.visibility.textContent = `${((forecastItem.visibility || 10000) / 1000).toFixed(1)} km`;
  updateWeatherIconAnimation(condition, isNight);
}

function renderWeather({ current, forecast }) {
  weatherData = { current, forecast };
  activeView = "now";
  elements.forecastTitle.textContent = "próximos días";
  elements.forecast.classList.remove("is-hourly");
  renderReading(current, { ...current, weather: [{ main: current.weather[0].main, description: current.weather[0].description, id: current.weather[0].id, icon: current.weather[0].icon }], dt: current.dt }, false);
  setWeatherEffect(current);
  elements.updated.textContent = `actualizado ${new Intl.DateTimeFormat("es", { hour: "2-digit", minute: "2-digit" }).format(new Date())}`;
  renderForecast(forecast.list);
  if (pendingWeatherReading) {
    pendingWeatherReading = false;
    speakTodayWeather();
  }
}

function renderActiveView() {
  if (!weatherData) return;
  const contentEl = elements.content || document.querySelector("#weather-content");
  if (contentEl) contentEl.classList.add("is-transitioning");

  setTimeout(() => {
    if (activeView === "now") {
      renderReading(weatherData.current, { ...weatherData.current, weather: [{ main: weatherData.current.weather[0].main, description: weatherData.current.weather[0].description, id: weatherData.current.weather[0].id, icon: weatherData.current.weather[0].icon }], dt: weatherData.current.dt }, false);
      elements.forecastTitle.textContent = "próximos días";
      renderForecast(weatherData.forecast.list);
      setWeatherEffect(weatherData.current);
    } else {
      const { current, forecast } = weatherData;
      const todayKey = localDateKey(current.dt, current.timezone);
      const firstFutureItem = forecast.list.find((item) => localDateKey(item.dt, forecast.city.timezone) !== todayKey);
      const tomorrowKey = firstFutureItem && localDateKey(firstFutureItem.dt, forecast.city.timezone);
      const tomorrowItems = forecast.list.filter((item) => localDateKey(item.dt, forecast.city.timezone) === tomorrowKey);
      const tomorrow = tomorrowItems.find((item) => item.dt_txt.includes("12:00:00")) || tomorrowItems[0];
      if (tomorrow) {
        renderReading(current, tomorrow, true);
        elements.forecastTitle.textContent = "mañana por horas";
        renderHourlyForecast(tomorrowItems, forecast.city.timezone);
        setWeatherEffect(tomorrow);
      }
    }
    if (contentEl) contentEl.classList.remove("is-transitioning");
  }, 140);
}

function setActiveView(view) {
  activeView = view;
  const isTomorrow = view === "tomorrow";
  elements.nowTab.classList.toggle("is-active", !isTomorrow);
  elements.tomorrowTab.classList.toggle("is-active", isTomorrow);
  elements.nowTab.setAttribute("aria-selected", String(!isTomorrow));
  elements.tomorrowTab.setAttribute("aria-selected", String(isTomorrow));
  renderActiveView();
}

async function loadWeather(loader) {
  setStatus("leyendo el cielo...");
  elements.form.classList.add("is-loading");
  try {
    const result = await loader();
    renderWeather(result);
    setStatus(voiceUnavailable ? "Función de voz no disponible en este navegador o contexto. Usa HTTPS o localhost." : "");
  } catch (error) {
    setStatus(error.message);
  } finally {
    elements.form.classList.remove("is-loading");
  }
}

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  const city = elements.input.value.trim();
  if (city) loadWeather(() => getWeather(city));
});

elements.soundButton.addEventListener("click", toggleAmbientSound);

elements.nowTab.addEventListener("click", () => setActiveView("now"));
elements.tomorrowTab.addEventListener("click", () => setActiveView("tomorrow"));

elements.locationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    setStatus("Tu navegador no permite geolocalización.");
    return;
  }
  setStatus("buscando tu ubicación...");
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => loadWeather(() => getWeatherByCoordinates(coords.latitude, coords.longitude)),
    () => setStatus("No pudimos acceder a tu ubicación.")
  );
});

weatherFXInstance = new WeatherFX("weather-canvas");
setupVoiceRecognition();
loadWeather(() => getWeather("Uyuni"));
