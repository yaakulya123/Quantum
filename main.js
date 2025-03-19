// DOM Elements
const experimentsGrid = document.getElementById('experimentsGrid');
const simulationContainer = document.getElementById('simulationContainer');
const simulationTitle = document.getElementById('simulationTitle');
const simulationDescription = document.getElementById('simulationDescription');
const simulationControls = document.getElementById('simulationControls');
const closeSimulation = document.getElementById('closeSimulation');
const simulationCanvas = document.getElementById('simulationCanvas');
const simulationInfo = document.getElementById('simulationInfo');

// Current active experiment
let currentExperiment = null;
let ctx = simulationCanvas.getContext('2d');

// Animation frame ID for cancellation
let animationId = null;

// Experiment-specific variables
let experimentState = {};

// Generate experiment cards with illustrations
function generateExperimentCards() {
    experimentsGrid.innerHTML = '';
    
    experiments.forEach(experiment => {
        const card = document.createElement('div');
        card.className = 'experiment-card';
        card.setAttribute('data-id', experiment.id);
        
        // Generate svg illustration based on experiment type
        const illustration = generateIllustration(experiment.id);
        
        const cardContent = `
            <div class="card-img" style="background-color: #1a1f35; position: relative;">
                ${illustration}
            </div>
            <div class="card-content">
                <h3>${experiment.title}</h3>
                <p>${experiment.description}</p>
                <button class="button">Explore</button>
            </div>
        `;
        
        card.innerHTML = cardContent;
        experimentsGrid.appendChild(card);
        
        // Add click event
        card.addEventListener('click', () => {
            openExperiment(experiment.id);
        });
    });
}

// Generate SVG illustrations for experiment cards
function generateIllustration(experimentId) {
    const illustrations = {
        'double-slit': `
            <svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#1a1f35"/>
                <!-- Laser source -->
                <rect x="20" y="70" width="30" height="20" fill="#ff5555" rx="2"/>
                <!-- Laser beam -->
                <path d="M50 80 L120 80" stroke="#ff5555" stroke-width="2"/>
                <!-- Double-slit barrier -->
                <rect x="120" y="40" width="5" height="25" fill="#aaaaaa"/>
                <rect x="120" y="75" width="5" height="10" fill="#aaaaaa"/>
                <rect x="120" y="95" width="5" height="25" fill="#aaaaaa"/>
                <!-- Interference pattern -->
                <rect x="250" y="40" width="5" height="80" fill="#aaaaaa"/>
                <!-- Wave pattern -->
                <path d="M255 50 Q270 40, 280 50 Q290 60, 300 50" stroke="#ffff55" stroke-width="1" fill="none"/>
                <path d="M255 70 Q270 60, 280 70 Q290 80, 300 70" stroke="#ffff55" stroke-width="1" fill="none"/>
                <path d="M255 90 Q270 80, 280 90 Q290 100, 300 90" stroke="#ffff55" stroke-width="1" fill="none"/>
                <path d="M255 110 Q270 100, 280 110 Q290 120, 300 110" stroke="#ffff55" stroke-width="1" fill="none"/>
                <!-- Particles -->
                <circle cx="70" cy="80" r="2" fill="#ffff55"/>
                <circle cx="90" cy="80" r="2" fill="#ffff55"/>
                <circle cx="160" cy="65" r="2" fill="#ffff55"/>
                <circle cx="180" cy="95" r="2" fill="#ffff55"/>
                <circle cx="210" cy="75" r="2" fill="#ffff55"/>
                <circle cx="230" cy="85" r="2" fill="#ffff55"/>
            </svg>
        `,
        'stern-gerlach': `
            <svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#1a1f35"/>
                <!-- Atom source -->
                <rect x="20" y="70" width="30" height="20" fill="#55aaff" rx="2"/>
                <!-- Beam path -->
                <path d="M50 80 L100 80" stroke="#55aaff" stroke-width="2" stroke-dasharray="4 2"/>
                <!-- Magnetic field -->
                <path d="M100 40 L150 60 L150 100 L100 120 Z" fill="#ff5555" opacity="0.5"/>
                <path d="M100 120 L150 100 L150 140 L100 160 Z" fill="#5555ff" opacity="0.5"/>
                <!-- Split beams -->
                <path d="M150 80 L250 40" stroke="#ffff55" stroke-width="2" stroke-dasharray="4 2"/>
                <path d="M150 80 L250 120" stroke="#55ffff" stroke-width="2" stroke-dasharray="4 2"/>
                <!-- Detectors -->
                <rect x="250" y="30" width="20" height="20" fill="#aaaaaa" rx="2"/>
                <rect x="250" y="110" width="20" height="20" fill="#aaaaaa" rx="2"/>
                <!-- Particles -->
                <circle cx="70" cy="80" r="3" fill="#55aaff"/>
                <circle cx="180" cy="60" r="3" fill="#ffff55"/>
                <circle cx="210" cy="110" r="3" fill="#55ffff"/>
            </svg>
        `,
        'bell-inequality': `
            <svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#1a1f35"/>
                <!-- Entanglement source -->
                <circle cx="150" cy="80" r="15" fill="#55aaff"/>
                <!-- Entanglement lines -->
                <path d="M150 80 L70 80" stroke="#55aaff" stroke-width="2" stroke-dasharray="4 2"/>
                <path d="M150 80 L230 80" stroke="#55aaff" stroke-width="2" stroke-dasharray="4 2"/>
                <!-- Detector A -->
                <rect x="30" y="60" width="40" height="40" fill="#ff5555" rx="3"/>
                <line x1="50" y1="60" x2="50" y2="100" stroke="white" stroke-width="2"/>
                <!-- Detector B -->
                <rect x="230" y="60" width="40" height="40" fill="#55ff55" rx="3"/>
                <line x1="250" y1="60" x2="250" y2="100" stroke="white" stroke-width="2"/>
                <!-- Entangled particles -->
                <circle cx="100" cy="80" r="5" fill="#ffff55"/>
                <circle cx="200" cy="80" r="5" fill="#ffff55"/>
                <!-- Correlation line -->
                <path d="M60 130 L240 130" stroke="#ffff55" stroke-width="1"/>
                <circle cx="120" cy="130" r="3" fill="#ffff55"/>
                <circle cx="180" cy="130" r="3" fill="#ffff55"/>
            </svg>
        `,
        'quantum-eraser': `
            <svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#1a1f35"/>
                <!-- Laser source -->
                <rect x="20" y="70" width="30" height="20" fill="#ff5555" rx="2"/>
                <!-- Laser beam -->
                <path d="M50 80 L100 80" stroke="#ff5555" stroke-width="2"/>
                <!-- Double-slit barrier -->
                <rect x="100" y="50" width="5" height="20" fill="#aaaaaa"/>
                <rect x="100" y="80" width="5" height="10" fill="#aaaaaa"/>
                <rect x="100" y="100" width="5" height="20" fill="#aaaaaa"/>
                <!-- Which-path detector -->
                <rect x="115" y="55" width="10" height="10" fill="#55aaff"/>
                <rect x="115" y="95" width="10" height="10" fill="#55aaff"/>
                <!-- Eraser -->
                <circle cx="170" cy="80" r="15" fill="#55ff55"/>
                <!-- Detector screen -->
                <rect x="250" y="40" width="5" height="80" fill="#aaaaaa"/>
                <!-- Interference pattern -->
                <path d="M255 50 L270 50" stroke="#ffff55" stroke-width="2"/>
                <path d="M255 70 L275 70" stroke="#ffff55" stroke-width="2"/>
                <path d="M255 90 L270 90" stroke="#ffff55" stroke-width="2"/>
                <path d="M255 110 L275 110" stroke="#ffff55" stroke-width="2"/>
                <!-- Particles -->
                <circle cx="130" cy="65" r="3" fill="#ffff55"/>
                <circle cx="150" cy="95" r="3" fill="#ffff55"/>
                <circle cx="190" cy="80" r="3" fill="#ffff55"/>
                <circle cx="220" cy="70" r="3" fill="#ffff55"/>
            </svg>
        `,
        'delayed-choice': `
            <svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#1a1f35"/>
                <!-- Photon source -->
                <rect x="20" y="70" width="30" height="20" fill="#55aaff" rx="2"/>
                <!-- Beam path -->
                <path d="M50 80 L100 80" stroke="#55aaff" stroke-width="2"/>
                <!-- Double-slit barrier -->
                <rect x="100" y="50" width="5" height="20" fill="#aaaaaa"/>
                <rect x="100" y="80" width="5" height="10" fill="#aaaaaa"/>
                <rect x="100" y="100" width="5" height="20" fill="#aaaaaa"/>
                <!-- Delayed choice apparatus -->
                <circle cx="170" cy="80" r="15" fill="#ffff55"/>
                <text x="165" y="85" fill="black" font-size="18" font-weight="bold">?</text>
                <!-- Timeline arrow -->
                <line x1="50" y1="140" x2="250" y2="140" stroke="#aaaaaa" stroke-width="1"/>
                <polygon points="250,140 245,135 245,145" fill="#aaaaaa"/>
                <circle cx="110" cy="140" r="4" fill="#55aaff"/>
                <circle cx="170" cy="140" r="4" fill="#ffff55"/>
                <!-- Detector screen -->
                <rect x="250" y="40" width="5" height="80" fill="#aaaaaa"/>
                <!-- Particles -->
                <circle cx="75" cy="80" r="3" fill="#55aaff"/>
                <circle cx="130" cy="65" r="3" fill="#55aaff"/>
                <circle cx="200" cy="90" r="3" fill="#55aaff"/>
            </svg>
        `,
        'mach-zehnder': `
            <svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#1a1f35"/>
                <!-- Light source -->
                <rect x="20" y="70" width="30" height="20" fill="#55aaff" rx="2"/>
                <!-- Beam path -->
                <path d="M50 80 L100 80" stroke="#55aaff" stroke-width="2"/>
                <!-- First beam splitter -->
                <rect x="100" y="65" width="30" height="30" fill="#aaaaaa" transform="rotate(45 115 80)" opacity="0.7"/>
                <!-- Path 1 -->
                <path d="M122 57 L190 57" stroke="#55aaff" stroke-width="2" stroke-dasharray="4 2"/>
                <!-- Path 2 -->
                <path d="M122 103 L190 103" stroke="#55aaff" stroke-width="2" stroke-dasharray="4 2"/>
                <!-- Mirrors -->
                <rect x="190" y="42" width="30" height="30" fill="#aaaaaa" transform="rotate(45 205 57)" opacity="0.7"/>
                <rect x="190" y="88" width="30" height="30" fill="#aaaaaa" transform="rotate(45 205 103)" opacity="0.7"/>
                <!-- Second beam splitter -->
                <rect x="220" y="65" width="30" height="30" fill="#aaaaaa" transform="rotate(45 235 80)" opacity="0.7"/>
                <!-- Output paths -->
                <path d="M248 67 L280 40" stroke="#55aaff" stroke-width="2"/>
                <path d="M248 93 L280 120" stroke="#55aaff" stroke-width="2"/>
                <!-- Detectors -->
                <rect x="280" y="30" width="15" height="20" fill="#aaaaaa" rx="2"/>
                <rect x="280" y="110" width="15" height="20" fill="#aaaaaa" rx="2"/>
                <!-- Photons -->
                <circle cx="75" cy="80" r="3" fill="#55aaff"/>
                <circle cx="150" cy="57" r="3" fill="#55aaff"/>
                <circle cx="265" cy="55" r="3" fill="#55aaff"/>
            </svg>
        `,
        'quantum-tunneling': `
            <svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#1a1f35"/>
                <!-- Energy levels -->
                <line x1="20" y1="100" x2="280" y2="100" stroke="#aaaaaa" stroke-width="1"/>
                <line x1="20" y1="60" x2="280" y2="60" stroke="#55ff55" stroke-width="1" stroke-dasharray="4 2"/>
                <text x="20" y="55" fill="#55ff55" font-size="10">Energy Level</text>
                <!-- Potential barrier -->
                <rect x="120" y="40" width="60" height="60" fill="#ff5555" opacity="0.5"/>
                <!-- Particle source -->
                <rect x="30" y="80" width="20" height="20" fill="#55aaff" rx="2"/>
                <!-- Detector -->
                <rect x="250" y="80" width="20" height="20" fill="#aaaaaa" rx="2"/>
                <!-- Wave function -->
                <path d="M50 90 Q70 70, 90 90 Q110 110, 120 90" stroke="#55aaff" stroke-width="2" fill="none"/>
                <path d="M180 90 Q190 86, 200 90 Q220 100, 240 90" stroke="#55aaff" stroke-width="1" fill="none"/>
                <!-- Tunneling zone -->
                <path d="M120 90 Q140 92, 160 88 Q180 88, 180 90" stroke="#55aaff" stroke-width="1" stroke-dasharray="2 2" fill="none"/>
                <!-- Particles -->
                <circle cx="70" cy="80" r="4" fill="#55aaff"/>
                <circle cx="140" cy="88" r="4" fill="#55aaff" opacity="0.5"/>
                <circle cx="210" cy="90" r="4" fill="#55aaff"/>
            </svg>
        `,
        'aharonov-bohm': `
            <svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#1a1f35"/>
                <!-- Electron source -->
                <rect x="30" y="70" width="20" height="20" fill="#55aaff" rx="2"/>
                <!-- Solenoid (magnetic field container) -->
                <circle cx="150" cy="80" r="25" fill="#ff5555" opacity="0.7"/>
                <circle cx="150" cy="80" r="20" fill="#ff5555" opacity="0.5"/>
                <circle cx="150" cy="80" r="15" fill="#ff5555" opacity="0.3"/>
                <circle cx="150" cy="80" r="10" fill="#ff5555" opacity="0.2"/>
                <text x="145" y="85" fill="white" font-size="14">B</text>
                <!-- Electron paths -->
                <path d="M50 80 C90 40, 210 40, 250 80" stroke="#55aaff" stroke-width="2" fill="none" stroke-dasharray="4 2"/>
                <path d="M50 80 C90 120, 210 120, 250 80" stroke="#55aaff" stroke-width="2" fill="none" stroke-dasharray="4 2"/>
                <!-- Detector screen -->
                <rect x="250" y="40" width="5" height="80" fill="#aaaaaa"/>
                <!-- Interference pattern -->
                <path d="M255 60 L270 60" stroke="#55aaff" stroke-width="2"/>
                <path d="M255 80 L275 80" stroke="#55aaff" stroke-width="2"/>
                <path d="M255 100 L270 100" stroke="#55aaff" stroke-width="2"/>
                <!-- Electrons -->
                <circle cx="90" cy="50" r="3" fill="#55aaff"/>
                <circle cx="210" cy="110" r="3" fill="#55aaff"/>
            </svg>
        `,
        'quantum-zeno': `
            <svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#1a1f35"/>
                <!-- Quantum system container -->
                <circle cx="150" cy="80" r="50" stroke="#55aaff" stroke-width="2" fill="none"/>
                <!-- Stable state -->
                <circle cx="150" cy="80" r="40" fill="#55aaff" opacity="0.3"/>
                <!-- Decayed state representation -->
                <circle cx="150" cy="80" r="25" fill="#ff5555" opacity="0.3"/>
                <!-- Measurement effect -->
                <circle cx="150" cy="80" r="55" stroke="#ffff55" stroke-width="2" stroke-dasharray="4 2" fill="none"/>
                <!-- Clock/timer representation -->
                <circle cx="230" cy="40" r="15" stroke="#aaaaaa" fill="none"/>
                <line x1="230" y1="40" x2="230" y2="30" stroke="#aaaaaa"/>
                <line x1="230" y1="40" x2="240" y2="40" stroke="#aaaaaa"/>
                <!-- Measurement icons -->
                <rect x="120" y="20" width="10" height="10" fill="#ffff55"/>
                <rect x="140" y="20" width="10" height="10" fill="#ffff55"/>
                <rect x="160" y="20" width="10" height="10" fill="#ffff55"/>
                <rect x="180" y="20" width="10" height="10" fill="#ffff55"/>
                <!-- Evolution arrows -->
                <path d="M150 80 L110 110" stroke="#ff5555" stroke-width="2" stroke-dasharray="2 2" fill="none"/>
                <path d="M150 80 L120 50" stroke="#ff5555" stroke-width="2" stroke-dasharray="2 2" fill="none"/>
                <path d="M150 80 L190 50" stroke="#ff5555" stroke-width="2" stroke-dasharray="2 2" fill="none"/>
                <!-- Measurement beams -->
                <line x1="150" y1="20" x2="150" y2="80" stroke="#ffff55" stroke-width="1" stroke-dasharray="1 2"/>
            </svg>
        `,
        'quantum-teleportation': `
            <svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#1a1f35"/>
                <!-- Alice and Bob labels -->
                <text x="50" y="30" fill="#aaaaaa" font-size="12">Alice</text>
                <text x="230" y="30" fill="#aaaaaa" font-size="12">Bob</text>
                <!-- Input quantum state -->
                <circle cx="40" cy="60" r="15" fill="#ff5555"/>
                <text x="36" y="65" fill="white" font-size="14">ψ</text>
                <!-- Entangled particles -->
                <circle cx="80" cy="80" r="15" fill="#55aaff"/>
                <text x="76" y="85" fill="white" font-size="14">Φ</text>
                <circle cx="220" cy="80" r="15" fill="#55aaff"/>
                <text x="216" y="85" fill="white" font-size="14">Φ</text>
                <!-- Entanglement line -->
                <path d="M80 80 C100 120, 200 120, 220 80" stroke="#55aaff" stroke-width="2" stroke-dasharray="2 2"/>
                <!-- Bell measurement -->
                <rect x="50" y="100" width="60" height="40" fill="#55ff55" opacity="0.7"/>
                <text x="60" y="125" fill="white" font-size="12">Bell</text>
                <!-- Classical channel -->
                <line x1="110" y1="120" x2="190" y2="120" stroke="#ffff55" stroke-width="2"/>
                <polygon points="190,120 185,115 185,125" fill="#ffff55"/>
                <!-- Correction operation -->
                <rect x="190" y="100" width="60" height="40" fill="#ff5555" opacity="0.7"/>
                <text x="197" y="125" fill="white" font-size="12">Correct</text>
                <!-- Output state -->
                <circle cx="260" cy="60" r="15" fill="#ff5555"/>
                <text x="256" y="65" fill="white" font-size="14">ψ</text>
                <!-- Teleportation arrow -->
                <path d="M40 40 C70 15, 230 15, 260 40" stroke="#ff5555" stroke-width="1" stroke-dasharray="2 2"/>
                <polygon points="260,40 254,36 254,44" fill="#ff5555"/>
            </svg>
        `,
        'bloch-sphere': `
            <svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#1a1f35"/>
                <!-- Bloch sphere -->
                <circle cx="150" cy="80" r="50" stroke="#aaaaaa" fill="none"/>
                <ellipse cx="150" cy="80" rx="50" ry="15" stroke="#aaaaaa" fill="none" stroke-dasharray="2 2"/>
                <!-- Axes -->
                <line x1="90" y1="80" x2="210" y2="80" stroke="#ff5555" stroke-width="1"/>
                <text x="215" y="85" fill="#ff5555" font-size="12">X</text>
                <line x1="150" y1="20" x2="150" y2="140" stroke="#55aaff" stroke-width="1"/>
                <text x="155" y="20" fill="#55aaff" font-size="12">Z</text>
                <line x1="125" y1="55" x2="175" y2="105" stroke="#55ff55" stroke-width="1"/>
                <text x="180" y="110" fill="#55ff55" font-size="12">Y</text>
                <!-- State vector -->
                <line x1="150" y1="80" x2="180" y2="50" stroke="#ffff55" stroke-width="2"/>
                <circle cx="180" cy="50" r="5" fill="#ffff55"/>
                <!-- State labels -->
                <text x="145" y="25" fill="white" font-size="12">|0⟩</text>
                <text x="145" y="140" fill="white" font-size="12">|1⟩</text>
                <!-- Quantum gates -->
                <rect x="40" y="120" width="25" height="25" fill="#55aaff" rx="2"/>
                <text x="47" y="137" fill="white" font-size="12">H</text>
                <rect x="80" y="120" width="25" height="25" fill="#ff5555" rx="2"/>
                <text x="87" y="137" fill="white" font-size="12">X</text>
                <rect x="120" y="120" width="25" height="25" fill="#55ff55" rx="2"/>
                <text x="127" y="137" fill="white" font-size="12">Y</text>
                <rect x="160" y="120" width="25" height="25" fill="#55aaff" rx="2"/>
                <text x="167" y="137" fill="white" font-size="12">Z</text>
                <!-- Rotation arrow -->
                <path d="M180 50 A 35 35 0 0 1 200 80" stroke="#ffff55" stroke-width="1" fill="none"/>
                <polygon points="200,80 195,74 192,82" fill="#ffff55"/>
            </svg>
        `,
        'shors-algorithm': `
            <svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#1a1f35"/>
                <!-- Number to factor -->
                <text x="65" y="40" fill="white" font-size="24" font-weight="bold">15 = ?</text>
                <!-- Circuit representation -->
                <line x1="40" y1="70" x2="260" y2="70" stroke="#aaaaaa" stroke-width="1"/>
                <line x1="40" y1="90" x2="260" y2="90" stroke="#aaaaaa" stroke-width="1"/>
                <line x1="40" y1="110" x2="260" y2="110" stroke="#aaaaaa" stroke-width="1"/>
                <!-- Circuit elements -->
                <rect x="60" y="60" width="20" height="20" fill="#55aaff" rx="2"/>
                <text x="65" y="75" fill="white" font-size="12">H</text>
                <rect x="60" y="80" width="20" height="20" fill="#55aaff" rx="2"/>
                <text x="65" y="95" fill="white" font-size="12">H</text>
                <rect x="60" y="100" width="20" height="20" fill="#55aaff" rx="2"/>
                <text x="65" y="115" fill="white" font-size="12">H</text>
                <rect x="110" y="60" width="40" height="60" fill="#ff5555" rx="2"/>
                <text x="115" y="95" fill="white" font-size="10">MOD</text>
                <rect x="180" y="60" width="30" height="30" fill="#55ff55" rx="2"/>
                <text x="185" y="80" fill="white" font-size="10">QFT</text>
                <circle cx="240" cy="70" r="10" fill="#ffff55"/>
                <line x1="235" y1="70" x2="245" y2="70" stroke="black" stroke-width="2"/>
                <line x1="240" y1="65" x2="240" y2="75" stroke="black" stroke-width="2"/>
                <!-- Output -->
                <text x="195" y="140" fill="white" font-size="16">3 × 5</text>
                <!-- Period finding representation -->
                <path d="M110 30 Q130 20, 150 30 Q170 40, 190 30 Q210 20, 230 30" stroke="#55ff55" stroke-width="1" fill="none"/>
            </svg>
        `
    };
    
    return illustrations[experimentId] || '';
}

