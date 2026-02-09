export default function defineQuantumBlocks(ScratchBlocks) {
    if (!ScratchBlocks || !ScratchBlocks.Blocks) return;

    const QUANTUM_COLOR = '#5C068C';

    // Opciones del menú desplegable (Hardcoded para evitar errores de traducción)
    const VARIABLE_OPTIONS = [
        ['position', '_position_'],
        ['size', '_size_'],
        ['direction', '_direction_'],
        ['color', '_color_'],
        ['costume', '_costume_']
    ];

    // --- HATS ---

    ScratchBlocks.Blocks['quantum_whenSuperpositionStart'] = {
        init: function () {
            this.jsonInit({
                "message0": "when superposition started",
                "category": "Quantum",
                "colour": QUANTUM_COLOR,
                "extensions": ["shape_hat"]
            });
        }
    };

    ScratchBlocks.Blocks['quantum_whenEntanglementStart'] = {
        init: function () {
            this.jsonInit({
                "message0": "when entanglement started",
                "category": "Quantum",
                "colour": QUANTUM_COLOR,
                "extensions": ["shape_hat"]
            });
        }
    };

    ScratchBlocks.Blocks['quantum_whenMeasured'] = {
        init: function () {
            this.jsonInit({
                "message0": "when measured",
                "category": "Quantum",
                "colour": QUANTUM_COLOR,
                "extensions": ["shape_hat"]
            });
        }
    };

    // --- BLOCKS ---

    // quantum_superposition_no_list
    ScratchBlocks.Blocks['quantum_superposition_no_list'] = {
        init: function () {
            this.jsonInit({
                "message0": "superpose variable: %1 possibilities: %2",
                "args0": [
                    {
                        "type": "field_dropdown",
                        "name": "VARIABLES",
                        "options": VARIABLE_OPTIONS
                    },
                    {
                        "type": "input_value",
                        "name": "N_CLONES"
                    }
                ],
                "category": "Quantum",
                "colour": QUANTUM_COLOR,
                "extensions": ["shape_statement"]
            });
        }
    };

    // quantum_superposition_only_list
    ScratchBlocks.Blocks['quantum_superposition_only_list'] = {
        init: function () {
            this.jsonInit({
                "message0": "superpose variable: %1 list: %2",
                "args0": [
                    {
                        "type": "field_dropdown",
                        "name": "VARIABLES",
                        "options": VARIABLE_OPTIONS
                    },
                    {
                        "type": "input_value",
                        "name": "LISTA"
                    }
                ],
                "category": "Quantum",
                "colour": QUANTUM_COLOR,
                "extensions": ["shape_statement"]
            });
        }
    };

    // quantum_superpositions
    ScratchBlocks.Blocks['quantum_superpositions'] = {
        init: function () {
            this.jsonInit({
                "message0": "superpositions variable: %1 possibilities: %2 list: %3",
                "args0": [
                    {
                        "type": "field_dropdown",
                        "name": "VARIABLES",
                        "options": VARIABLE_OPTIONS
                    },
                    {
                        "type": "input_value",
                        "name": "N_CLONES"
                    },
                    {
                        "type": "input_value",
                        "name": "LISTA"
                    }
                ],
                "category": "Quantum",
                "colour": QUANTUM_COLOR,
                "extensions": ["shape_statement"]
            });
        }
    };

    // quantum_entanglement_no_list
    ScratchBlocks.Blocks['quantum_entanglement_no_list'] = {
        init: function () {
            this.jsonInit({
                "message0": "entangle variable: %1 target: %2 possibilities: %3",
                "args0": [
                    {
                        "type": "field_dropdown",
                        "name": "VARIABLES",
                        "options": VARIABLE_OPTIONS
                    },
                    {
                        "type": "input_value",
                        "name": "TARGET"
                    },
                    {
                        "type": "input_value",
                        "name": "N_CLONES"
                    }
                ],
                "category": "Quantum",
                "colour": QUANTUM_COLOR,
                "extensions": ["shape_statement"]
            });
        }
    };

    // quantum_entanglement_only_list
    ScratchBlocks.Blocks['quantum_entanglement_only_list'] = {
        init: function () {
            this.jsonInit({
                "message0": "entangle variable: %1 target: %2 list: %3",
                "args0": [
                    {
                        "type": "field_dropdown",
                        "name": "VARIABLES",
                        "options": VARIABLE_OPTIONS
                    },
                    {
                        "type": "input_value",
                        "name": "TARGET"
                    },
                    {
                        "type": "input_value",
                        "name": "LISTA1"
                    }
                ],
                "category": "Quantum",
                "colour": QUANTUM_COLOR,
                "extensions": ["shape_statement"]
            });
        }
    };

    // quantum_entanglement
    ScratchBlocks.Blocks['quantum_entanglement'] = {
        init: function () {
            this.jsonInit({
                "message0": "entangle variable: %1 target: %2 possibilities: %3 list: %4",
                "args0": [
                    {
                        "type": "field_dropdown",
                        "name": "VARIABLES",
                        "options": VARIABLE_OPTIONS
                    },
                    {
                        "type": "input_value",
                        "name": "TARGET"
                    },
                    {
                        "type": "input_value",
                        "name": "LISTA1"
                    },
                    {
                        "type": "input_value",
                        "name": "LISTA2"
                    }
                ],
                "category": "Quantum",
                "colour": QUANTUM_COLOR,
                "extensions": ["shape_statement"]
            });
        }
    };

    // quantum_measure
    ScratchBlocks.Blocks['quantum_measure'] = {
        init: function () {
            this.jsonInit({
                "message0": "measure",
                "category": "Quantum",
                "colour": QUANTUM_COLOR,
                "extensions": ["shape_statement"]
            });
        }
    };

    console.log("BLOQUES QUANTUM INYECTADOS VISUALMENTE (CON DROPDOWNS)");
}