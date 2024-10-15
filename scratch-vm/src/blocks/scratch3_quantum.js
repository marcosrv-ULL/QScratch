const Cast = require('../util/cast');
const Sequencer = require('../engine/sequencer');
const execute = require('../engine/execute');
const Thread = require('../engine/thread');
const BlocksRuntimeCache = require('../engine/blocks-runtime-cache');

class QuantumBlocks {
    constructor(runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        //this.hasStart = false;
    }

    /**
     * Retrieve the block primitives implemented by this package.
     * @return {object.<string, Function>} Mapping of opcode to Function.
     */
    getPrimitives() {
        return {
            quantum_superposition_no_list: this.superposition,
            quantum_superpositions: this.superpositions,
            quantum_measure: this.measure,
            quantum_whenSuperpositionStart: this.whenSuperpositionStart
        };
    }

    getHats() {
        return {
            quantum_whenSuperpositionStart: {
                restartExistingThreads: false,
                edgeActivated: false
            }
        };
    }

    whenSuperpositionStart(args, util) {
        return (util.target.isInSuperposition != true) ? false : true;
    }

    changeCostumeEffect() {

    }

    superposition(args, util) {
        util.target.isOriginal = true;
        if (!util.target._isInSuperpositionVariable[args.VARIABLES]) {
            util.target.superpose(parseInt(args.N_CLONES, 10), args.VARIABLES);
        }
        let increment = 0;
        
        if (!this.runtime.effectGhost) {
            this.runtime.effectGhost = setInterval(() => {
                for (let i = 0; i < this.runtime.targets.length; i++) {
                    if (this.runtime.targets[i].isInSuperPosition()) {
                        this.runtime.targets[i].setEffect("ghost", this.clampReflection(increment + (i * 8.5)));
                    }
                }
                increment += 10;
                if (increment > 10000000) increment = 0;
            }, 100);
        }
    }


    pushThread(blockId, target, canStep) {
        let isBlockIdAndTarget = false
        for(let i = 0; i < this.runtime.threads.length; i++) {
            if (this.runtime.threads[i].target.id === target.id && this.runtime.threads[i].topBlock === blockId) {
                isBlockIdAndTarget = true;
                break;
            }
        }
        if (!isBlockIdAndTarget) {
            this.runtime._pushThread(blockId, target)
            if (canStep) this.runtime.threads[this.runtime.threads.length - 1].goToNextBlock();
        }
        
    }

    clamp(value) {
        return ((value % 100) + 100) % 100;
    }

    clampReflection(value) {
        // Convertimos el valor en un rango positivo, considerando reflejos como en una onda triangular
        let range = 200;
        let modValue = value % range;

        if (modValue > 100) {
            // Si el valor excede 100, reflejamos el valor para que decrezca
            return 200 - modValue;
        } else {
            // Si está dentro del rango [0, 100], lo devolvemos tal cual
            return modValue;
        }
    }


    superpositions(args, util) {
        util.target.isOriginal = true;
        if (!util.target._isInSuperpositionVariable[args.VARIABLES]) {
            util.target.superposeWithList(parseInt(args.N_CLONES, 10), args.VARIABLES, this.convertToList(args.LISTA));
        }
        let increment = 0;
        
        if (!this.runtime.effectGhost) {
            this.runtime.effectGhost = setInterval(() => {
                for (let i = 0; i < this.runtime.targets.length; i++) {
                    if (this.runtime.targets[i].isInSuperPosition()) {
                        this.runtime.targets[i].setEffect("ghost", this.clampReflection(increment + (i * 8.5)));
                    }
                }
                increment += 10;
                if (increment > 10000000) increment = 0;
            }, 100);
        }


    }

    convertToList(listString) {
        const numerosComoStrings = listString.match(/\d+/g);
        return numerosComoStrings ? numerosComoStrings.map(Number) : [0];
    }

    measure(args, util) {
        util.target.measure();
    }

    /*
    measure(args, util) {
        for (let i = this.runtime.targets.length - 1; i > 0; i--) {
            if (this.runtime.targets[i].isClone && this.runtime.targets[i].targetId == util.target.id) {
                this.runtime.disposeTarget(this.runtime.targets[i]);
            } else if (this.runtime.targets[i].isInSuperposition && this.runtime.targets[i].id == util.target.id) {
                this.runtime.targets[i].setEffect("ghost", 0);
                this.runtime.targets[i].isInSuperposition = false;
                this.runtime.stopForTarget(this.runtime.targets[i]);
            }
        }
        util.target.isInSuperposition = false;


    }*/
}

module.exports = QuantumBlocks;