// Open experiment simulation
function openExperiment(experimentId) {
    currentExperiment = experiments.find(exp => exp.id === experimentId);
    
    if (!currentExperiment) return;
    
    // Update simulation container
    simulationTitle.textContent = currentExperiment.title;
    simulationDescription.textContent = currentExperiment.longDescription;
    
    // Generate controls
    generateControls();
    
    // Show simulation container
    simulationContainer.style.display = 'block';
    
    // Scroll to simulation
    simulationContainer.scrollIntoView({ behavior: 'smooth' });
    
    // Initialize experiment
    initializeExperiment(experimentId);
    
    // Ensure canvas is properly sized
    setTimeout(resizeCanvasCorrectly, 100);
    
    // Start animation
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    animateExperiment();
}

// Generate controls for the current experiment
function generateControls() {
    simulationControls.innerHTML = '';
    
    if (!currentExperiment || !currentExperiment.controls) return;
    
    currentExperiment.controls.forEach(control => {
        const controlGroup = document.createElement('div');
        controlGroup.className = 'control-group';
        
        let controlHtml = '';
        
        switch (control.type) {
            case 'slider':
                controlHtml = `
                    <label for="${control.id}">${control.label}</label>
                    <div class="slider-container">
                        <input type="range" id="${control.id}" min="${control.min}" max="${control.max}" value="${control.default}">
                        <span class="slider-value" id="${control.id}-value">${control.default}</span>
                    </div>
                `;
                break;
                
            case 'toggle':
                controlHtml = `
                    <div class="toggle-container">
                        <label class="toggle">
                            <input type="checkbox" id="${control.id}" ${control.default ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                        </label>
                        <span>${control.label}</span>
                    </div>
                `;
                break;
                
            case 'button':
                controlHtml = `
                    <button class="button btn-small" id="${control.id}">${control.label}</button>
                `;
                break;
                
            case 'dropdown':
                const options = control.options.map(option => 
                    `<option value="${option}" ${option === control.default ? 'selected' : ''}>${option}</option>`
                ).join('');
                
                controlHtml = `
                    <label for="${control.id}">${control.label}</label>
                    <select id="${control.id}" class="dropdown">
                        ${options}
                    </select>
                `;
                break;
                
            case 'number':
                controlHtml = `
                    <label for="${control.id}">${control.label}</label>
                    <input type="number" id="${control.id}" min="${control.min}" max="${control.max}" value="${control.default}">
                `;
                break;
        }
        
        controlGroup.innerHTML = controlHtml;
        simulationControls.appendChild(controlGroup);
        
        // Add event listeners
        if (control.type === 'slider') {
            const slider = document.getElementById(control.id);
            const value = document.getElementById(`${control.id}-value`);
            
            slider.addEventListener('input', () => {
                value.textContent = slider.value;
                updateExperimentState();
            });
        }
        
        if (control.type === 'toggle' || control.type === 'dropdown' || control.type === 'number') {
            const element = document.getElementById(control.id);
            element.addEventListener('change', updateExperimentState);
        }
        
        if (control.type === 'button') {
            const button = document.getElementById(control.id);
            button.addEventListener('click', () => {
                handleButtonClick(control.id);
            });
        }
    });
    
    // Initialize experiment state based on controls
    updateExperimentState();
}

// Update experiment state based on controls
function updateExperimentState() {
    if (!currentExperiment) return;
    
    // Create a temporary object for control values instead of resetting experimentState
    const controlValues = {};
    
    currentExperiment.controls.forEach(control => {
        const element = document.getElementById(control.id);
        if (!element) return;
        
        switch (control.type) {
            case 'slider':
            case 'number':
                controlValues[control.id] = parseInt(element.value);
                break;
                
            case 'toggle':
                controlValues[control.id] = element.checked;
                break;
                
            case 'dropdown':
                controlValues[control.id] = element.value;
                break;
        }
    });
    
    // Update only the control values in experimentState, preserving other state
    Object.assign(experimentState, controlValues);
}

