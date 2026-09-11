/* ==========================================
   BTS OFFICIAL LANDING PAGE - JAVASCRIPT
   Interactive Features & Member Data
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. DATA: 7 MEMBERS FULL DETAILS
    // ==========================================
    const membersData = {
        rm: {
            name: "RM",
            koreanName: "Kim Namjoon (김남준)",
            role: "Líder, Rapero Principal & Compositor",
            line: "Rap Line",
            birth: "12 de Septiembre de 1994 (Ilsan, Corea del Sur)",
            mbti: "ENFP / ENTP",
            soloWork: "Indigo (2022), Right Place, Wrong Person (2024)",
            quote: "No importa quién seas, de dónde vengas o tu color de piel: habla por ti mismo.",
            image: "images/rm.webp",
            fallbackImg: "https://upload.wikimedia.org/wikipedia/commons/c/ca/RM_at_the_2022_Fact_Music_Awards_on_October_8%2C_2022_%28cropped%29.jpg",
            bio: "RM es el líder visionary y pilar intelectual de BTS. Con un IQ de 148 y fluidez en inglés aprendida viendo la serie 'Friends', ha compuesto más de 200 canciones registradas en la KOMCA. Dio un discurso histórico en las Naciones Unidas (ONU) promoviendo la campaña 'Love Yourself'. Su álbum en solitario 'Indigo' recibió aclamación de la crítica internacional por su fusión de arte moderno y hip-hop introspectivo.",
            review: "Un líder reflexivo que convierte sus ideas, lecturas y sensibilidad artística en una voz que conecta a BTS con el mundo."
        },
        jin: {
            name: "Jin",
            koreanName: "Kim Seokjin (김석진)",
            role: "Sub Vocalista & Visual Principal",
            line: "Vocal Line",
            birth: "4 de Diciembre de 1992 (Gwacheon, Corea del Sur)",
            mbti: "INTP",
            soloWork: "The Astronaut (2022), Happy (2024), Epiphany, Awake",
            quote: "Tu presencia puede dar felicidad. Espero que recuerdes eso siempre.",
            image: "images/jin.webp",
            fallbackImg: "https://upload.wikimedia.org/wikipedia/commons/e/e0/BTS_Jin_on_June_12%2C_2024_%282%29.jpg",
            bio: "Apodado cariñosamente 'Worldwide Handsome', Jin es el integrante mayor de BTS. Reconocido por su impresionante registro vocal falsete y su carisma en el escenario. En 2024 fue portador de la antorcha olímpica para los Juegos Olímpicos de París 2024 representando a Corea del Sur. Su sencillo 'The Astronaut' coescrito con Coldplay fue un éxito mundial.",
            review: "Jin combina una voz cálida con un humor contagioso; su presencia aporta elegancia, cercanía y una energía que ilumina cada escenario."
        },
        suga: {
            name: "Suga / Agust D",
            koreanName: "Min Yoongi (민윤기)",
            role: "Rapero Lider, Compositor & Productor Genio",
            line: "Rap Line",
            birth: "9 de Marzo de 1993 (Daegu, Corea del Sur)",
            mbti: "ISTP",
            soloWork: "Agust D (2016), D-2 (2020), D-DAY (2023)",
            quote: "La vida es dura y las cosas no siempre salen bien, pero debemos ser valientes y continuar.",
            image: "images/suga.webp",
            fallbackImg: "images/suga.jpg",
            bio: "Min Yoongi, conocido profesionalmente como Suga y Agust D en su faceta solista, es uno de los productores de hip-hop más influyentes de la industria asiática. Ha producido hits para IU, PSY, Halsey y Juice WRLD. Su gira mundial solista 'SUGA | Agust D TOUR D-DAY' agotó estadios en EE.UU. y Asia.",
            review: "Un productor meticuloso y rapero honesto que transforma sus experiencias en canciones intensas, directas y profundamente humanas."
        },
        jhope: {
            name: "j-hope",
            koreanName: "Jung Hoseok (정호석)",
            role: "Bailarín Principal, Rapero & Director Coreográfico",
            line: "Rap Line",
            birth: "18 de Febrero de 1994 (Gwangju, Corea del Sur)",
            mbti: "INFJ",
            soloWork: "Jack In The Box (2022), HOPE ON THE STREET VOL.1 (2024), Hope World",
            quote: "Soy tu esperanza, tú eres mi esperanza, ¡soy j-hope!",
            image: "images/jhope.webp",
            fallbackImg: "https://upload.wikimedia.org/wikipedia/commons/6/69/J-Hope_at_the_2022_Fact_Music_Awards_on_October_8%2C_2022_%28cropped%29.jpg",
            bio: "j-hope es la energía vibrante y el capitán de baile de BTS. Antes de debutar perteneció al renombrado grupo de street dance 'Neuron'. Hizo historia en 2022 como el primer artista surcoreano en encabezar el escenario principal del festival Lollapalooza en Chicago ante más de 100,000 espectadores.",
            review: "Su precisión en el baile y su optimismo natural convierten cada actuación en una descarga de energía, ritmo y esperanza."
        },
        jimin: {
            name: "Jimin",
            koreanName: "Park Jimin (박지민)",
            role: "Bailarín Principal & Vocalista Lider",
            line: "Vocal Line",
            birth: "13 de Octubre de 1995 (Busan, Corea del Sur)",
            mbti: "ESTP",
            soloWork: "FACE (2023), MUSE (2024), Lie, Serendipity, Filter",
            quote: "Sigue tu camino, incluso si solo vives por un día.",
            image: "images/jimin.webp",
            fallbackImg: "images/jimin.jpg",
            bio: "Formado en danza contemporánea en la Busan High School of Arts como el alumno top de su promoción, Jimin destaca por sus giros gráciles y tono vocal angelical. Su canción 'Like Crazy' alcanzó el puesto #1 en el Billboard Hot 100, convirtiéndolo en el primer solista coreano en la historia en lograr dicha hazaña.",
            review: "Jimin destaca por una sensibilidad escénica única: cada movimiento y cada nota transmiten delicadeza, emoción y mucha fuerza interior."
        },
        v: {
            name: "V",
            koreanName: "Kim Taehyung (김태형)",
            role: "Sub Vocalista, Visual & Actor",
            line: "Vocal Line",
            birth: "30 de Diciembre de 1995 (Daegu, Corea del Sur)",
            mbti: "INFP",
            soloWork: "Layover (2023), FRI(END)S (2024), Stigma, Singularity, Sweet Night",
            quote: "El morado es el último color del arcoíris. Significa que confiaré y te amaré por mucho tiempo (Borahae 💜).",
            image: "images/v.webp",
            fallbackImg: "images/v.jpg",
            bio: "V posee una inconfundible voz barítono profunda y seductora con una marcada afinidad hacia el R&B y el Jazz. Es el creador del término mundialmente famoso 'I Purple You' (보라해 / Borahae) que simboliza la unión indestructible entre BTS y ARMY. Su álbum solista 'Layover' rompió récords de ventas en su primer día.",
            review: "V aporta una identidad artística magnética, con una voz profunda y un estilo cinematográfico que mezcla música, moda y actuación."
        },
        jungkook: {
            name: "Jung Kook",
            koreanName: "Jeon Jungkook (전정국)",
            role: "Vocalista Principal, Bailarín Lider, Centro & Maknae",
            line: "Vocal Line",
            birth: "1 de Septiembre de 1997 (Busan, Corea del Sur)",
            mbti: "INTP / ISFP",
            soloWork: "GOLDEN (2023), Seven feat. Latto, Standing Next to You, Euphoria",
            quote: "El esfuerzo te hace. Te arrepentirás algún día si no das lo mejor de ti ahora.",
            image: "images/jungkook.webp",
            fallbackImg: "https://upload.wikimedia.org/wikipedia/commons/0/07/Jungkook_at_the_2022_Fact_Music_Awards_on_October_8%2C_2022_%28cropped%29.jpg",
            bio: "Conocido mundialmente como el 'Golden Maknae' (el menor de oro) por su destreza en canto, baile, deportes y arte. Interpretó el himno oficial 'Dreamers' en la ceremonia de apertura de la Copa Mundial de la FIFA Qatar 2022. Su megahit 'Seven' acumuló más de 1,000 millones de streams en Spotify en tiempo récord mundial.",
            review: "Jung Kook es un intérprete versátil y preciso: canta, baila y domina el escenario con una naturalidad que explica su apodo de Golden Maknae."
        }
    };

    // ==========================================
    // 2. DATA: TRACKLIST PLAYLIST
    // ==========================================
    const tracks = [
        { id: 1, title: "2.0 - BTS", album: "Música local", duration: "0:00", cover: "images/bts_hero.webp", audioUrl: "musica/2.0 - BTS.mp3" },
        { id: 2, title: "BUTTER. BTS", album: "Música local", duration: "0:00", cover: "images/jungkook.webp", audioUrl: "musica/BUTTER. BTS.mp3" },
        { id: 3, title: "DYNAMITE. BTS", album: "Música local", duration: "0:00", cover: "images/rm.webp", audioUrl: "musica/DYNAMITE. BTS.mp3" },
        { id: 4, title: "HOOLIAN. BTS", album: "Música local", duration: "0:00", cover: "images/jimin.webp", audioUrl: "musica/HOOLIAN. BTS.mp3" }
    ];

    let currentTrackIndex = 0;
    let isPlaying = false;
    let audio = new Audio();
    audio.src = tracks[0].audioUrl;

    // ==========================================
    // 3. NAVBAR SCROLL & MOBILE MENU
    // ==========================================
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('nav-links');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('active');
            mobileToggle.setAttribute('aria-expanded', String(isOpen));
            const icon = mobileToggle.querySelector('i');
            if (isOpen) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });
    }

    // Close mobile menu when clicking nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (mobileToggle) mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
        });
    });

    // ==========================================
    // 4. MEMBERS FILTERING & MODAL
    // ==========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const memberCards = document.querySelectorAll('.member-card');
    const memberModal = document.getElementById('memberModal');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.getElementById('modalClose');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            memberCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Open Member Detail Modal
    document.querySelectorAll('.member-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const memberId = card.getAttribute('data-id');
            const data = membersData[memberId];

            if (data) {
                modalBody.innerHTML = `
                    <div class="modal-member-detail">
                        <img src="${data.image}" alt="${data.name}" onerror="this.src='${data.fallbackImg}'">
                        <div class="modal-member-info">
                            <h3>${data.name} <span class="korean-name">${data.koreanName}</span></h3>
                            <p class="role"><i class="fa-solid fa-star"></i> ${data.role}</p>
                            <p>${data.bio}</p>
                            <p class="member-review"><strong>Reseña:</strong> ${data.review}</p>
                            <ul class="modal-details-list">
                                <li><strong>Línea:</strong> ${data.line}</li>
                                <li><strong>Nacimiento:</strong> ${data.birth}</li>
                                <li><strong>MBTI:</strong> ${data.mbti}</li>
                                <li><strong>Álbumes Solistas:</strong> ${data.soloWork}</li>
                            </ul>
                            <div style="margin-top:20px; font-style:italic; color:var(--purple-light);">
                                "${data.quote}"
                            </div>
                        </div>
                    </div>
                `;
                memberModal.classList.add('active');
            }
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            memberModal.classList.remove('active');
        });
    }

    memberModal.addEventListener('click', (e) => {
        if (e.target === memberModal) {
            memberModal.classList.remove('active');
        }
    });

    // ==========================================
    // 5. EUROPE CONCERT GALLERY LIGHTBOX
    // ==========================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const title = item.getAttribute('data-title');
            const desc = item.getAttribute('data-desc');

            if (img && lightboxImg) {
                lightboxImg.src = img.src;
                lightboxCaption.innerHTML = `<h3>${title}</h3><p style="font-size:0.9rem; color:var(--text-muted); margin-top:5px;">${desc}</p>`;
                lightboxModal.classList.add('active');
            }
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            lightboxModal.classList.remove('active');
        });
    }

    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            lightboxModal.classList.remove('active');
        }
    });

    // ==========================================
    // 6. MUSIC PLAYER & PLAYLIST
    // ==========================================
    const playlistGrid = document.getElementById('playlistGrid');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playIcon = document.getElementById('playIcon');
    const prevTrackBtn = document.getElementById('prevTrackBtn');
    const nextTrackBtn = document.getElementById('nextTrackBtn');
    const playerTitle = document.getElementById('playerTitle');
    const playerArtist = document.getElementById('playerArtist');
    const playerAlbum = document.getElementById('playerAlbum');
    const playerCover = document.getElementById('playerCover');
    const soundWave = document.getElementById('soundWave');
    const progressFill = document.getElementById('progressFill');
    const progressBar = document.getElementById('progressBar');
    const currentTimeEl = document.getElementById('currentTime');
    const durationTimeEl = document.getElementById('durationTime');

    // Render Playlist
    function renderPlaylist() {
        if (!playlistGrid) return;
        playlistGrid.innerHTML = '';
        tracks.forEach((track, index) => {
            const activeClass = index === currentTrackIndex ? 'active' : '';
            const card = document.createElement('div');
            card.className = `track-card ${activeClass}`;
            card.innerHTML = `
                <div class="track-num">${index + 1}</div>
                <div class="track-meta">
                    <h5>${track.title}</h5>
                    <p>${track.album}</p>
                </div>
                <div class="track-play-icon">
                    <i class="fa-solid ${index === currentTrackIndex && isPlaying ? 'fa-volume-high' : 'fa-play'}"></i>
                </div>
            `;
            card.addEventListener('click', () => {
                loadAndPlayTrack(index);
            });
            playlistGrid.appendChild(card);
        });
    }

    function loadTrack(index) {
        currentTrackIndex = index;
        const track = tracks[currentTrackIndex];
        audio.src = track.audioUrl;
        if (playerTitle) playerTitle.textContent = track.title;
        if (playerAlbum) playerAlbum.textContent = track.album;
        if (playerCover) playerCover.src = track.cover;
        renderPlaylist();
    }

    function loadAndPlayTrack(index) {
        loadTrack(index);
        playAudio();
    }

    function playAudio() {
        audio.play().then(() => {
            isPlaying = true;
            if (playIcon) playIcon.className = 'fa-solid fa-pause';
            if (soundWave) soundWave.classList.remove('paused');
            renderPlaylist();
        }).catch(err => {
            console.log("Audio autoplay prevented", err);
        });
    }

    function pauseAudio() {
        audio.pause();
        isPlaying = false;
        if (playIcon) playIcon.className = 'fa-solid fa-play';
        if (soundWave) soundWave.classList.add('paused');
        renderPlaylist();
    }

    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            if (isPlaying) {
                pauseAudio();
            } else {
                playAudio();
            }
        });
    }

    if (prevTrackBtn) {
        prevTrackBtn.addEventListener('click', () => {
            currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
            loadAndPlayTrack(currentTrackIndex);
        });
    }

    if (nextTrackBtn) {
        nextTrackBtn.addEventListener('click', () => {
            currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
            loadAndPlayTrack(currentTrackIndex);
        });
    }

    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const pct = (audio.currentTime / audio.duration) * 100;
            if (progressFill) progressFill.style.width = `${pct}%`;
            
            const curMins = Math.floor(audio.currentTime / 60);
            const curSecs = Math.floor(audio.currentTime % 60);
            if (currentTimeEl) currentTimeEl.textContent = `${curMins}:${curSecs < 10 ? '0' : ''}${curSecs}`;

            const durMins = Math.floor(audio.duration / 60);
            const durSecs = Math.floor(audio.duration % 60);
            if (durationTimeEl) durationTimeEl.textContent = `${durMins}:${durSecs < 10 ? '0' : ''}${durSecs}`;
        }
    });

    if (progressBar) {
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            audio.currentTime = pos * audio.duration;
        });
    }

    renderPlaylist();

    // ==========================================
    // 7. ARMY BOMB LIGHTSTICK COLOR SWITCHER
    // ==========================================
    const armyBombToggle = document.getElementById('armyBombToggle');
    const colorModes = ['', 'army-light-mode', 'army-light-cyan', 'army-light-gold'];
    let currentModeIndex = 0;

    if (armyBombToggle) {
        armyBombToggle.addEventListener('click', () => {
            document.body.classList.remove(colorModes[currentModeIndex]);
            currentModeIndex = (currentModeIndex + 1) % colorModes.length;
            if (colorModes[currentModeIndex]) {
                document.body.classList.add(colorModes[currentModeIndex]);
            }
            armyBombToggle.setAttribute('aria-pressed', String(currentModeIndex !== 0));
            
            // Pulse effect animation
            armyBombToggle.style.transform = 'scale(1.2)';
            setTimeout(() => armyBombToggle.style.transform = 'scale(1)', 200);
        });
    }

    // ==========================================
    // 8. HIDDEN WEATHER WIDGET
    // ==========================================
    const weatherToggle = document.getElementById('weatherToggle');
    const weatherModal = document.getElementById('weatherModal');
    const weatherModalClose = document.getElementById('weatherModalClose');
    const weatherFrame = document.getElementById('weatherFrame');
    let weatherReturnFocus;
    let weatherAutoCloseTimer;

    function closeWeatherWidget() {
        if (!weatherModal || !weatherModal.classList.contains('active')) return;
        window.clearTimeout(weatherAutoCloseTimer);
        weatherModal.classList.remove('active');
        weatherModal.setAttribute('aria-hidden', 'true');
        weatherToggle?.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('weather-modal-open');
        weatherReturnFocus?.focus();
    }

    function openWeatherWidget({ readToday = false, autoCloseMs = 0 } = {}) {
        if (!weatherModal || !weatherFrame) return;
        weatherReturnFocus = document.activeElement;
        if (weatherFrame.src === 'about:blank') weatherFrame.src = 'clima/index.html';
        weatherModal.classList.add('active');
        weatherModal.setAttribute('aria-hidden', 'false');
        weatherToggle?.setAttribute('aria-expanded', 'true');
        document.body.classList.add('weather-modal-open');
        weatherModalClose?.focus();

        if (autoCloseMs > 0) {
            window.clearTimeout(weatherAutoCloseTimer);
            weatherAutoCloseTimer = window.setTimeout(closeWeatherWidget, autoCloseMs);
        }
        if (readToday) {
            const requestReading = () => weatherFrame.contentWindow?.postMessage({ type: 'read-weather-today' }, '*');
            if (weatherFrame.contentDocument?.readyState === 'complete') {
                window.setTimeout(requestReading, 150);
            } else {
                weatherFrame.addEventListener('load', () => window.setTimeout(requestReading, 150), { once: true });
            }
        }
    }

    weatherToggle?.addEventListener('click', openWeatherWidget);
    weatherModalClose?.addEventListener('click', closeWeatherWidget);
    weatherModal?.addEventListener('click', (event) => {
        if (event.target === weatherModal) closeWeatherWidget();
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeWeatherWidget();
    });

    // ==========================================
    // 9. FLOATING VOICE COMMANDS
    // ==========================================
    const voiceFab = document.getElementById('voiceFab');
    const voiceFabStatus = document.getElementById('voiceFabStatus');
    const VoiceRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const voiceSecureContext = window.isSecureContext || ['localhost', '127.0.0.1'].includes(window.location.hostname);
    let voiceRecognition;
    let voiceListening = false;

    function setFloatingVoiceState(state, message) {
        voiceFab?.classList.toggle('is-listening', state === 'listening');
        voiceFab?.setAttribute('aria-pressed', String(state === 'listening'));
        if (voiceFabStatus) voiceFabStatus.textContent = message;
        if (voiceFab) voiceFab.setAttribute('aria-label', state === 'listening' ? 'Detener comandos de voz' : 'Activar comandos de voz');
    }

    function runVoiceCommand(transcript) {
        const command = transcript.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
        const destinations = [
            { words: ['inicio', 'principal'], selector: '#hero', label: 'Inicio' },
            { words: ['integrantes', 'miembros'], selector: '#members', label: 'Integrantes' },
            { words: ['gira', 'europa'], selector: '#gallery', label: 'Gira por Europa' },
            { words: ['musica', 'discografia'], selector: '#discography', label: 'Música' },
            { words: ['conciertos', 'concierto'], selector: '#tour', label: 'Conciertos' },
            { words: ['army', 'zona army'], selector: '#army-zone', label: 'ARMY Zone' }
        ];

        if (command.includes('clima de hoy') || command.includes('clima ahora') || command.includes('tiempo de hoy')) {
            openWeatherWidget({ readToday: true, autoCloseMs: 5000 });
            setFloatingVoiceState('idle', 'Leyendo el clima de hoy');
            return;
        }
        if (command.includes('abrir clima') || command === 'clima' || command.includes('tiempo')) {
            openWeatherWidget();
            setFloatingVoiceState('idle', 'Clima abierto');
            return;
        }
        if (command.includes('cerrar clima') || command.includes('cerrar ventana')) {
            closeWeatherWidget();
            setFloatingVoiceState('idle', 'Clima cerrado');
            return;
        }

        const destination = destinations.find((item) => item.words.some((word) => command.includes(word)));
        if (destination) {
            document.querySelector(destination.selector)?.scrollIntoView({ behavior: 'smooth' });
            setFloatingVoiceState('idle', `Yendo a ${destination.label}`);
            return;
        }

        setFloatingVoiceState('idle', 'No entendí el comando');
    }

    function stopFloatingVoice() {
        if (voiceListening) voiceRecognition?.stop();
        voiceListening = false;
        setFloatingVoiceState('idle', 'Comandos de voz');
    }

    if (!VoiceRecognition || !voiceSecureContext) {
        if (voiceFab) {
            voiceFab.disabled = true;
            voiceFabStatus.textContent = 'Voz no disponible';
            voiceFab.title = 'Usa HTTPS o localhost y un navegador compatible';
        }
    } else {
        voiceRecognition = new VoiceRecognition();
        voiceRecognition.lang = 'es-ES';
        voiceRecognition.continuous = false;
        voiceRecognition.interimResults = false;
        voiceRecognition.maxAlternatives = 1;
        voiceRecognition.onstart = () => {
            voiceListening = true;
            setFloatingVoiceState('listening', 'Escuchando...');
        };
        voiceRecognition.onresult = (event) => runVoiceCommand(event.results[0][0].transcript);
        voiceRecognition.onerror = () => {
            voiceListening = false;
            setFloatingVoiceState('idle', 'Intenta de nuevo');
        };
        voiceRecognition.onend = () => {
            voiceListening = false;
            if (voiceFab?.classList.contains('is-listening')) setFloatingVoiceState('idle', 'Comandos de voz');
        };
        voiceFab?.addEventListener('click', () => {
            if (voiceListening) {
                stopFloatingVoice();
                return;
            }
            try {
                voiceRecognition.start();
            } catch (error) {
                setFloatingVoiceState('idle', 'Intenta de nuevo');
            }
        });
    }

    // ==========================================
    // 10. ARMY CHEER COUNTER & FLOATING HEARTS
    // ==========================================
    const cheerBtn = document.getElementById('cheerBtn');
    const cheerCountEl = document.getElementById('cheerCount');
    let cheerCount = 7777777;

    if (cheerBtn) {
        cheerBtn.addEventListener('click', (e) => {
            cheerCount++;
            if (cheerCountEl) cheerCountEl.textContent = cheerCount.toLocaleString();

            // Spawn floating heart particle
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.innerHTML = '💜';
            heart.style.left = `${e.clientX - 15}px`;
            heart.style.top = `${e.clientY - 20}px`;
            document.body.appendChild(heart);

            setTimeout(() => {
                heart.remove();
            }, 1800);
        });
    }

    // Newsletter Form
    const newsletterForm = document.getElementById('armyNewsletterForm');
    const newsletterMsg = document.getElementById('newsletterMsg');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('armyEmail');
            if (emailInput && emailInput.value) {
                if (newsletterMsg) {
                    newsletterMsg.textContent = `¡Gracias por unirte a ARMY Zone! Te hemos enviado la confirmación a ${emailInput.value} 💜`;
                }
                emailInput.value = '';
            }
        });
    }

    // Trailer Video Button
    const playTrailerBtn = document.getElementById('playTrailerBtn');
    if (playTrailerBtn) {
        playTrailerBtn.addEventListener('click', () => {
            alert("🎬 Reproduciendo Tráiler Oficial BTS World Tour & Europe Concert Highlights!");
        });
    }

    // Concert Ticket Alerts
    document.querySelectorAll('.notify-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            alert("🔔 ¡Te has suscrito para recibir alerta prioritaria cuando abran las entradas de este concierto en Europa!");
        });
    });


    // Purple heart rain across the page
    const createRainHeart = () => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const heart = document.createElement('div');
        heart.className = 'heart-rain';
        heart.textContent = '💜';
        heart.style.left = `${Math.random() * 100}vw`;
        heart.style.fontSize = `${0.8 + Math.random() * 1.2}rem`;
        heart.style.animationDuration = `${4 + Math.random() * 4}s`;
        document.body.appendChild(heart);

        setTimeout(() => heart.remove(), 8500);
    };

    for (let index = 0; index < 10; index++) {
        setTimeout(createRainHeart, index * 350);
    }
    setInterval(createRainHeart, 550);
});

