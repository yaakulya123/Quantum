// Experiment data
const experiments = [
    {
        id: 'double-slit',
        title: 'Double-Slit Experiment',
        description: 'Demonstrates the wave-particle duality of light and matter by showing interference patterns.',
        image: 'url(/api/placeholder/300/160)',
        longDescription: `The double-slit experiment is one of the most famous experiments in quantum physics. It demonstrates the wave-particle duality of light and matter.

        When light passes through two closely spaced slits, it creates an interference pattern on a screen behind the slits. This pattern is typical of waves, but interestingly, even when individual photons are sent one by one, they still form an interference pattern over time, suggesting each photon somehow passes through both slits simultaneously.
        
        However, if you try to observe which slit the photon passes through, the interference pattern disappears, and you get two distinct bands, as if the photons are behaving like particles. This experiment illustrates a fundamental principle of quantum mechanics: observation affects the outcome of the experiment.`,
        controls: [
            {
                type: 'toggle',
                id: 'laserToggle',
                label: 'Laser On/Off',
                default: true
            },
            {
                type: 'toggle',
                id: 'detectorsToggle',
                label: 'Path Detectors',
                default: false
            },
            {
                type: 'slider',
                id: 'slitDistance',
                label: 'Slit Distance',
                min: 20,
                max: 100,
                default: 60
            },
            {
                type: 'slider',
                id: 'particleRate',
                label: 'Particle Rate',
                min: 1,
                max: 30,
                default: 5
            },
            {
                type: 'button',
                id: 'resetBtn',
                label: 'Reset Experiment'
            }
        ]
    },
    {
        id: 'stern-gerlach',
        title: 'Stern–Gerlach Experiment',
        description: 'Reveals the quantization of angular momentum by splitting particles based on their spin orientations.',
        image: 'url(/api/placeholder/300/160)',
        longDescription: `The Stern-Gerlach experiment, conducted in 1922, was a seminal moment in quantum physics that demonstrated the quantization of angular momentum.

        In this experiment, a beam of silver atoms is passed through a non-uniform magnetic field. Classical physics would predict that the atoms, if they're like tiny magnets with randomly oriented magnetic moments, would be deflected in a continuous distribution.
        
        Instead, the beam splits into discrete components, showing that the angular momentum (spin) of the atoms is quantized - it can only take certain discrete values, not a continuous range. This experiment provided direct evidence for spin quantization, a fundamental concept in quantum mechanics.`,
        controls: [
            {
                type: 'toggle',
                id: 'beamToggle',
                label: 'Atom Beam On/Off',
                default: true
            },
            {
                type: 'slider',
                id: 'magnetStrength',
                label: 'Magnet Strength',
                min: 10,
                max: 100,
                default: 50
            },
            {
                type: 'dropdown',
                id: 'magnetOrientation',
                label: 'Magnet Orientation',
                options: ['X-axis', 'Y-axis', 'Z-axis'],
                default: 'Z-axis'
            },
            {
                type: 'button',
                id: 'resetBtn',
                label: 'Reset Experiment'
            }
        ]
    },
    {
        id: 'bell-inequality',
        title: 'Bell\'s Inequality Experiment',
        description: 'Tests the predictions of quantum mechanics regarding entangled particles and local realism.',
        image: 'url(/api/placeholder/300/160)',
        longDescription: `Bell's Inequality experiments test the fundamental nature of quantum entanglement and challenge our understanding of reality itself.

        When two particles are entangled, measuring one instantly affects the state of the other, regardless of the distance between them. This seems to violate locality - the principle that objects are only influenced by their immediate surroundings.
        
        Bell's Inequality provides a mathematical framework to test whether quantum mechanics is compatible with "local realism" - the idea that physical properties exist independently of observation and no influence can travel faster than light.
        
        Experiments have consistently violated Bell's Inequality, suggesting that either locality or realism (or both) must be abandoned. This experiment highlights the profound strangeness of quantum mechanics and entanglement.`,
        controls: [
            {
                type: 'toggle',
                id: 'entanglementToggle',
                label: 'Create Entangled Pairs',
                default: true
            },
            {
                type: 'slider',
                id: 'angleA',
                label: 'Detector A Angle',
                min: 0,
                max: 180,
                default: 0
            },
            {
                type: 'slider',
                id: 'angleB',
                label: 'Detector B Angle',
                min: 0,
                max: 180,
                default: 45
            },
            {
                type: 'button',
                id: 'measureBtn',
                label: 'Take Measurement'
            },
            {
                type: 'button',
                id: 'resetBtn',
                label: 'Reset Statistics'
            }
        ]
    },
    {
        id: 'quantum-eraser',
        title: 'Quantum Eraser Experiment',
        description: 'Shows how the act of measurement can retroactively alter interference patterns in quantum systems.',
        image: 'url(/api/placeholder/300/160)',
        longDescription: `The Quantum Eraser experiment is a mind-bending demonstration of quantum mechanics that seems to allow the future to influence the past.

        Building on the double-slit experiment, this setup uses entangled photon pairs. When "which-path" information is measured for one photon, the interference pattern of its entangled partner disappears - even if that partner has already been detected.
        
        However, if the which-path information is "erased" after the first photon is detected but before examining the data for the second photon, the interference pattern can be recovered by selecting the appropriate subset of results.
        
        This experiment highlights the profound role of information in quantum mechanics and challenges our intuitive understanding of cause and effect.`,
        controls: [
            {
                type: 'toggle',
                id: 'laserToggle',
                label: 'Laser On/Off',
                default: true
            },
            {
                type: 'toggle',
                id: 'eraseToggle',
                label: 'Erase Which-Path Info',
                default: false
            },
            {
                type: 'toggle',
                id: 'delayedToggle',
                label: 'Delayed Choice',
                default: false
            },
            {
                type: 'slider',
                id: 'particleRate',
                label: 'Particle Rate',
                min: 1,
                max: 30,
                default: 5
            },
            {
                type: 'button',
                id: 'resetBtn',
                label: 'Reset Experiment'
            }
        ]
    },
    {
        id: 'delayed-choice',
        title: 'Delayed-Choice Experiment',
        description: 'Explores whether decisions made after a particle passes through a slit can affect its previous behavior.',
        image: 'url(/api/placeholder/300/160)',
        longDescription: `The Delayed-Choice experiment, proposed by John Wheeler, pushes the boundaries of quantum mechanics by questioning when a quantum "decision" is actually made.

        In this experiment, the choice to observe which path a photon takes (causing it to behave like a particle) or to observe interference (allowing it to behave like a wave) is made after the photon has already passed the double slit.
        
        Remarkably, the photon's behavior corresponds to the type of measurement chosen, even though that choice was made after the photon should have already "decided" whether to behave as a wave or a particle.
        
        This experiment suggests that quantum events might not be fully determined until they are observed, challenging our conventional understanding of time and causality.`,
        controls: [
            {
                type: 'toggle',
                id: 'sourceToggle',
                label: 'Photon Source On/Off',
                default: true
            },
            {
                type: 'toggle',
                id: 'delayedToggle',
                label: 'Delayed Choice Mode',
                default: true
            },
            {
                type: 'slider',
                id: 'delayTime',
                label: 'Decision Delay (ns)',
                min: 0,
                max: 100,
                default: 50
            },
            {
                type: 'button',
                id: 'pathBtn',
                label: 'Choose Path Measurement'
            },
            {
                type: 'button',
                id: 'interferenceBtn',
                label: 'Choose Interference'
            },
            {
                type: 'button',
                id: 'resetBtn',
                label: 'Reset Experiment'
            }
        ]
    },
    {
        id: 'mach-zehnder',
        title: 'Mach–Zehnder Interferometer',
        description: 'Uses beam splitters and mirrors to demonstrate interference effects and quantum superposition.',
        image: 'url(/api/placeholder/300/160)',
        longDescription: `The Mach-Zehnder interferometer is an elegant optical setup that demonstrates quantum interference phenomena with remarkable clarity.

        The experiment consists of two beam splitters and two mirrors arranged in a configuration where light entering the system is split, follows two different paths, and then recombines. The resulting interference pattern depends on the relative phase difference between the two paths.
        
        At the quantum level, even single photons seem to travel both paths simultaneously and interfere with themselves when the paths recombine. By manipulating the path lengths or introducing phase shifts, we can control the interference pattern.
        
        This setup provides a clear demonstration of quantum superposition and wave-particle duality, and has practical applications in quantum computation and quantum cryptography.`,
        controls: [
            {
                type: 'toggle',
                id: 'sourceToggle',
                label: 'Photon Source On/Off',
                default: true
            },
            {
                type: 'slider',
                id: 'phaseDiff',
                label: 'Phase Difference',
                min: 0,
                max: 360,
                default: 0
            },
            {
                type: 'toggle',
                id: 'singleToggle',
                label: 'Single Photon Mode',
                default: false
            },
            {
                type: 'slider',
                id: 'splitterRatio',
                label: 'Beam Splitter Ratio',
                min: 0,
                max: 100,
                default: 50
            },
            {
                type: 'button',
                id: 'resetBtn',
                label: 'Reset Experiment'
            }
        ]
    },
    {
        id: 'quantum-tunneling',
        title: 'Quantum Tunneling Demonstration',
        description: 'Illustrates how particles can pass through energy barriers they classically shouldn\'t overcome.',
        image: 'url(/api/placeholder/300/160)',
        longDescription: `Quantum tunneling is a fascinating phenomenon where particles can pass through energy barriers that would be impossible to overcome according to classical physics.

        In the quantum world, particles don't have a definite position but are described by a probability wave. When this wave encounters a barrier, part of it can penetrate through, giving the particle a non-zero probability of being found on the other side - effectively "tunneling" through solid matter.
        
        This effect is not just a theoretical curiosity; it's essential for nuclear fusion in stars, radioactive decay, and modern electronics like tunnel diodes and scanning tunneling microscopes.
        
        The probability of tunneling depends on the barrier's height and width, and the particle's energy - factors you can adjust in this simulation to see how they affect the tunneling process.`,
        controls: [
            {
                type: 'toggle',
                id: 'particleToggle',
                label: 'Particle Generation',
                default: true
            },
            {
                type: 'slider',
                id: 'barrierHeight',
                label: 'Barrier Height',
                min: 10,
                max: 200,
                default: 100
            },
            {
                type: 'slider',
                id: 'barrierWidth',
                label: 'Barrier Width',
                min: 5,
                max: 100,
                default: 30
            },
            {
                type: 'slider',
                id: 'particleEnergy',
                label: 'Particle Energy',
                min: 10,
                max: 150,
                default: 50
            },
            {
                type: 'button',
                id: 'resetBtn',
                label: 'Reset Statistics'
            }
        ]
    },
    {
        id: 'aharonov-bohm',
        title: 'Aharonov–Bohm Effect',
        description: 'Reveals that charged particles are affected by electromagnetic potentials, even in regions with zero magnetic field.',
        image: 'url(/api/placeholder/300/160)',
        longDescription: `The Aharonov-Bohm effect is a quantum mechanical phenomenon that demonstrates the physical significance of electromagnetic potentials beyond the classical electromagnetic fields.

        In this experiment, charged particles passing around a long solenoid (which contains a confined magnetic field) show interference patterns that shift depending on the magnetic flux inside the solenoid - even though the particles travel only through regions where the magnetic field is zero.
        
        This remarkable effect shows that in quantum mechanics, electromagnetic potentials (not just the fields) can have physical effects on charged particles, even in regions where the field strength is zero.
        
        The effect has profound implications for our understanding of electromagnetism in quantum theory and has led to the development of important concepts like geometric phases in quantum mechanics.`,
        controls: [
            {
                type: 'toggle',
                id: 'electronToggle',
                label: 'Electron Beam On/Off',
                default: true
            },
            {
                type: 'toggle',
                id: 'solenoidToggle',
                label: 'Solenoid Magnet On/Off',
                default: true
            },
            {
                type: 'slider',
                id: 'magneticFlux',
                label: 'Magnetic Flux',
                min: 0,
                max: 100,
                default: 50
            },
            {
                type: 'slider',
                id: 'electronRate',
                label: 'Electron Rate',
                min: 1,
                max: 30,
                default: 10
            },
            {
                type: 'button',
                id: 'resetBtn',
                label: 'Reset Pattern'
            }
        ]
    },
    {
        id: 'quantum-zeno',
        title: 'Quantum Zeno Effect',
        description: 'Demonstrates how frequent measurements can prevent the evolution of a quantum system.',
        image: 'url(/api/placeholder/300/160)',
        longDescription: `The Quantum Zeno Effect, named after Zeno's paradox, demonstrates the strange influence of measurement in quantum mechanics.

        In quantum mechanics, systems evolve according to the Schrödinger equation when not observed. However, when measurements are performed, the system "collapses" to a definite state.
        
        If measurements are performed frequently enough, this repeated collapse can actually prevent the system from evolving naturally - essentially "freezing" it in its initial state. This is analogous to the proverbial watched pot that never boils.
        
        This effect has been experimentally verified and has practical applications in preventing decoherence in quantum computing and in certain quantum control techniques. It's a vivid demonstration of the fundamental role that measurement plays in quantum physics.`,
        controls: [
            {
                type: 'toggle',
                id: 'systemToggle',
                label: 'Quantum System On/Off',
                default: true
            },
            {
                type: 'slider',
                id: 'measureRate',
                label: 'Measurement Rate',
                min: 0,
                max: 100,
                default: 0
            },
            {
                type: 'toggle',
                id: 'autoToggle',
                label: 'Auto Measurement',
                default: false
            },
            {
                type: 'button',
                id: 'measureBtn',
                label: 'Take Measurement'
            },
            {
                type: 'button',
                id: 'resetBtn',
                label: 'Reset System'
            }
        ]
    },
    {
        id: 'quantum-teleportation',
        title: 'Quantum Teleportation Experiment',
        description: 'Transfers quantum state information from one location to another without moving the physical particle.',
        image: 'url(/api/placeholder/300/160)',
        longDescription: `Quantum teleportation is a process that transfers the quantum state of a particle to another particle at a distance, without physically moving the original particle.

        Despite its name, quantum teleportation doesn't transport matter or energy. Instead, it transmits the quantum information that describes a particle's state. This requires three ingredients: quantum entanglement between two particles, a classical communication channel, and a third particle whose state we want to teleport.
        
        The process involves performing a special joint measurement on the particle to be teleported and one of the entangled particles. The result of this measurement is then sent via classical communication to the location of the other entangled particle, where a specific operation is performed to complete the teleportation.
        
        This protocol is fundamental to quantum communication networks and quantum computing, and has been experimentally demonstrated with photons, atoms, and other quantum systems.`,
        controls: [
            {
                type: 'button',
                id: 'entangleBtn',
                label: 'Create Entangled Pair'
            },
            {
                type: 'slider',
                id: 'stateTheta',
                label: 'Input State θ',
                min: 0,
                max: 180,
                default: 45
            },
            {
                type: 'slider',
                id: 'statePhi',
                label: 'Input State φ',
                min: 0,
                max: 360,
                default: 0
            },
            {
                type: 'button',
                id: 'bellBtn',
                label: 'Perform Bell Measurement'
            },
            {
                type: 'button',
                id: 'correctBtn',
                label: 'Apply Correction'
            },
            {
                type: 'button',
                id: 'verifyBtn',
                label: 'Verify Teleportation'
            },
            {
                type: 'button',
                id: 'resetBtn',
                label: 'Reset Experiment'
            }
        ]
    },
    {
        id: 'bloch-sphere',
        title: 'Quantum Circuit & Bloch Sphere',
        description: 'Interactive simulation of qubit manipulations using quantum gates, illustrated on a Bloch sphere.',
        image: 'url(/api/placeholder/300/160)',
        longDescription: `The Bloch sphere is a geometric representation of a qubit - the fundamental unit of quantum information - that helps visualize quantum states and operations.

        Unlike classical bits that can only be 0 or 1, qubits can exist in a superposition of states, represented as points on the surface of the Bloch sphere. The north and south poles represent the classical states |0⟩ and |1⟩, while points on the equator represent equal superpositions.
        
        Quantum gates, the building blocks of quantum circuits, transform qubits by rotating the state vector on the Bloch sphere. For example, the X gate flips a qubit from |0⟩ to |1⟩ (and vice versa), corresponding to a 180° rotation around the X-axis.
        
        This visualization helps provide intuition for the abstract mathematics of quantum computation and illustrates how quantum information differs fundamentally from classical information.`,
        controls: [
            {
                type: 'dropdown',
                id: 'gateSelect',
                label: 'Apply Quantum Gate',
                options: ['X (NOT)', 'Y', 'Z', 'H (Hadamard)', 'S', 'T', 'Rx', 'Ry', 'Rz'],
                default: 'H (Hadamard)'
            },
            {
                type: 'slider',
                id: 'rotationAngle',
                label: 'Rotation Angle (degrees)',
                min: 0,
                max: 360,
                default: 90
            },
            {
                type: 'button',
                id: 'applyBtn',
                label: 'Apply Gate'
            },
            {
                type: 'toggle',
                id: 'animateToggle',
                label: 'Animate Rotations',
                default: true
            },
            {
                type: 'button',
                id: 'measureBtn',
                label: 'Measure Qubit'
            },
            {
                type: 'button',
                id: 'resetBtn',
                label: 'Reset to |0⟩'
            }
        ]
    },
    {
        id: 'shors-algorithm',
        title: 'Shor\'s Algorithm Demonstration',
        description: 'Simulates the quantum algorithm for factoring large numbers, showcasing quantum computational power.',
        image: 'url(/api/placeholder/300/160)',
        longDescription: `Shor's algorithm, developed by mathematician Peter Shor in 1994, is one of the most important quantum algorithms because it can efficiently factor large numbers - a task believed to be computationally difficult for classical computers.

        The security of widely used RSA encryption depends on the difficulty of factoring large numbers. A quantum computer running Shor's algorithm could potentially break this encryption, which has significant implications for data security.
        
        The algorithm works by reducing the factoring problem to finding the period of a function, which quantum computers can do efficiently using quantum Fourier transform. This demonstrates the potential of quantum computers to solve certain problems exponentially faster than classical computers.
        
        This simulation demonstrates the key steps of Shor's algorithm, including the quantum period-finding subroutine, and shows how increasing the number size affects the computation's complexity.`,
        controls: [
            {
                type: 'number',
                id: 'numberToFactor',
                label: 'Number to Factor',
                min: 4,
                max: 100,
                default: 15
            },
            {
                type: 'dropdown',
                id: 'vizMode',
                label: 'Visualization Mode',
                options: ['Circuit View', 'Quantum States', 'Algorithm Steps'],
                default: 'Algorithm Steps'
            },
            {
                type: 'button',
                id: 'stepBtn',
                label: 'Step Forward'
            },
            {
                type: 'button',
                id: 'runBtn',
                label: 'Run Full Algorithm'
            },
            {
                type: 'toggle',
                id: 'detailedToggle',
                label: 'Show Detailed Math',
                default: false
            },
            {
                type: 'button',
                id: 'resetBtn',
                label: 'Reset Algorithm'
            }
        ]
    }
];