// Handle button clicks
function handleButtonClick(buttonId) {
    if (!currentExperiment) return;
    
    // Handle reset for all experiments
    if (buttonId === 'resetBtn') {
        // Reset experiment specific state
        initializeExperiment(currentExperiment.id);
        return;
    }
    
    // Experiment-specific button handlers
    switch (currentExperiment.id) {
        case 'bell-inequality':
            if (buttonId === 'measureBtn') {
                experimentState.measurements = experimentState.measurements || [];
                const angleA = experimentState.angleA || 0;
                const angleB = experimentState.angleB || 45;
                
                // Quantum calculation for Bell's inequality
                const correlation = -Math.cos((angleA - angleB) * Math.PI / 180);
                
                // Simulate 10 measurements with quantum probability
                for (let i = 0; i < 10; i++) {
                    const random = Math.random();
                    const result = random < (1 + correlation) / 2 ? 'same' : 'opposite';
                    experimentState.measurements.push({
                        angleA,
                        angleB,
                        result
                    });
                }
            }
            break;
            
        case 'quantum-zeno':
            if (buttonId === 'measureBtn') {
                experimentState.lastMeasureTime = Date.now();
                experimentState.measured = true;
            }
            break;
            
        case 'quantum-teleportation':
            if (buttonId === 'entangleBtn') {
                experimentState.entangled = true;
                experimentState.bellMeasurement = false;
                experimentState.correctionApplied = false;
                experimentState.teleported = false;
            } else if (buttonId === 'bellBtn') {
                if (experimentState.entangled) {
                    experimentState.bellMeasurement = true;
                    experimentState.bellResult = Math.floor(Math.random() * 4);
                }
            } else if (buttonId === 'correctBtn') {
                if (experimentState.bellMeasurement) {
                    experimentState.correctionApplied = true;
                }
            } else if (buttonId === 'verifyBtn') {
                if (experimentState.correctionApplied) {
                    experimentState.teleported = true;
                }
            }
            break;
            
        case 'bloch-sphere':
            if (buttonId === 'applyBtn') {
                const gate = experimentState.gateSelect || 'H (Hadamard)';
                const angle = experimentState.rotationAngle || 90;
                
                applyQuantumGate(gate, angle);
            } else if (buttonId === 'measureBtn') {
                experimentState.measured = true;
                const prob0 = Math.pow(Math.cos(experimentState.theta * Math.PI / 360), 2);
                experimentState.measureResult = Math.random() < prob0 ? 0 : 1;
                
                if (experimentState.measureResult === 0) {
                    experimentState.theta = 0;
                    experimentState.phi = 0;
                } else {
                    experimentState.theta = 180;
                    experimentState.phi = 0;
                }
            } else if (buttonId === 'resetBtn') {
                experimentState.theta = 0;
                experimentState.phi = 0;
                experimentState.measured = false;
            }
            break;
            
        case 'shors-algorithm':
            if (buttonId === 'stepBtn') {
                experimentState.step = (experimentState.step || 0) + 1;
            } else if (buttonId === 'runBtn') {
                experimentState.running = true;
                experimentState.step = 0;
                runShorsAlgorithm();
            }
            break;
            
        case 'delayed-choice':
            if (buttonId === 'pathBtn') {
                experimentState.choiceMade = true;
                experimentState.choiceType = 'path';
            } else if (buttonId === 'interferenceBtn') {
                experimentState.choiceMade = true;
                experimentState.choiceType = 'interference';
            }
            break;
    }
}

// Apply quantum gate for Bloch sphere visualization
function applyQuantumGate(gate, angle) {
    if (!experimentState.theta) experimentState.theta = 0;
    if (!experimentState.phi) experimentState.phi = 0;
    
    const theta = experimentState.theta * Math.PI / 180;
    const phi = experimentState.phi * Math.PI / 180;
    const angleRad = angle * Math.PI / 180;
    
    // Convert spherical to Cartesian
    let x = Math.sin(theta) * Math.cos(phi);
    let y = Math.sin(theta) * Math.sin(phi);
    let z = Math.cos(theta);
    
    let newX, newY, newZ;
    
    switch (gate) {
        case 'X (NOT)':
            newX = x;
            newY = -z;
            newZ = y;
            break;
        case 'Y':
            newX = z;
            newY = y;
            newZ = -x;
            break;
        case 'Z':
            newX = -x;
            newY = y;
            newZ = z;
            break;
        case 'H (Hadamard)':
            newX = z;
            newY = y;
            newZ = x;
            break;
        case 'S':
            newX = y;
            newY = -x;
            newZ = z;
            break;
        case 'T':
            const cosT = Math.cos(Math.PI/8);
            const sinT = Math.sin(Math.PI/8);
            newX = cosT * x + sinT * y;
            newY = -sinT * x + cosT * y;
            newZ = z;
            break;
        case 'Rx':
            newX = x;
            newY = y * Math.cos(angleRad) - z * Math.sin(angleRad);
            newZ = y * Math.sin(angleRad) + z * Math.cos(angleRad);
            break;
        case 'Ry':
            newX = x * Math.cos(angleRad) + z * Math.sin(angleRad);
            newY = y;
            newZ = -x * Math.sin(angleRad) + z * Math.cos(angleRad);
            break;
        case 'Rz':
            newX = x * Math.cos(angleRad) - y * Math.sin(angleRad);
            newY = x * Math.sin(angleRad) + y * Math.cos(angleRad);
            newZ = z;
            break;
        default:
            newX = x;
            newY = y;
            newZ = z;
    }
    
    // Convert back to spherical
    const r = Math.sqrt(newX * newX + newY * newY + newZ * newZ);
    experimentState.theta = Math.acos(newZ / r) * 180 / Math.PI;
    experimentState.phi = Math.atan2(newY, newX) * 180 / Math.PI;
    
    if (experimentState.phi < 0) {
        experimentState.phi += 360;
    }
}

// Initialize experiment state
function initializeExperiment(experimentId) {
    // Clear canvas
    ctx.clearRect(0, 0, simulationCanvas.width, simulationCanvas.height);
    
    // Reset state to default control values
    updateExperimentState();
    
    // Experiment-specific initializations
    switch (experimentId) {
        case 'double-slit':
            experimentState.particles = [];
            experimentState.pattern = createDetectionPattern();
            break;
            
        case 'stern-gerlach':
            experimentState.particles = [];
            experimentState.detections = {
                up: 0,
                down: 0
            };
            break;
            
        case 'bell-inequality':
            experimentState.measurements = [];
            experimentState.correlations = {};
            break;
            
        case 'quantum-eraser':
            experimentState.particles = [];
            experimentState.pattern = createDetectionPattern();
            break;
            
        case 'delayed-choice':
            experimentState.particles = [];
            experimentState.pattern = createDetectionPattern();
            experimentState.choiceMade = false;
            experimentState.choiceType = '';
            break;
            
        case 'mach-zehnder':
            experimentState.particles = [];
            experimentState.detections = {
                detector1: 0,
                detector2: 0
            };
            break;
            
        case 'quantum-tunneling':
            experimentState.particles = [];
            experimentState.stats = {
                total: 0,
                tunneled: 0
            };
            break;
            
        case 'aharonov-bohm':
            experimentState.electrons = [];
            experimentState.pattern = createDetectionPattern();
            break;
            
        case 'quantum-zeno':
            experimentState.startTime = Date.now();
            experimentState.decayProbability = 0;
            experimentState.measured = false;
            experimentState.lastMeasureTime = 0;
            break;
            
        case 'quantum-teleportation':
            experimentState.entangled = false;
            experimentState.bellMeasurement = false;
            experimentState.correctionApplied = false;
            experimentState.teleported = false;
            experimentState.bellResult = null;
            break;
            
        case 'bloch-sphere':
            experimentState.theta = 0; // |0⟩ state
            experimentState.phi = 0;
            experimentState.measured = false;
            experimentState.measureResult = null;
            break;
            
        case 'shors-algorithm':
            experimentState.step = 0;
            experimentState.running = false;
            experimentState.results = null;
            break;
    }
}

// Helper to create a detection pattern array
function createDetectionPattern() {
    const pattern = new Array(300).fill(0);
    return pattern;
}

// Run Shor's algorithm simulation
function runShorsAlgorithm() {
    const n = experimentState.numberToFactor || 15;
    
    // Simulate quantum algorithm steps
    const steps = [
        "Initializing quantum registers...",
        `Finding factors for N = ${n}...`,
        "Applying quantum Fourier transform...",
        "Measuring quantum state...",
        "Performing classical post-processing..."
    ];
    
    let currentStep = 0;
    const totalSteps = steps.length;
    
    // Find factors (simplified)
    function findFactors(n) {
        // This is a classical simplification of Shor's algorithm result
        for (let i = 2; i < n; i++) {
            if (n % i === 0) {
                return [i, n / i];
            }
        }
        return [1, n]; // Prime
    }
    
    const stepInterval = setInterval(() => {
        if (currentStep < totalSteps) {
            experimentState.step = currentStep;
            experimentState.stepMessage = steps[currentStep];
            currentStep++;
        } else {
            clearInterval(stepInterval);
            const factors = findFactors(n);
            experimentState.results = {
                n: n,
                factors: factors,
                message: `Factorization complete: ${n} = ${factors[0]} × ${factors[1]}`
            };
            experimentState.running = false;
        }
    }, 1000);
}

// Improved canvas resizing function
function resizeCanvasCorrectly() {
    const container = document.querySelector('.simulation-canvas-container');
    if (!container || !simulationCanvas) {
        console.warn('Canvas or container not available yet');
        return;
    }

    const rect = container.getBoundingClientRect();
    const devicePixelRatio = window.devicePixelRatio || 1;
    
    // Skip if dimensions are invalid
    if (rect.width <= 0 || rect.height <= 0) {
        console.warn('Container has invalid dimensions, skipping resize');
        return;
    }
    
    console.log(`Resizing canvas to ${rect.width}x${rect.height}`);
    
    // Set physical pixel dimensions with device pixel ratio
    simulationCanvas.width = rect.width * devicePixelRatio;
    simulationCanvas.height = rect.height * devicePixelRatio;
    
    // Set CSS dimensions
    simulationCanvas.style.width = `${rect.width}px`;
    simulationCanvas.style.height = `${rect.height}px`;
    
    // Reset transformation matrix to account for pixel ratio
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    
    // Redraw if we have an active experiment
    if (currentExperiment) {
        drawExperiment();
    }
}

// Animate experiment with improved scaling
function animateExperiment() {
    // Request next frame first to ensure smooth animation even if processing takes time
    animationId = requestAnimationFrame(animateExperiment);
    
    if (currentExperiment) {
        // Update experiment state
        updateExperimentLogic();
        
        // Draw experiment with proper scaling
        drawExperiment();
    }
}

// Draw experiment with proper scaling
function drawExperiment() {
    if (!simulationCanvas || !ctx) {
        console.warn('Canvas or context not available');
        return;
    }
    
    const width = simulationCanvas.width;
    const height = simulationCanvas.height;
    
    // Clear canvas with a visible background
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, width, height);
    
    // Apply scaling and centering
    ctx.save();
    
    // Calculate scaling to fit content properly
    // Add padding percentage for better fitting

    const paddingPercentage = 0.1; // 20% padding

    // Calculate scaling with padding
    const scaleX = width / 600; // Reference width
    const scaleY = height / 500; // Reference height
    const baseScale = Math.min(scaleX, scaleY);
    const scale = baseScale * (1 - paddingPercentage);

    // Calculate center position
    const centerX = width / 2;
    const centerY = height / 2;

    // Apply transformations with padding
    ctx.translate(centerX, centerY);
    ctx.scale(scale, scale);
    ctx.translate(-300, -250); // Center based on 600x500 reference
    
    // Draw the appropriate experiment
    if (currentExperiment) {
        try {
            switch (currentExperiment.id) {
                case 'double-slit':
                    drawDoubleSlit();
                    break;
                    
                case 'stern-gerlach':
                    drawSternGerlach();
                    break;
                    
                case 'bell-inequality':
                    drawBellInequality();
                    break;
                    
                case 'quantum-eraser':
                    drawQuantumEraser();
                    break;
                    
                case 'delayed-choice':
                    drawDelayedChoice();
                    break;
                    
                case 'mach-zehnder':
                    drawMachZehnder();
                    break;
                    
                case 'quantum-tunneling':
                    drawQuantumTunneling();
                    break;
                    
                case 'aharonov-bohm':
                    drawAharonovBohm();
                    break;
                    
                case 'quantum-zeno':
                    drawQuantumZeno();
                    break;
                    
                case 'quantum-teleportation':
                    drawQuantumTeleportation();
                    break;
                    
                case 'bloch-sphere':
                    drawBlochSphere();
                    break;
                    
                case 'shors-algorithm':
                    drawShorsAlgorithm();
                    break;
            }
        } catch (err) {
            console.error('Error in drawing function:', err);
            
            // Draw error message
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Error drawing experiment', 300, 250);
            ctx.fillText(err.message, 300, 280);
        }
    }
    
    ctx.restore();
}

// Update experiment logic based on the current experiment
function updateExperimentLogic() {
    switch (currentExperiment.id) {
        case 'double-slit':
            updateDoubleSlit();
            break;
            
        case 'stern-gerlach':
            updateSternGerlach();
            break;
            
        case 'bell-inequality':
            updateBellInequality();
            break;
            
        case 'quantum-eraser':
            updateQuantumEraser();
            break;
            
        case 'delayed-choice':
            updateDelayedChoice();
            break;
            
        case 'mach-zehnder':
            updateMachZehnder();
            break;
            
        case 'quantum-tunneling':
            updateQuantumTunneling();
            break;
            
        case 'aharonov-bohm':
            updateAharonovBohm();
            break;
            
        case 'quantum-zeno':
            updateQuantumZeno();
            break;
            
        case 'quantum-teleportation':
            // No continuous update needed
            break;
            
        case 'bloch-sphere':
            // No continuous update needed
            break;
            
        case 'shors-algorithm':
            // No continuous update needed
            break;
    }
}

