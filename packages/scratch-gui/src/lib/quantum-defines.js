// packages/scratch-gui/src/lib/quantum-defines.js

export default function defineQuantumBlocks(ScratchBlocks) {
    if (!ScratchBlocks || !ScratchBlocks.Blocks) return;

    const QUANTUM_COLOR = '#5C068C';

    // Definición visual del bloque "whenSuperpositionStart"
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

    // Definición visual del bloque "superposition_no_list"
    ScratchBlocks.Blocks['quantum_superposition_no_list'] = {
        init: function () {
            this.jsonInit({
                "message0": "superpose variable: %1 possibilities: %2",
                "args0": [
                    { "type": "input_value", "name": "VARIABLE" },
                    { "type": "input_value", "name": "N_CLONES" }
                ],
                "category": "Quantum",
                "colour": QUANTUM_COLOR,
                "extensions": ["shape_statement"]
            });
        }
    };

    // Definición visual del bloque "superposition_only_list"
    ScratchBlocks.Blocks['quantum_superposition_only_list'] = {
        init: function () {
            this.jsonInit({
                "message0": "superpose variable: %1 list: %2",
                "args0": [
                    { "type": "input_value", "name": "VARIABLE" },
                    { "type": "input_value", "name": "LISTA" }
                ],
                "category": "Quantum",
                "colour": QUANTUM_COLOR,
                "extensions": ["shape_statement"]
            });
        }
    };

    // Definición visual del bloque "superpositions"
    ScratchBlocks.Blocks['quantum_superpositions'] = {
        init: function () {
            this.jsonInit({
                "message0": "superpositions variable: %1 possibilities: %2 list: %3",
                "args0": [
                    { "type": "input_value", "name": "VARIABLE" },
                    { "type": "input_value", "name": "N_CLONES" },
                    { "type": "input_value", "name": "LISTA" }
                ],
                "category": "Quantum",
                "colour": QUANTUM_COLOR,
                "extensions": ["shape_statement"]
            });
        }
    };

    // Definición visual del bloque "whenEntanglementStart"
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

    // Definición visual del bloque "entanglement_no_list"
    ScratchBlocks.Blocks['quantum_entanglement_no_list'] = {
        init: function () {
            this.jsonInit({
                "message0": "entangle variable: %1 target: %2 possibilities: %3",
                "args0": [
                    { "type": "input_value", "name": "VARIABLE" },
                    { "type": "input_value", "name": "TARGET" },
                    { "type": "input_value", "name": "N_CLONES" }
                ],
                "category": "Quantum",
                "colour": QUANTUM_COLOR,
                "extensions": ["shape_statement"]
            });
        }
    };

    // Definición visual del bloque "entanglement_only_list"
    ScratchBlocks.Blocks['quantum_entanglement_only_list'] = {
        init: function () {
            this.jsonInit({
                "message0": "entangle variable: %1 target: %2 list: %3",
                "args0": [
                    { "type": "input_value", "name": "VARIABLE" },
                    { "type": "input_value", "name": "TARGET" },
                    { "type": "input_value", "name": "LISTA1" }
                ],
                "category": "Quantum",
                "colour": QUANTUM_COLOR,
                "extensions": ["shape_statement"]
            });
        }
    };

    // Definición visual del bloque "entanglement"
    ScratchBlocks.Blocks['quantum_entanglement'] = {
        init: function () {
            this.jsonInit({
                "message0": "entangle variable: %1 target: %2 possibilities: %3 list: %4",
                "args0": [
                    { "type": "input_value", "name": "VARIABLE" },
                    { "type": "input_value", "name": "TARGET" },
                    { "type": "input_value", "name": "LISTA1" },
                    { "type": "input_value", "name": "LISTA2" }
                ],
                "category": "Quantum",
                "colour": QUANTUM_COLOR,
                "extensions": ["shape_statement"]
            });
        }
    };

    // Definición visual del bloque "whenMeasured"
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

    // Definición visual del bloque "measure"
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
    
    console.log("✅ BLOQUES QUANTUM INYECTADOS VISUALMENTE");
}