// Experiment-specific update functions
function updateDoubleSlit() {
    const laserOn = experimentState.laserToggle !== false;
    const detectors = experimentState.detectorsToggle === true;
    const slitDistance = experimentState.slitDistance || 60;
    const particleRate = experimentState.particleRate || 5;
    
    if (laserOn && Math.random() < particleRate / 60) {
        // Add new particle
        experimentState.particles.push({
            x: 50,
            y: simulationCanvas.height / 2 + (Math.random() * 10 - 5),
            vx: 2 + Math.random(),
            phase: Math.random() * Math.PI * 2,
            detected: false,
            path: null
        });
    }
    
    // Update particles
    experimentState.particles.forEach((particle, index) => {
        if (!particle.detected) {
            particle.x += particle.vx;
            
            // Check if particle reaches the slits
            if (particle.x >= 200 && !particle.path) {
                const slitY1 = 250 - slitDistance / 2;
                const slitY2 = 250 + slitDistance / 2;
                
                // Determine if particle goes through slits
                const slit1Distance = Math.abs(particle.y - slitY1);
                const slit2Distance = Math.abs(particle.y - slitY2);
                
                if (slit1Distance < 10) {
                    particle.path = 'top';
                    // If detectors are on, we know the path
                    if (detectors) {
                        particle.vx = 2;
                        particle.vy = 0;
                    } else {
                        // Quantum behavior - superposition
                        particle.vx = 2;
                        particle.vy = 0;
                    }
                } else if (slit2Distance < 10) {
                    particle.path = 'bottom';
                    // If detectors are on, we know the path
                    if (detectors) {
                        particle.vx = 2;
                        particle.vy = 0;
                    } else {
                        // Quantum behavior - superposition
                        particle.vx = 2;
                        particle.vy = 0;
                    }
                } else {
                    // Particle hits the barrier
                    experimentState.particles.splice(index, 1);
                    return;
                }
            }
            
            // Check if particle reaches the detector screen
            if (particle.x >= 450) {
                particle.detected = true;
                
                // Record detection position
                const screenY = Math.floor(particle.y);
                const screenIndex = Math.min(Math.max(Math.floor((screenY / 500) * 300), 0), experimentState.pattern.length - 1);
                
                if (!detectors) {
                    // Quantum interference pattern
                    const interference = Math.cos(10 * (screenY / 500) * Math.PI + particle.phase);
                    const probability = Math.pow(interference, 2);
                    
                    if (Math.random() < probability) {
                        experimentState.pattern[screenIndex] += 1;
                    }
                } else {
                    // Classical pattern (no interference)
                    experimentState.pattern[screenIndex] += 1;
                }
            }
        }
    });
    
    // Remove particles that are out of bounds
    experimentState.particles = experimentState.particles.filter(p => 
        p.x > 0 && p.x < 600 && p.y > 0 && p.y < 500
    );
}

function updateSternGerlach() {
    const beamOn = experimentState.beamToggle !== false;
    const magnetStrength = experimentState.magnetStrength || 50;
    
    if (beamOn && Math.random() < 0.1) {
        // Add new particle
        experimentState.particles.push({
            x: 50,
            y: 250 + (Math.random() * 20 - 10),
            vx: 2,
            vy: 0,
            spin: Math.random() < 0.5 ? 'up' : 'down',
            detected: false
        });
    }
    
    // Update particles
    experimentState.particles.forEach((particle, index) => {
        particle.x += particle.vx;
        
        // Magnet effect region
        if (particle.x > 200 && particle.x < 350) {
            // Particles deflect based on spin and magnet strength
            const deflection = (particle.spin === 'up' ? -1 : 1) * (magnetStrength / 500);
            particle.vy += deflection;
        }
        
        particle.y += particle.vy;
        
        // Check if particle reaches the detector screens
        if (particle.x >= 450 && !particle.detected) {
            particle.detected = true;
            
            // Record detection based on position
            if (particle.y < 250) {
                experimentState.detections.up++;
            } else {
                experimentState.detections.down++;
            }
        }
    });
    
    // Remove particles that are out of bounds
    experimentState.particles = experimentState.particles.filter(p => 
        p.x > 0 && p.x < 600 && p.y > 0 && p.y < 500
    );
}

function updateBellInequality() {
    // No dynamic simulation needed, measurements are triggered by buttons
    // Update statistics
    if (experimentState.measurements && experimentState.measurements.length > 0) {
        const correlations = {};
        
        // Group by angle settings
        experimentState.measurements.forEach(m => {
            const key = `${m.angleA}-${m.angleB}`;
            if (!correlations[key]) {
                correlations[key] = { same: 0, opposite: 0, total: 0 };
            }
            
            correlations[key][m.result]++;
            correlations[key].total++;
        });
        
        // Calculate correlation coefficients
        Object.keys(correlations).forEach(key => {
            const c = correlations[key];
            c.correlation = (c.same - c.opposite) / c.total;
        });
        
        experimentState.correlations = correlations;
    }
}

function updateQuantumEraser() {
    const laserOn = experimentState.laserToggle !== false;
    const eraseInfo = experimentState.eraseToggle === true;
    const delayedChoice = experimentState.delayedToggle === true;
    const particleRate = experimentState.particleRate || 5;
    
    if (laserOn && Math.random() < particleRate / 60) {
        // Add new entangled particle pair
        const particle = {
            x: 50,
            y: 250 + (Math.random() * 10 - 5),
            vx: 2 + Math.random(),
            phase: Math.random() * Math.PI * 2,
            path: null,
            detected: false,
            entangled: {
                detected: false,
                erased: delayedChoice ? null : eraseInfo
            }
        };
        
        experimentState.particles.push(particle);
    }
    
    // Update particles
    experimentState.particles.forEach((particle, index) => {
        if (!particle.detected) {
            particle.x += particle.vx;
            
            // Check if particle reaches the slits
            if (particle.x >= 200 && !particle.path) {
                // Quantum random choice of path
                particle.path = Math.random() < 0.5 ? 'top' : 'bottom';
            }
            
            // Delayed choice is made for entangled particle
            if (delayedChoice && particle.x >= 300 && particle.entangled.erased === null) {
                particle.entangled.erased = eraseInfo;
            }
            
            // Check if particle reaches the detector screen
            if (particle.x >= 450) {
                particle.detected = true;
                
                // Record detection position
                const screenY = Math.floor(particle.y);
                const screenIndex = Math.min(Math.max(Math.floor((screenY / 500) * 300), 0), experimentState.pattern.length - 1);
                
                if (particle.entangled.erased) {
                    // Quantum interference pattern (erased which-path info)
                    const interference = Math.cos(10 * (screenY / 500) * Math.PI + particle.phase);
                    const probability = Math.pow(interference, 2);
                    
                    if (Math.random() < probability) {
                        experimentState.pattern[screenIndex] += 1;
                    }
                } else {
                    // Classical pattern (which-path info available)
                    experimentState.pattern[screenIndex] += 1;
                }
            }
        }
    });
    
    // Remove particles that are out of bounds
    experimentState.particles = experimentState.particles.filter(p => 
        p.x > 0 && p.x < 600 && p.y > 0 && p.y < 500
    );
}

function updateDelayedChoice() {
    const sourceOn = experimentState.sourceToggle !== false;
    const delayedMode = experimentState.delayedToggle !== false;
    const delayTime = experimentState.delayTime || 50;
    
    if (sourceOn && Math.random() < 0.1) {
        // Add new particle
        experimentState.particles.push({
            x: 50,
            y: 250,
            vx: 3,
            phase: Math.random() * Math.PI * 2,
            time: 0,
            choiceMade: false,
            choiceType: null,
            detected: false
        });
    }
    
    // Update particles
    experimentState.particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.time += 1;
        
        // Make delayed choice
        if (delayedMode && particle.x > 350 && !particle.choiceMade) {
            // Delayed choice based on button clicks
            particle.choiceMade = true;
            
            if (experimentState.choiceMade) {
                particle.choiceType = experimentState.choiceType;
            } else {
                // Default behavior
                particle.choiceType = Math.random() < 0.5 ? 'path' : 'interference';
            }
        } else if (!delayedMode && particle.x > 200 && !particle.choiceMade) {
            // Immediate choice
            particle.choiceMade = true;
            
            if (experimentState.choiceMade) {
                particle.choiceType = experimentState.choiceType;
            } else {
                // Default behavior
                particle.choiceType = Math.random() < 0.5 ? 'path' : 'interference';
            }
        }
        
        // Check if particle reaches the detector screen
        if (particle.x >= 450 && !particle.detected) {
            particle.detected = true;
            
            // Record detection position
            const screenY = Math.floor(particle.y);
            const screenIndex = Math.min(Math.max(Math.floor((screenY / 500) * 300), 0), experimentState.pattern.length - 1);
            
            if (particle.choiceType === 'interference') {
                // Quantum interference pattern
                const interference = Math.cos(10 * (screenY / 500) * Math.PI + particle.phase);
                const probability = Math.pow(interference, 2);
                
                if (Math.random() < probability) {
                    experimentState.pattern[screenIndex] += 1;
                }
            } else {
                // Classical pattern (path measurement)
                experimentState.pattern[screenIndex] += 1;
            }
        }
    });
    
    // Remove particles that are out of bounds
    experimentState.particles = experimentState.particles.filter(p => 
        p.x > 0 && p.x < 600 && p.y > 0 && p.y < 500
    );
}

function updateMachZehnder() {
    const sourceOn = experimentState.sourceToggle !== false;
    const phaseDiff = experimentState.phaseDiff || 0;
    const singlePhoton = experimentState.singleToggle === true;
    const splitterRatio = experimentState.splitterRatio || 50;
    
    const photonProbability = singlePhoton ? 0.05 : 0.2;
    
    if (sourceOn && Math.random() < photonProbability) {
        // Add new photon
        experimentState.particles.push({
            x: 50,
            y: 250,
            vx: 3,
            vy: 0,
            path: null,
            phase: 0,
            detected: false
        });
    }
    
    // Update particles
    experimentState.particles.forEach((particle) => {
        // Move particle
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // First beam splitter
        if (particle.x > 150 && particle.x < 160 && particle.path === null) {
            // Quantum random path based on splitter ratio
            const randomPath = Math.random() * 100;
            
            if (randomPath < splitterRatio) {
                // Reflected path
                particle.vx = 0;
                particle.vy = 3;
                particle.path = 'upper';
            } else {
                // Transmitted path
                particle.vx = 3;
                particle.vy = 0;
                particle.path = 'lower';
            }
        }
        
        // Upper mirror
        if (particle.path === 'upper' && particle.y > 350 && particle.vy > 0) {
            particle.vx = 3;
            particle.vy = 0;
            // Add phase based on path difference
            particle.phase = phaseDiff * Math.PI / 180;
        }
        
        // Lower mirror
        if (particle.path === 'lower' && particle.x > 250 && particle.vx > 0 && particle.y < 260) {
            particle.vx = 0;
            particle.vy = 3;
        }
        
        // Second beam splitter
        if (particle.x > 250 && particle.y > 350 && !particle.secondSplit) {
            particle.secondSplit = true;
            
            // Quantum interference based on phase
            const interference = Math.cos(particle.phase);
            const probability = Math.pow(interference, 2);
            
            if (Math.random() < probability) {
                // Detector 1
                particle.vx = 3;
                particle.vy = 0;
                particle.detector = 1;
            } else {
                // Detector 2
                particle.vx = 0;
                particle.vy = 3;
                particle.detector = 2;
            }
        }
        
        // Detectors
        if ((particle.x > 400 || particle.y > 450) && !particle.detected) {
            particle.detected = true;
            
            if (particle.detector === 1) {
                experimentState.detections.detector1++;
            } else if (particle.detector === 2) {
                experimentState.detections.detector2++;
            }
        }
    });
    
    // Remove particles that are out of bounds
    experimentState.particles = experimentState.particles.filter(p => 
        p.x > 0 && p.x < 600 && p.y > 0 && p.y < 500
    );
}

function updateQuantumTunneling() {
    const particlesOn = experimentState.particleToggle !== false;
    const barrierHeight = experimentState.barrierHeight || 100;
    const barrierWidth = experimentState.barrierWidth || 30;
    const particleEnergy = experimentState.particleEnergy || 50;
    
    if (particlesOn && Math.random() < 0.1) {
        // Add new particle
        experimentState.particles.push({
            x: 50,
            y: 250 + (Math.random() * 60 - 30),
            vx: 2,
            energy: particleEnergy,
            tunneled: false,
            reflected: false,
            detected: false
        });
        
        experimentState.stats.total++;
    }
    
    // Update particles
    experimentState.particles.forEach((particle) => {
        // Move particle
        particle.x += particle.vx;
        
        // Barrier region
        const barrierX = 300 - barrierWidth / 2;
        
        if (particle.x >= barrierX && particle.x <= barrierX + barrierWidth && !particle.tunneled && !particle.reflected) {
            // Calculate tunneling probability
            // Simplified quantum tunneling probability formula
            const relativePotential = barrierHeight / particle.energy;
            const tunnelProbability = Math.exp(-2 * barrierWidth * Math.sqrt(2 * relativePotential));
            
            if (Math.random() < tunnelProbability) {
                // Particle tunnels through
                particle.tunneled = true;
                particle.x = barrierX + barrierWidth + 1;
                experimentState.stats.tunneled++;
            } else {
                // Particle is reflected
                particle.reflected = true;
                particle.vx = -particle.vx;
            }
        }
        
        // Check if particle reaches the detector
        if (particle.x >= 550 && !particle.detected) {
            particle.detected = true;
        } else if (particle.x <= 0 && !particle.detected) {
            particle.detected = true;
        }
    });
    
    // Remove particles that are detected
    experimentState.particles = experimentState.particles.filter(p => !p.detected);
}

function updateAharonovBohm() {
    const electronBeam = experimentState.electronToggle !== false;
    const solenoidOn = experimentState.solenoidToggle !== false;
    const magneticFlux = experimentState.magneticFlux || 50;
    const electronRate = experimentState.electronRate || 10;
    
    if (electronBeam && Math.random() < electronRate / 60) {
        // Each electron has two possible paths around the solenoid
        const phase = Math.random() * Math.PI * 2;
        
        // Create electron taking upper path
        experimentState.electrons.push({
            x: 50,
            y: 250,
            path: 'upper',
            phase: phase,
            progress: 0,
            detected: false
        });
        
        // Create electron taking lower path
        experimentState.electrons.push({
            x: 50,
            y: 250,
            path: 'lower',
            phase: phase,
            progress: 0,
            detected: false
        });
    }
    
    // Update electrons
    experimentState.electrons.forEach((electron) => {
        // Move along path
        electron.progress += 0.01;
        
        // Calculate position based on path
        const centerX = 300;
        const centerY = 250;
        const radius = 100;
        
        if (electron.path === 'upper') {
            const angle = electron.progress * Math.PI;
            electron.x = centerX - radius * Math.cos(angle);
            electron.y = centerY - radius * Math.sin(angle);
        } else {
            const angle = electron.progress * Math.PI;
            electron.x = centerX - radius * Math.cos(angle);
            electron.y = centerY + radius * Math.sin(angle);
        }
        
        // Add phase shift based on magnetic flux
        if (solenoidOn && electron.progress >= 0.5 && electron.path === 'upper') {
            electron.phaseShift = (magneticFlux / 50) * Math.PI;
        }
        
        // Electrons recombine at the end of the paths
        if (electron.progress >= 1 && !electron.detected) {
            electron.detected = true;
            
            // Record detection position with interference pattern
            const phaseShift = electron.phaseShift || 0;
            const totalPhase = electron.phase + phaseShift;
            
            // Create interference pattern based on phase
            const screenY = centerY + 50 * Math.sin(totalPhase);
            const screenIndex = Math.min(Math.max(Math.floor((screenY / 500) * 300), 0), experimentState.pattern.length - 1);
            
            experimentState.pattern[screenIndex] += 1;
        }
    });
    
    // Remove detected electrons
    experimentState.electrons = experimentState.electrons.filter(e => !e.detected);
}

function updateQuantumZeno() {
    const systemOn = experimentState.systemToggle !== false;
    const measureRate = experimentState.measureRate || 0;
    const autoMeasure = experimentState.autoToggle === true;
    
    if (!systemOn) return;
    
    const currentTime = Date.now();
    const elapsedTime = (currentTime - experimentState.startTime) / 1000;
    
    // Natural decay probability increases over time (following exponential decay)
    const naturalDecayConstant = 0.05;
    const naturalDecayProb = 1 - Math.exp(-naturalDecayConstant * elapsedTime);
    
    // Reset if measurement is taken
    if (experimentState.measured) {
        const resetTime = (currentTime - experimentState.lastMeasureTime) / 1000;
        const resetProb = Math.min(resetTime * 2, 1); // Reset within 0.5 seconds
        
        if (Math.random() < resetProb) {
            experimentState.measured = false;
        }
    }
    
    // Auto measurement
    if (autoMeasure && measureRate > 0) {
        const measureInterval = 5000 / measureRate; // Max 5 seconds, min 50ms
        
        if (currentTime - experimentState.lastMeasureTime > measureInterval) {
            experimentState.lastMeasureTime = currentTime;
            experimentState.measured = true;
        }
    }
    
    // Calculate actual decay probability based on Quantum Zeno effect
    let actualDecayProb;
    
    if (measureRate === 0) {
        // No measurements, natural decay
        actualDecayProb = naturalDecayProb;
    } else {
        // With measurements, decay is slowed (Quantum Zeno Effect)
        // The higher the measurement rate, the slower the decay
        const zenoFactor = Math.exp(-measureRate / 20);
        actualDecayProb = naturalDecayProb * zenoFactor;
    }
    
    experimentState.decayProbability = actualDecayProb;
}

// Draw functions for each experiment type
// These functions should be called within the context of drawExperiment
// which handles the scaling and centering

// Draw quantum teleportation experiment
function drawQuantumTeleportation() {
    // Draw background
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, 600, 500);
    
    // Draw labels
    ctx.font = '20px Arial';
    ctx.fillStyle = '#aaa';
    ctx.fillText('Alice', 100, 80);
    ctx.fillText('Bob', 500, 80);
    
    // Draw input state (to be teleported)
    ctx.fillStyle = experimentState.entangled ? '#ff5555' : '#555555';
    ctx.beginPath();
    ctx.arc(80, 150, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText('ψ', 73, 157);
    
    // Draw entangled pair
    ctx.fillStyle = experimentState.entangled ? '#55aaff' : '#555555';
    
    // Alice's entangled particle
    ctx.beginPath();
    ctx.arc(150, 250, 25, 0, Math.PI * 2);
    ctx.fill();
    
    // Bob's entangled particle
    ctx.beginPath();
    ctx.arc(450, 250, 25, 0, Math.PI * 2);
    ctx.fill();
    
    // Entanglement line
    if (experimentState.entangled) {
        ctx.strokeStyle = '#55aaff';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(150, 250);
        ctx.bezierCurveTo(150, 350, 450, 350, 450, 250);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Phi symbol in both particles
        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.fillText('Φ', 143, 257);
        ctx.fillText('Φ', 443, 257);
    }
    
    // Bell measurement
    ctx.fillStyle = experimentState.bellMeasurement ? '#55ff55' : '#555555';
    ctx.fillRect(50, 320, 150, 80);
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.fillText('Bell Measurement', 60, 365);
    
    // Input state connecting to Bell measurement
    if (experimentState.entangled) {
        ctx.strokeStyle = '#ff5555';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(80, 175);
        ctx.lineTo(80, 320);
        ctx.stroke();
        
        // Alice's entangled particle connecting to Bell measurement
        ctx.strokeStyle = '#55aaff';
        ctx.beginPath();
        ctx.moveTo(150, 275);
        ctx.lineTo(150, 320);
        ctx.stroke();
    }
    
    // Classical channel
    ctx.strokeStyle = experimentState.bellMeasurement ? '#ffff55' : '#555555';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(200, 360);
    ctx.lineTo(400, 360);
    ctx.stroke();
    
    // Draw arrow
    if (experimentState.bellMeasurement) {
        ctx.fillStyle = '#ffff55';
        ctx.beginPath();
        ctx.moveTo(400, 360);
        ctx.lineTo(390, 350);
        ctx.lineTo(390, 370);
        ctx.fill();
    }
    
    // Correction operation
    ctx.fillStyle = experimentState.correctionApplied ? '#ff5555' : '#555555';
    ctx.fillRect(400, 320, 150, 80);
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.fillText('Quantum Correction', 410, 365);
    
    // Connecting Bob's particle to correction
    if (experimentState.bellMeasurement) {
        ctx.strokeStyle = '#55aaff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(450, 275);
        ctx.lineTo(450, 320);
        ctx.stroke();
    }
    
    // Final teleported state
    ctx.fillStyle = experimentState.teleported ? '#ff5555' : '#555555';
    ctx.beginPath();
    ctx.arc(520, 150, 25, 0, Math.PI * 2);
    ctx.fill();
    
    // Psi symbol in teleported state
    if (experimentState.teleported) {
        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.fillText('ψ', 513, 157);
        
        // Line from correction to teleported state
        ctx.strokeStyle = '#ff5555';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(520, 320);
        ctx.lineTo(520, 175);
        ctx.stroke();
    }
    
    // Draw Bell measurement result
    if (experimentState.bellMeasurement) {
        const bellResults = ['00', '01', '10', '11'];
        ctx.fillStyle = '#fff';
        ctx.font = '16px Arial';
        ctx.fillText(`Result: |${bellResults[experimentState.bellResult || 0]}⟩`, 60, 400);
    }
    
    // Draw info text for the simulation info div
    let infoText = 'Quantum Teleportation | ';
    
    if (!experimentState.entangled) {
        infoText += 'Step 1: Create entangled pair';
    } else if (!experimentState.bellMeasurement) {
        infoText += 'Step 2: Perform Bell measurement';
    } else if (!experimentState.correctionApplied) {
        infoText += 'Step 3: Apply quantum correction';
    } else if (!experimentState.teleported) {
        infoText += 'Step 4: Verify teleportation';
    } else {
        infoText += 'Teleportation complete! State ψ transferred from Alice to Bob';
    }
    
    simulationInfo.textContent = infoText;
}

// Draw Double-Slit experiment
function drawDoubleSlit() {
    const laserOn = experimentState.laserToggle !== false;
    const detectors = experimentState.detectorsToggle === true;
    const slitDistance = experimentState.slitDistance || 60;
    
    // Draw laser
    ctx.fillStyle = laserOn ? '#f55' : '#555';
    ctx.fillRect(10, 250 - 15, 40, 30);
    
    // Draw laser beam
    if (laserOn) {
        ctx.fillStyle = 'rgba(255, 80, 80, 0.2)';
        ctx.beginPath();
        ctx.moveTo(50, 250);
        ctx.lineTo(200, 250 - 50);
        ctx.lineTo(200, 250 + 50);
        ctx.fill();
    }
    
    // Draw double slit barrier
    ctx.fillStyle = '#333';
    ctx.fillRect(200, 0, 5, 250 - slitDistance / 2 - 10);
    ctx.fillRect(200, 250 - slitDistance / 2 + 10, 5, slitDistance - 20);
    ctx.fillRect(200, 250 + slitDistance / 2 - 10, 5, 250 - slitDistance / 2 + 10);
    
    // Draw path detectors
    if (detectors) {
        ctx.fillStyle = '#5af';
        ctx.fillRect(220, 250 - slitDistance / 2 - 5, 15, 10);
        ctx.fillRect(220, 250 + slitDistance / 2 - 5, 15, 10);
    }
    
    // Draw detector screen
    ctx.fillStyle = '#555';
    ctx.fillRect(450, 0, 10, 500);
    
    // Draw particles
    ctx.fillStyle = '#ff5';
    experimentState.particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Draw detection pattern
    const maxIntensity = Math.max(1, ...experimentState.pattern);
    
    for (let i = 0; i < experimentState.pattern.length; i++) {
        const intensity = experimentState.pattern[i] / maxIntensity;
        const y = (i / experimentState.pattern.length) * 500;
        ctx.fillStyle = `rgba(255, 255, 80, ${intensity})`;
        ctx.fillRect(460, y, 30, 2);
    }
    
    // Draw info text
    let infoText = `Particles: ${experimentState.particles.length}`;
    if (detectors) {
        infoText += ' | Path measured: Classical pattern';
    } else {
        infoText += ' | Quantum interference pattern';
    }
    
    simulationInfo.textContent = infoText;
}

// Draw Stern-Gerlach experiment
function drawSternGerlach() {
    const beamOn = experimentState.beamToggle !== false;
    const magnetStrength = experimentState.magnetStrength || 50;
    const orientation = experimentState.magnetOrientation || 'Z-axis';
    
    // Draw atom source
    ctx.fillStyle = beamOn ? '#55aaff' : '#555';
    ctx.fillRect(10, 250 - 15, 40, 30);
    
    // Draw beam path
    if (beamOn) {
        ctx.strokeStyle = '#55aaff';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(50, 250);
        ctx.lineTo(150, 250);
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    // Draw magnet
    const magnetLabel = orientation.charAt(0);
    
    // Magnet upper pole
    ctx.fillStyle = 'rgba(255, 80, 80, 0.5)';
    ctx.beginPath();
    ctx.moveTo(150, 180);
    ctx.lineTo(250, 180);
    ctx.lineTo(250, 220);
    ctx.lineTo(150, 220);
    ctx.fill();
    
    // Magnet lower pole
    ctx.fillStyle = 'rgba(80, 80, 255, 0.5)';
    ctx.beginPath();
    ctx.moveTo(150, 280);
    ctx.lineTo(250, 280);
    ctx.lineTo(250, 320);
    ctx.lineTo(150, 320);
    ctx.fill();
    
    // Magnetic field gradient
    ctx.fillStyle = 'rgba(180, 180, 180, 0.2)';
    ctx.beginPath();
    ctx.moveTo(150, 220);
    ctx.lineTo(250, 220);
    ctx.lineTo(250, 280);
    ctx.lineTo(150, 280);
    ctx.fill();
    
    // Draw magnet label
    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.fillText(magnetLabel, 200, 250);
    
    // Draw detector screens
    ctx.fillStyle = '#555';
    ctx.fillRect(450, 150, 15, 60);
    ctx.fillRect(450, 290, 15, 60);
    
    // Draw particles
    experimentState.particles.forEach(particle => {
        ctx.fillStyle = particle.spin === 'up' ? '#ffff55' : '#55ffff';
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 5, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Draw detection counts
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText(`Spin ↑: ${experimentState.detections.up}`, 400, 180);
    ctx.fillText(`Spin ↓: ${experimentState.detections.down}`, 400, 320);
    
    // Draw info text
    const totalDetections = experimentState.detections.up + experimentState.detections.down;
    let infoText = `Spin-${orientation} | Magnet: ${magnetStrength}% | Detections: ${totalDetections}`;
    if (totalDetections > 0) {
        const upPercentage = Math.round((experimentState.detections.up / totalDetections) * 100);
        infoText += ` | Spin ↑: ${upPercentage}%, Spin ↓: ${100 - upPercentage}%`;
    }
    
    simulationInfo.textContent = infoText;
}

// Draw Bell Inequality experiment
function drawBellInequality() {
    const entanglement = experimentState.entanglementToggle !== false;
    const angleA = experimentState.angleA || 0;
    const angleB = experimentState.angleB || 45;
    
    // Draw entanglement source
    ctx.fillStyle = entanglement ? '#55aaff' : '#555';
    ctx.beginPath();
    ctx.arc(300, 250, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.fillText('Source', 280, 255);
    
    // Draw entanglement lines
    if (entanglement) {
        ctx.strokeStyle = '#55aaff';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(300, 250);
        ctx.lineTo(100, 250);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(300, 250);
        ctx.lineTo(500, 250);
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    // Draw detector A
    ctx.fillStyle = '#ff5555';
    ctx.save();
    ctx.translate(100, 250);
    ctx.rotate(angleA * Math.PI / 180);
    ctx.fillRect(-40, -40, 80, 80);
    
    // Draw detector axis
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -40);
    ctx.lineTo(0, 40);
    ctx.stroke();
    ctx.restore();
    
    // Draw detector B
    ctx.fillStyle = '#55ff55';
    ctx.save();
    ctx.translate(500, 250);
    ctx.rotate(angleB * Math.PI / 180);
    ctx.fillRect(-40, -40, 80, 80);
    
    // Draw detector axis
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -40);
    ctx.lineTo(0, 40);
    ctx.stroke();
    ctx.restore();
    
    // Draw detector labels
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText(`A: ${angleA}°`, 80, 340);
    ctx.fillText(`B: ${angleB}°`, 480, 340);
    
    // Draw correlation graph if measurements exist
    if (experimentState.correlations && Object.keys(experimentState.correlations).length > 0) {
        const data = experimentState.correlations[`${angleA}-${angleB}`];
        
        if (data) {
            // Draw correlation value
            ctx.fillStyle = '#ffff55';
            ctx.font = '24px Arial';
            ctx.fillText(`Correlation: ${data.correlation.toFixed(2)}`, 220, 150);
            
            // Draw measurement statistics
            ctx.fillStyle = '#fff';
            ctx.font = '16px Arial';
            ctx.fillText(`Same outcome: ${data.same}`, 220, 180);
            ctx.fillText(`Opposite outcome: ${data.opposite}`, 220, 200);
            ctx.fillText(`Total measurements: ${data.total}`, 220, 220);
            
            // Draw CHSH value if we have enough data
            const correlations = Object.values(experimentState.correlations);
            if (correlations.length >= 4) {
                // Simple simulation of CHSH inequality calculation
                const s = Math.abs(correlations.reduce((sum, c) => sum + c.correlation, 0));
                ctx.fillStyle = s > 2 ? '#55ff55' : '#ff5555';
                ctx.font = '20px Arial';
                ctx.fillText(`CHSH Value: ${s.toFixed(2)}${s > 2 ? ' > 2 (Quantum)' : ' ≤ 2 (Classical)'}`, 180, 400);
            }
        }
    }
    
    // Draw info text
    const measurementCount = experimentState.measurements ? experimentState.measurements.length : 0;
    let infoText = `Bell's Inequality | Detector A: ${angleA}°, Detector B: ${angleB}° | Measurements: ${measurementCount}`;
    
    simulationInfo.textContent = infoText;
}

// Draw Quantum Eraser experiment
function drawQuantumEraser() {
    const laserOn = experimentState.laserToggle !== false;
    const eraseInfo = experimentState.eraseToggle === true;
    const delayedChoice = experimentState.delayedToggle === true;
    
    // Draw laser source
    ctx.fillStyle = laserOn ? '#ff5555' : '#555';
    ctx.fillRect(10, 235, 40, 30);
    
    // Draw laser beam
    if (laserOn) {
        ctx.fillStyle = 'rgba(255, 80, 80, 0.2)';
        ctx.beginPath();
        ctx.moveTo(50, 250);
        ctx.lineTo(150, 250 - 50);
        ctx.lineTo(150, 250 + 50);
        ctx.fill();
    }
    
    // Draw double slit
    ctx.fillStyle = '#333';
    ctx.fillRect(150, 150, 5, 70);
    ctx.fillRect(150, 240, 5, 20);
    ctx.fillRect(150, 280, 5, 70);
    
    // Draw which-path detectors
    ctx.fillStyle = eraseInfo ? '#555' : '#55aaff';
    ctx.fillRect(165, 215, 15, 15);
    ctx.fillRect(165, 265, 15, 15);
    
    // Draw eraser
    ctx.fillStyle = eraseInfo ? '#55ff55' : '#555';
    ctx.beginPath();
    ctx.arc(300, 250, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.fillText(eraseInfo ? 'Erased' : 'Not Erased', 255, 255);
    
    // Draw delayed choice label
    if (delayedChoice) {
        ctx.fillStyle = '#ffff55';
        ctx.font = '14px Arial';
        ctx.fillText('Delayed Choice', 260, 290);
    }
    
    // Draw detector screen
    ctx.fillStyle = '#555';
    ctx.fillRect(450, 150, 10, 200);
    
    // Draw particles
    ctx.fillStyle = '#ffff55';
    experimentState.particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Draw detection pattern
    const maxIntensity = Math.max(1, ...experimentState.pattern);
    
    for (let i = 0; i < experimentState.pattern.length; i++) {
        const intensity = experimentState.pattern[i] / maxIntensity;
        const y = (i / experimentState.pattern.length) * 200 + 150;
        ctx.fillStyle = `rgba(255, 255, 80, ${intensity})`;
        ctx.fillRect(460, y, 30, 2);
    }
    
    // Draw wave or particle pattern label
    ctx.fillStyle = '#fff';
    ctx.font = '18px Arial';
    if (eraseInfo) {
        ctx.fillText('Wave pattern (interference)', 370, 140);
    } else {
        ctx.fillText('Particle pattern (no interference)', 350, 140);
    }
    
    // Draw info text
    let infoText = `Quantum Eraser | Path info ${eraseInfo ? 'erased' : 'measured'} | `;
    infoText += delayedChoice ? 'Delayed choice active' : 'Immediate choice';
    
    simulationInfo.textContent = infoText;
}

// Draw Delayed Choice experiment
function drawDelayedChoice() {
    const sourceOn = experimentState.sourceToggle !== false;
    const delayedMode = experimentState.delayedToggle !== false;
    const delayTime = experimentState.delayTime || 50;
    
    // Draw photon source
    ctx.fillStyle = sourceOn ? '#55aaff' : '#555';
    ctx.fillRect(10, 235, 40, 30);
    
    // Draw beam path
    if (sourceOn) {
        ctx.strokeStyle = '#55aaff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(50, 250);
        ctx.lineTo(150, 250);
        ctx.stroke();
    }
    
    // Draw double slit
    ctx.fillStyle = '#333';
    ctx.fillRect(150, 150, 5, 70);
    ctx.fillRect(150, 240, 5, 20);
    ctx.fillRect(150, 280, 5, 70);
    
    // Draw choice apparatus
    const choiceType = experimentState.choiceType || '';
    ctx.fillStyle = experimentState.choiceMade ? '#ffff55' : '#555';
    ctx.beginPath();
    ctx.arc(300, 250, 25, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw choice symbol
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    if (experimentState.choiceMade) {
        if (choiceType === 'path') {
            ctx.fillText('P', 294, 257);
        } else {
            ctx.fillText('I', 296, 257);
        }
    } else {
        ctx.fillText('?', 294, 257);
    }
    
    // Draw delayed choice timeline
    if (delayedMode) {
        ctx.strokeStyle = '#aaa';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(50, 350);
        ctx.lineTo(450, 350);
        ctx.stroke();
        
        // Arrow
        ctx.fillStyle = '#aaa';
        ctx.beginPath();
        ctx.moveTo(450, 350);
        ctx.lineTo(445, 345);
        ctx.lineTo(445, 355);
        ctx.fill();
        
        // Time points
        ctx.fillStyle = '#55aaff';
        ctx.beginPath();
        ctx.arc(150, 350, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText('Photon passes slit', 120, 370);
        
        ctx.fillStyle = '#ffff55';
        ctx.beginPath();
        ctx.arc(300 + delayTime, 350, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText('Measurement choice', 280 + delayTime, 370);
    }
    
    // Draw detector screen
    ctx.fillStyle = '#555';
    ctx.fillRect(450, 150, 10, 200);
    
    // Draw particles
    ctx.fillStyle = '#55aaff';
    experimentState.particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Draw detection pattern
    const maxIntensity = Math.max(1, ...experimentState.pattern);
    
    for (let i = 0; i < experimentState.pattern.length; i++) {
        const intensity = experimentState.pattern[i] / maxIntensity;
        const y = (i / experimentState.pattern.length) * 200 + 150;
        ctx.fillStyle = `rgba(85, 170, 255, ${intensity})`;
        ctx.fillRect(460, y, 30, 2);
    }
    
    // Draw pattern type label
    ctx.fillStyle = '#fff';
    ctx.font = '18px Arial';
    if (choiceType === 'interference') {
        ctx.fillText('Wave pattern (interference)', 370, 140);
    } else if (choiceType === 'path') {
        ctx.fillText('Particle pattern (no interference)', 350, 140);
    }
    
    // Draw info text
    let infoText = `Delayed Choice | ${delayedMode ? 'Delayed' : 'Immediate'} measurement | `;
    infoText += experimentState.choiceMade ? 
        `Choice: ${choiceType === 'path' ? 'Path (particle)' : 'Interference (wave)'}` : 
        'No choice made yet';
    
    simulationInfo.textContent = infoText;
}

// Draw Mach-Zehnder experiment
function drawMachZehnder() {
    const sourceOn = experimentState.sourceToggle !== false;
    const phaseDiff = experimentState.phaseDiff || 0;
    const singleMode = experimentState.singleToggle === true;
    
    // Draw light source
    ctx.fillStyle = sourceOn ? '#55aaff' : '#555';
    ctx.fillRect(10, 235, 40, 30);
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.fillText(singleMode ? 'Single Photon' : 'Light Source', 0, 280);
    
    // Draw initial beam
    if (sourceOn) {
        ctx.strokeStyle = '#55aaff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(50, 250);
        ctx.lineTo(125, 250);
        ctx.stroke();
    }
    
    // Draw first beam splitter
    ctx.save();
    ctx.translate(150, 250);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = 'rgba(170, 170, 170, 0.7)';
    ctx.fillRect(-20, -20, 40, 40);
    ctx.restore();
    
    // Draw upper path
    ctx.strokeStyle = '#55aaff';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(163, 237);
    ctx.lineTo(300, 100);
    ctx.stroke();
    
    // Draw lower path
    ctx.beginPath();
    ctx.moveTo(163, 263);
    ctx.lineTo(300, 400);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw mirrors
    ctx.save();
    ctx.translate(300, 100);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = 'rgba(170, 170, 170, 0.7)';
    ctx.fillRect(-20, -20, 40, 40);
    ctx.restore();
    
    ctx.save();
    ctx.translate(300, 400);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = 'rgba(170, 170, 170, 0.7)';
    ctx.fillRect(-20, -20, 40, 40);
    ctx.restore();
    
    // Draw reflected beams
    ctx.strokeStyle = '#55aaff';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(313, 113);
    ctx.lineTo(437, 237);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(313, 387);
    ctx.lineTo(437, 263);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw phase shifter on upper path
    if (phaseDiff > 0) {
        ctx.fillStyle = 'rgba(255, 255, 80, 0.3)';
        ctx.fillRect(230, 85, 30, 30);
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.fillText(`φ = ${phaseDiff}°`, 220, 80);
    }
    
    // Draw second beam splitter
    ctx.save();
    ctx.translate(450, 250);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = 'rgba(170, 170, 170, 0.7)';
    ctx.fillRect(-20, -20, 40, 40);
    ctx.restore();
    
    // Draw output beams
    ctx.strokeStyle = '#55aaff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(463, 237);
    ctx.lineTo(550, 150);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(463, 263);
    ctx.lineTo(550, 350);
    ctx.stroke();
    
    // Draw detectors
    ctx.fillStyle = '#aaa';
    ctx.fillRect(550, 130, 30, 40);
    ctx.fillRect(550, 330, 30, 40);
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.fillText('D1', 560, 155);
    ctx.fillText('D2', 560, 355);
    
    // Draw detection counts
    const detector1 = experimentState.detections?.detector1 || 0;
    const detector2 = experimentState.detections?.detector2 || 0;
    const total = detector1 + detector2;
    
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    
    if (total > 0) {
        const prob1 = Math.round((detector1 / total) * 100);
        const prob2 = 100 - prob1;
        ctx.fillText(`${prob1}%`, 550, 115);
        ctx.fillText(`${prob2}%`, 550, 315);
    }
    
    // Draw particles
    experimentState.particles?.forEach(particle => {
        ctx.fillStyle = singleMode ? '#ffff55' : '#55aaff';
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, singleMode ? 5 : 3, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Draw interference explanation
    ctx.fillStyle = '#fff';
    ctx.font = '18px Arial';
    ctx.fillText(`Interference depends on phase difference (${phaseDiff}°)`, 100, 40);
    
    // Draw explanation of interference pattern based on phase
    const phaseRadians = phaseDiff * Math.PI / 180;
    const probability1 = Math.pow(Math.cos(phaseRadians / 2), 2);
    const probability2 = Math.pow(Math.sin(phaseRadians / 2), 2);
    
    ctx.fillStyle = '#55aaff';
    ctx.font = '16px Arial';
    ctx.fillText(`Quantum theory predicts: D1: ${Math.round(probability1 * 100)}%, D2: ${Math.round(probability2 * 100)}%`, 100, 65);
    
    // Draw info text
    const totalCount = detector1 + detector2;
    let infoText = `Mach-Zehnder Interferometer | Phase: ${phaseDiff}° | `;
    infoText += singleMode ? 'Single photon mode | ' : 'Wave mode | ';
    infoText += `Detections: D1: ${detector1}, D2: ${detector2}`;
    
    simulationInfo.textContent = infoText;
}

// Draw Quantum Tunneling experiment
function drawQuantumTunneling() {
    const particlesOn = experimentState.particleToggle !== false;
    const barrierHeight = experimentState.barrierHeight || 100;
    const barrierWidth = experimentState.barrierWidth || 30;
    const particleEnergy = experimentState.particleEnergy || 50;
    
    // Draw energy levels
    ctx.strokeStyle = '#aaa';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(50, 250);
    ctx.lineTo(550, 250);
    ctx.stroke();
    
    // Draw particle energy level
    ctx.strokeStyle = '#55ff55';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(50, 250 - particleEnergy);
    ctx.lineTo(550, 250 - particleEnergy);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw energy labels
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.fillText('E = 0', 20, 255);
    ctx.fillStyle = '#55ff55';
    ctx.fillText(`E = ${particleEnergy}`, 20, 255 - particleEnergy);
    
    // Draw potential barrier
    const barrierX = 300 - barrierWidth / 2;
    ctx.fillStyle = `rgba(255, 80, 80, ${barrierHeight / 200})`;
    ctx.fillRect(barrierX, 250 - barrierHeight, barrierWidth, barrierHeight);
    
    // Barrier height label
    ctx.fillStyle = '#ff5555';
    ctx.font = '14px Arial';
    ctx.fillText(`Barrier height = ${barrierHeight}`, barrierX - 20, 250 - barrierHeight - 10);
    
    // Draw particle source
    ctx.fillStyle = particlesOn ? '#55aaff' : '#555';
    ctx.fillRect(10, 230, 30, 40);
    
    // Draw detector
    ctx.fillStyle = '#aaa';
    ctx.fillRect(560, 230, 30, 40);
    
    // Draw particles
    experimentState.particles?.forEach(particle => {
        // Calculate y position based on energy
        const y = 250 - particle.energy / 2 + (Math.random() * 4 - 2); // Small random y-variation
        
        ctx.fillStyle = particle.tunneled ? '#55ff55' : '#55aaff';
        ctx.beginPath();
        ctx.arc(particle.x, y, 5, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Draw wave functions
    ctx.strokeStyle = '#55aaff';
    ctx.lineWidth = 2;
    
    // Incident wave
    ctx.beginPath();
    for (let x = 50; x < barrierX; x += 5) {
        const y = 250 - 20 * Math.sin((x - 50) / 15) * Math.exp(-(x - 150) * (x - 150) / 10000);
        if (x === 50) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
    
    // Tunneling wave (decaying exponential in barrier)
    ctx.strokeStyle = 'rgba(85, 170, 255, 0.5)';
    ctx.beginPath();
    for (let x = barrierX; x < barrierX + barrierWidth; x += 2) {
        const amplitude = 10 * Math.exp(-(x - barrierX) * Math.sqrt(2 * (barrierHeight - particleEnergy)) / 15);
        const y = 250 - amplitude * Math.sin((x - 50) / 15);
        if (x === barrierX) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
    
    // Transmitted wave (reduced amplitude)
    const tunnelProb = Math.exp(-2 * barrierWidth * Math.sqrt(2 * (barrierHeight - particleEnergy < 0 ? 0 : barrierHeight - particleEnergy)) / 25);
    const transmittedAmplitude = Math.sqrt(tunnelProb) * 15;
    
    ctx.strokeStyle = '#55aaff';
    ctx.beginPath();
    for (let x = barrierX + barrierWidth; x < 550; x += 5) {
        const y = 250 - transmittedAmplitude * Math.sin((x - 50) / 15) * Math.exp(-(x - 450) * (x - 450) / 10000);
        if (x === barrierX + barrierWidth) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
    
    // Draw tunneling probability
    ctx.fillStyle = '#fff';
    ctx.font = '18px Arial';
    ctx.fillText(`Tunneling Probability: ${(tunnelProb * 100).toFixed(6)}%`, 100, 350);
    
    // Draw statistics
    const total = experimentState.stats.total || 0;
    const tunneled = experimentState.stats.tunneled || 0;
    const actualProb = total > 0 ? (tunneled / total * 100).toFixed(2) : '0.00';
    
    ctx.fillStyle = '#55ff55';
    ctx.font = '16px Arial';
    ctx.fillText(`Particles: ${total} | Tunneled: ${tunneled} (${actualProb}%)`, 100, 380);
    
    // Draw info text
    let infoText = `Quantum Tunneling | Barrier: ${barrierHeight} units, ${barrierWidth} wide | `;
    infoText += `Particle Energy: ${particleEnergy} units`;
    
    simulationInfo.textContent = infoText;
}

// Draw Aharonov-Bohm experiment
function drawAharonovBohm() {
    const electronBeam = experimentState.electronToggle !== false;
    const solenoidOn = experimentState.solenoidToggle !== false;
    const magneticFlux = experimentState.magneticFlux || 50;
    
    // Draw electron source
    ctx.fillStyle = electronBeam ? '#55aaff' : '#555';
    ctx.fillRect(10, 235, 40, 30);
    
    // Draw solenoid (magnetic field container)
    const solenoidGradient = ctx.createRadialGradient(300, 250, 0, 300, 250, 50);
    solenoidGradient.addColorStop(0, solenoidOn ? 'rgba(255, 80, 80, 0.8)' : 'rgba(80, 80, 80, 0.5)');
    solenoidGradient.addColorStop(1, 'rgba(255, 80, 80, 0)');
    
    ctx.fillStyle = solenoidGradient;
    ctx.beginPath();
    ctx.arc(300, 250, 50, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw magnetic field symbol
    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.fillText('B', 293, 258);
    
    if (solenoidOn) {
        // Draw magnetic field lines (confined inside solenoid)
        ctx.strokeStyle = 'rgba(255, 80, 80, 0.3)';
        ctx.lineWidth = 1;
        for (let r = 10; r < 40; r += 10) {
            ctx.beginPath();
            ctx.arc(300, 250, r, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Draw magnetic flux value
        ctx.fillStyle = '#ff5555';
        ctx.font = '16px Arial';
        ctx.fillText(`Φ = ${magneticFlux} units`, 270, 200);
    }
    
    // Draw electron path - upper
    ctx.strokeStyle = '#55aaff';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(50, 250);
    ctx.quadraticCurveTo(175, 150, 300, 150);
    ctx.quadraticCurveTo(425, 150, 550, 250);
    ctx.stroke();
    
    // Draw electron path - lower
    ctx.beginPath();
    ctx.moveTo(50, 250);
    ctx.quadraticCurveTo(175, 350, 300, 350);
    ctx.quadraticCurveTo(425, 350, 550, 250);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw detector screen
    ctx.fillStyle = '#555';
    ctx.fillRect(550, 150, 10, 200);
    
    // Draw electrons
    experimentState.electrons?.forEach(electron => {
        if (electron.path === 'upper') {
            const t = electron.progress;
            const x = 50 + (550 - 50) * t;
            const y = 250 + (150 - 250) * Math.sin(t * Math.PI);
            
            ctx.fillStyle = '#55aaff';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        } else {
            const t = electron.progress;
            const x = 50 + (550 - 50) * t;
            const y = 250 + (350 - 250) * Math.sin(t * Math.PI);
            
            ctx.fillStyle = '#55aaff';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    });
    
    // Draw detection pattern
    const maxIntensity = Math.max(1, ...experimentState.pattern);
    
    for (let i = 0; i < experimentState.pattern.length; i++) {
        const intensity = experimentState.pattern[i] / maxIntensity;
        const y = (i / experimentState.pattern.length) * 200 + 150;
        ctx.fillStyle = `rgba(85, 170, 255, ${intensity})`;
        ctx.fillRect(560, y, 30, 2);
    }
    
    // Draw pattern explanation
    ctx.fillStyle = '#fff';
    ctx.font = '18px Arial';
    if (solenoidOn) {
        ctx.fillText(`Phase shift: ${(magneticFlux / 20).toFixed(1)}π`, 200, 60);
        if (magneticFlux % 40 === 0) {
            ctx.fillText("Constructive interference (no shift)", 200, 90);
        } else if (magneticFlux % 20 === 0) {
            ctx.fillText("Destructive interference (π shift)", 200, 90);
        } else {
            ctx.fillText("Mixed interference pattern", 200, 90);
        }
    } else {
        ctx.fillText("No magnetic field, standard interference", 200, 60);
    }
    
    // Draw info text
    let infoText = `Aharonov-Bohm Effect | Solenoid ${solenoidOn ? 'On' : 'Off'} | `;
    infoText += solenoidOn ? `Magnetic Flux: ${magneticFlux} units` : 'No magnetic field';
    
    simulationInfo.textContent = infoText;
}

// Draw Quantum Zeno experiment
function drawQuantumZeno() {
    const systemOn = experimentState.systemToggle !== false;
    const measureRate = experimentState.measureRate || 0;
    const autoMeasure = experimentState.autoToggle === true;
    const decayProb = experimentState.decayProbability || 0;
    
    // Draw background circle (system container)
    ctx.strokeStyle = '#55aaff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(300, 250, 150, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw measurement effect
    if (experimentState.measured) {
        ctx.strokeStyle = '#ffff55';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(300, 250, 160, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw measurement flash
        const measurementGradient = ctx.createRadialGradient(300, 250, 0, 300, 250, 150);
        measurementGradient.addColorStop(0, 'rgba(255, 255, 85, 0.3)');
        measurementGradient.addColorStop(1, 'rgba(255, 255, 85, 0)');
        
        ctx.fillStyle = measurementGradient;
        ctx.beginPath();
        ctx.arc(300, 250, 150, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Draw stable state
    const stableRadius = 100 * (1 - decayProb);
    const stableGradient = ctx.createRadialGradient(300, 250, 0, 300, 250, stableRadius);
    stableGradient.addColorStop(0, 'rgba(85, 170, 255, 0.5)');
    stableGradient.addColorStop(1, 'rgba(85, 170, 255, 0)');
    
    ctx.fillStyle = stableGradient;
    ctx.beginPath();
    ctx.arc(300, 250, stableRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw decay state
    const decayRadius = 100 * decayProb;
    const decayGradient = ctx.createRadialGradient(300, 250, 0, 300, 250, decayRadius);
    decayGradient.addColorStop(0, 'rgba(255, 80, 80, 0.5)');
    decayGradient.addColorStop(1, 'rgba(255, 80, 80, 0)');
    
    ctx.fillStyle = decayGradient;
    ctx.beginPath();
    ctx.arc(300, 250, decayRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw quantum system label
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText('Quantum System', 245, 250);
    
    // Draw measurement rate indicator
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.fillText(`Measurement Rate: ${measureRate}%`, 220, 410);
    
    // Draw measurement bar
    ctx.fillStyle = '#333';
    ctx.fillRect(220, 420, 160, 20);
    
    ctx.fillStyle = '#ffff55';
    ctx.fillRect(220, 420, 160 * measureRate / 100, 20);
    
    // Draw decay probability indicator
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.fillText(`Decay Probability: ${(decayProb * 100).toFixed(2)}%`, 220, 460);
    
    // Draw decay probability bar
    ctx.fillStyle = '#333';
    ctx.fillRect(220, 470, 160, 20);
    
    ctx.fillStyle = '#ff5555';
    ctx.fillRect(220, 470, 160 * decayProb, 20);
    
    // Draw Zeno effect explanation
    ctx.fillStyle = '#fff';
    ctx.font = '18px Arial';
    if (measureRate > 0) {
        ctx.fillText("Quantum Zeno Effect: Frequent measurements inhibit decay", 100, 80);
        if (measureRate > 50) {
            ctx.fillText("System is being continuously observed", 100, 110);
        }
    } else {
        ctx.fillText("Natural decay: No measurements being made", 100, 80);
    }
    
    // Draw measurement indicators if auto-measuring
    if (autoMeasure && measureRate > 0) {
        const numIndicators = Math.min(10, Math.max(1, measureRate / 10));
        
        for (let i = 0; i < numIndicators; i++) {
            const angle = i * (2 * Math.PI / numIndicators);
            const x = 300 + 170 * Math.cos(angle);
            const y = 250 + 170 * Math.sin(angle);
            
            ctx.fillStyle = '#ffff55';
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Draw info text
    let infoText = `Quantum Zeno Effect | ${measureRate > 0 ? 'Measurement rate: ' + measureRate + '%' : 'No measurements'} | `;
    infoText += autoMeasure ? 'Auto-measurement ON' : 'Manual measurement';
    infoText += ` | Decay: ${(decayProb * 100).toFixed(2)}%`;
    
    simulationInfo.textContent = infoText;
}

// Draw Bloch Sphere visualization
function drawBlochSphere() {
    const theta = experimentState.theta || 0;
    const phi = experimentState.phi || 0;
    
    // Draw sphere
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    
    // Draw meridians (longitude lines)
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 6) {
        ctx.beginPath();
        for (let t = 0; t <= Math.PI; t += Math.PI / 30) {
            const x = 300 + 150 * Math.sin(t) * Math.cos(angle);
            const y = 250 + 150 * Math.sin(t) * Math.sin(angle);
            
            if (t === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
    }
    
    // Draw parallels (latitude lines)
    for (let angle = Math.PI / 6; angle < Math.PI; angle += Math.PI / 6) {
        ctx.beginPath();
        ctx.arc(300, 250, 150 * Math.sin(angle), 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // Draw axes
    ctx.lineWidth = 2;
    
    // Z-axis
    ctx.strokeStyle = 'rgba(80, 170, 255, 0.8)';
    ctx.beginPath();
    ctx.moveTo(300, 100);
    ctx.lineTo(300, 400);
    ctx.stroke();
    
    // X-axis
    ctx.strokeStyle = 'rgba(255, 80, 80, 0.8)';
    ctx.beginPath();
    ctx.moveTo(150, 250);
    ctx.lineTo(450, 250);
    ctx.stroke();
    
    // Y-axis
    ctx.strokeStyle = 'rgba(80, 255, 80, 0.8)';
    ctx.beginPath();
    ctx.moveTo(300, 250);
    ctx.lineTo(300 + 150 * Math.cos(Math.PI / 4), 250 - 150 * Math.sin(Math.PI / 4));
    ctx.stroke();
    
    // Axis labels
    ctx.fillStyle = 'rgba(80, 170, 255, 0.8)';
    ctx.font = '16px Arial';
    ctx.fillText('Z', 300 - 10, 100 - 10);
    ctx.fillText('|0⟩', 300 - 15, 100 + 20);
    ctx.fillText('|1⟩', 300 - 15, 400 + 10);
    
    ctx.fillStyle = 'rgba(255, 80, 80, 0.8)';
    ctx.fillText('X', 450 + 10, 250);
    
    ctx.fillStyle = 'rgba(80, 255, 80, 0.8)';
    ctx.fillText('Y', 300 + 150 * Math.cos(Math.PI / 4) + 10, 250 - 150 * Math.sin(Math.PI / 4) - 10);
    
    // Convert spherical to Cartesian coordinates
    const thetaRad = theta * Math.PI / 180;
    const phiRad = phi * Math.PI / 180;
    
    const x = 150 * Math.sin(thetaRad) * Math.cos(phiRad);
    const y = 150 * Math.sin(thetaRad) * Math.sin(phiRad);
    const z = 150 * Math.cos(thetaRad);
    
    // Draw state vector
    ctx.strokeStyle = '#ff5';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(300, 250);
    ctx.lineTo(300 + x, 250 - z);
    ctx.stroke();
    
    // Draw state point
    ctx.fillStyle = '#ff5';
    ctx.beginPath();
    ctx.arc(300 + x, 250 - z, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw projection to XY plane
    ctx.strokeStyle = 'rgba(255, 255, 80, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(300 + x, 250 - z);
    ctx.lineTo(300 + x, 250);
    ctx.stroke();
    
    // Draw qubit state
    const stateText = experimentState.measured 
        ? `|${experimentState.measureResult}⟩`
        : `|ψ⟩ = cos(${theta/2}°)|0⟩ + e^(i${phi}°)sin(${theta/2}°)|1⟩`;
    
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.fillText(stateText, 300 - 120, 450);
    
    // Draw state parameters
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.fillText(`θ = ${theta.toFixed(1)}°`, 50, 50);
    ctx.fillText(`φ = ${phi.toFixed(1)}°`, 50, 75);
    
    // Calculate probabilities
    const prob0 = Math.pow(Math.cos(theta * Math.PI / 360), 2);
    const prob1 = Math.pow(Math.sin(theta * Math.PI / 360), 2);
    
    ctx.fillText(`P(|0⟩) = ${(prob0 * 100).toFixed(1)}%`, 50, 100);
    ctx.fillText(`P(|1⟩) = ${(prob1 * 100).toFixed(1)}%`, 50, 125);
    
    // Draw gate information
    const gate = experimentState.gateSelect || 'H (Hadamard)';
    ctx.fillStyle = '#5f5';
    ctx.fillText(`Selected Gate: ${gate}`, 450, 50);
    
    // Draw measurement result
    if (experimentState.measured) {
        ctx.fillStyle = '#f55';
        ctx.fillText(`Measured: |${experimentState.measureResult}⟩`, 450, 75);
    }
    
    // Draw info text
    let infoText = `Qubit State | θ: ${theta.toFixed(1)}° | φ: ${phi.toFixed(1)}° | `;
    infoText += experimentState.measured 
        ? `Measured: |${experimentState.measureResult}⟩` 
        : `Superposition: |0⟩: ${(prob0 * 100).toFixed(1)}%, |1⟩: ${(prob1 * 100).toFixed(1)}%`;
    
    simulationInfo.textContent = infoText;
}

// Draw Shor's Algorithm
function drawShorsAlgorithm() {
    const n = experimentState.numberToFactor || 15;
    const running = experimentState.running || false;
    const step = experimentState.step || 0;
    const results = experimentState.results || null;
    const detailedMath = experimentState.detailedToggle === true;
    const vizMode = experimentState.vizMode || 'Algorithm Steps';
    
    // Draw title
    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.fillText(`Shor's Algorithm: Factoring ${n}`, 180, 50);
    
    // Different visualizations based on selected mode
    if (vizMode === 'Circuit View') {
        // Draw quantum circuit visualization
        drawQuantumCircuit(n, step);
    } else if (vizMode === 'Quantum States') {
        // Draw quantum state visualization
        drawQuantumStates(n, step);
    } else {
        // Default: Algorithm Steps view
        drawAlgorithmSteps(n, step, running, results, detailedMath);
    }
    
    // Draw info text
    let infoText = `Shor's Algorithm | Factoring: ${n} | `;
    if (results) {
        infoText += `Result: ${results.n} = ${results.factors[0]} × ${results.factors[1]}`;
    } else if (running) {
        infoText += `Running... Step ${step + 1}/5`;
    } else {
        infoText += 'Ready';
    }
    
    simulationInfo.textContent = infoText;
}

// Helper functions for Shor's Algorithm visualization
function drawQuantumCircuit(n, step) {
    // Calculate number of qubits needed (2*log2(n))
    const numQubits = Math.ceil(2 * Math.log2(n));
    
    // Draw circuit wires
    ctx.strokeStyle = '#aaa';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < numQubits; i++) {
        ctx.beginPath();
        ctx.moveTo(100, 100 + i * 30);
        ctx.lineTo(500, 100 + i * 30);
        ctx.stroke();
        
        // Qubit labels
        ctx.fillStyle = '#fff';
        ctx.font = '14px Arial';
        ctx.fillText(`q${i}:`, 70, 105 + i * 30);
    }
    
    // Draw register divider
    ctx.strokeStyle = '#55aaff';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(50, 100 + numQubits/2 * 30);
    ctx.lineTo(550, 100 + numQubits/2 * 30);
    ctx.stroke();
    
    // Register labels
    ctx.fillStyle = '#55aaff';
    ctx.font = '14px Arial';
    ctx.fillText('Input Register', 50, 90);
    ctx.fillText('QFT Register', 50, 100 + numQubits/2 * 30 + 20);
    
    // Draw gates based on current step
    const inputQubits = Math.floor(numQubits/2);
    
    // Initialization: Hadamard gates
    if (step >= 0) {
        ctx.fillStyle = '#55aaff';
        for (let i = 0; i < inputQubits; i++) {
            ctx.fillRect(125, 90 + i * 30, 20, 20);
            ctx.fillStyle = '#fff';
            ctx.font = '14px Arial';
            ctx.fillText('H', 130, 105 + i * 30);
            ctx.fillStyle = '#55aaff';
        }
    }
    
    // Modular exponentiation
    if (step >= 1) {
        ctx.fillStyle = '#ff5555';
        ctx.fillRect(200, 90, 80, inputQubits * 30 + 20);
        ctx.fillStyle = '#fff';
        ctx.font = '14px Arial';
        ctx.fillText(`U_${n}`, 220, 135);
        
        // Draw control lines from input to QFT register
        ctx.strokeStyle = '#ff5555';
        ctx.lineWidth = 1;
        for (let i = 0; i < inputQubits; i++) {
            ctx.beginPath();
            ctx.moveTo(240, 100 + i * 30);
            ctx.lineTo(240, 100 + (i + inputQubits) * 30);
            ctx.stroke();
            
            // Control points
            ctx.fillStyle = '#ff5555';
            ctx.beginPath();
            ctx.arc(240, 100 + (i + inputQubits) * 30, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Quantum Fourier Transform
    if (step >= 2) {
        ctx.fillStyle = '#55ff55';
        ctx.fillRect(350, 90 + inputQubits * 30, 60, inputQubits * 30 + 20);
        ctx.fillStyle = '#fff';
        ctx.font = '14px Arial';
        ctx.fillText('QFT', 365, 135 + inputQubits * 30);
    }
    
    // Measurement
    if (step >= 3) {
        ctx.fillStyle = '#ffff55';
        for (let i = inputQubits; i < numQubits; i++) {
            ctx.beginPath();
            ctx.arc(450, 100 + i * 30, 10, 0, Math.PI * 2);
            ctx.fill();
            
            // Measurement symbol
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(445, 100 + i * 30);
            ctx.lineTo(455, 100 + i * 30);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(450, 95 + i * 30);
            ctx.lineTo(450, 105 + i * 30);
            ctx.stroke();
        }
    }
    
    // Classical processing
    if (step >= 4) {
        ctx.fillStyle = '#aaa';
        ctx.fillRect(500, 150, 40, 100);
        ctx.fillStyle = '#fff';
        ctx.font = '14px Arial';
        ctx.fillText('Classical', 490, 190);
        ctx.fillText('Processing', 490, 210);
        
        // Result output
        ctx.fillStyle = '#fff';
        ctx.font = '18px Arial';
        ctx.fillText(`${n} = ? × ?`, 490, 260);
    }
}

function drawQuantumStates(n, step) {
    // Calculate required qubits
    const numQubits = Math.ceil(2 * Math.log2(n));
    
    // Draw state evolution based on step
    ctx.fillStyle = '#fff';
    ctx.font = '18px Arial';
    
    const states = [
        "|0⟩|0⟩....|0⟩  (All qubits initialized to |0⟩)",
        "|+⟩|+⟩....|+⟩  (Superposition of input register)",
        "∑ |x⟩|f(x)⟩  (Entangled state)",
        "∑ |x⟩|QFT(f(x))⟩  (Applied QFT)",
        "Measured period r  (Collapsed quantum state)",
        "Found factors using continued fractions"
    ];
    
    // Draw state evolution timeline
    ctx.fillStyle = '#333';
    ctx.fillRect(100, 100, 400, 300);
    
    // Draw current state and previous states
    for (let i = 0; i <= Math.min(step, 5); i++) {
        if (i === step) {
            ctx.fillStyle = '#55aaff';
            ctx.fillRect(100, 100 + i * 50, 400, 50);
        }
        
        ctx.fillStyle = '#fff';
        ctx.font = '16px Arial';
        ctx.fillText(`Step ${i+1}:`, 110, 130 + i * 50);
        ctx.fillText(states[i], 170, 130 + i * 50);
    }
    
    // Draw quantum register visualization
    if (step >= 1) {
        ctx.fillStyle = '#fff';
        ctx.font = '18px Arial';
        ctx.fillText('Quantum Register Visualization:', 150, 430);
        
        // Draw qubits
        const qubitsPerRow = 8;
        const qubitSize = 30;
        const startX = 300 - (Math.min(numQubits, qubitsPerRow) * qubitSize) / 2;
        const startY = 450;
        
        for (let i = 0; i < numQubits; i++) {
            const row = Math.floor(i / qubitsPerRow);
            const col = i % qubitsPerRow;
            const x = startX + col * qubitSize;
            const y = startY + row * qubitSize;
            
            let color;
            if (step === 1) color = i < numQubits/2 ? '#55aaff' : '#333'; // Only input register in superposition
            else if (step === 2) color = '#ff5555'; // Entangled state
            else if (step === 3) color = i < numQubits/2 ? '#ff5555' : '#55ff55'; // QFT applied
            else color = i < numQubits/2 ? '#ff5555' : '#ffff55'; // Measured
            
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, 10, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#fff';
            ctx.font = '12px Arial';
            ctx.fillText(`q${i}`, x - 6, y + 4);
        }
    }
}

function drawAlgorithmSteps(n, step, running, results, detailedMath) {
    // Draw algorithm explanation based on current step
    ctx.fillStyle = '#fff';
    ctx.font = '18px Arial';
    
    const stepDescriptions = [
        `Step 1: Initialize quantum registers for factoring ${n}`,
        `Step 2: Create superposition and calculate modular exponentiation`,
        `Step 3: Apply Quantum Fourier Transform to find periodicity`,
        `Step 4: Measure the quantum state and extract the period`,
        `Step 5: Use the period to calculate the factors classically`
    ];
    
    // Draw steps
    ctx.fillStyle = '#333';
    ctx.fillRect(50, 80, 500, 340);
    
    for (let i = 0; i < 5; i++) {
        if (i === step && running) {
            // Highlight current step
            ctx.fillStyle = '#55aaff';
            ctx.fillRect(50, 80 + i * 60, 500, 60);
        }
        
        ctx.fillStyle = i <= step ? '#fff' : '#777';
        ctx.font = '16px Arial';
        ctx.fillText(stepDescriptions[i], 60, 110 + i * 60);
        
        // Show checkmark for completed steps
        if (i < step || (i === step && !running && results)) {
            ctx.fillStyle = '#55ff55';
            ctx.font = '18px Arial';
            ctx.fillText('✓', 30, 110 + i * 60);
        } else if (i === step && running) {
            ctx.fillStyle = '#ffff55';
            ctx.font = '18px Arial';
            ctx.fillText('→', 30, 110 + i * 60);
        }
    }
    
    // Show step message if running
    if (running && experimentState.stepMessage) {
        ctx.fillStyle = '#ffff55';
        ctx.font = '16px Arial';
        ctx.fillText(experimentState.stepMessage, 100, 440);
        
        // Show progress bar
        ctx.fillStyle = '#333';
        ctx.fillRect(100, 450, 400, 20);
        
        ctx.fillStyle = '#55aaff';
        ctx.fillRect(100, 450, 400 * ((step + 0.5) / 5), 20);
    }
    
    // Show results if completed
    if (results) {
        ctx.fillStyle = '#55ff55';
        ctx.font = '24px Arial';
        ctx.fillText(results.message, 100, 440);
        
        // Show explanation
        ctx.fillStyle = '#fff';
        ctx.font = '16px Arial';
        ctx.fillText("Shor's algorithm successfully found the factors using quantum", 70, 470);
        ctx.fillText("computing principles for period finding.", 70, 490);
    }
    
    // Show detailed math if enabled
    if (detailedMath && step > 0) {
        ctx.fillStyle = '#ffff55';
        ctx.font = '14px Arial';
        
        // Different math formulas for each step
        const mathFormulas = [
            "",
            "∑|x⟩|a^x mod N⟩ where a is a random coprime to N",
            "QFT|y⟩ = (1/√M)∑e^(2πiyk/M)|k⟩",
            "P(measuring |k⟩) = |∑e^(2πikj/r)|²/M²",
            "If r is even and a^(r/2)≠-1(mod N), gcd(a^(r/2)±1,N) are factors"
        ];
        
        ctx.fillText(mathFormulas[step], 70, 380);
    }
}

// Close simulation
closeSimulation.addEventListener('click', () => {
    simulationContainer.style.display = 'none';
    
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    
    currentExperiment = null;
});

// Initialize the canvas properly
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing physics experiments...');
    
    // Make sure canvas and context are properly initialized
    if (!ctx && simulationCanvas) {
        ctx = simulationCanvas.getContext('2d');
        console.log('Canvas context initialized');
    }
    
    // Generate experiment cards
    generateExperimentCards();
    
    // Initialize canvas sizing
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'style' && 
                simulationContainer.style.display !== 'none') {
                setTimeout(resizeCanvasCorrectly, 50);
            }
        });
    });
    
    observer.observe(simulationContainer, { attributes: true });
    
    // Add glow effect
    document.addEventListener('mousemove', (e) => {
        const glow = document.querySelector('.glow');
        if (glow) {
            const x = e.clientX / window.innerWidth * 100;
            const y = e.clientY / window.innerHeight * 100;
            
            glow.style.setProperty('--x', `${x}%`);
            glow.style.setProperty('--y', `${y}%`);
        }
    });
    
    // Add window resize event listener
    window.addEventListener('resize', () => {
        if (simulationContainer.style.display !== 'none') {
            resizeCanvasCorrectly();
        }
    });
    
    console.log('Quantum physics experiments initialization complete!');
});