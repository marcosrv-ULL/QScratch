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
        //console.log((util.target.isInSuperposition != true) ? false: true);
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

    /*superposition(args, util) {
        if (!util.target.isInSuperposition) {
            if (args.N_CLONES >= 300) {
                args.N_CLONES = 299;
            } else {
                args.N_CLONES = parseInt(args.N_CLONES, 10);
            }
            let cloneTarget = util.target;
            cloneTarget.isOriginal = true;
            cloneTarget.isInSuperposition = true;
            cloneTarget.isInSuperpositionVariable[args.VARIABLES] = true;
            util.target.name = "Original";
            for (let i = 0; i < args.N_CLONES - 1; i++) {
                let clone = cloneTarget.makeClone();
                clone.isClone = true;
                clone.targetId = util.target.id;
                clone.name = "clone" + i;
                clone.isInSuperposition = true;
                clone.isInSuperpositionVariable[args.VARIABLES] = true;
                this.runtime.addTarget(clone);
                clone.goBehindOther(cloneTarget);
            }

            util.target.isInSuperposition = true;
            if (!this.runtime.effectGhost) {
                this.runtime.effectGhost = setInterval(() => {
                    for (let i = 0; i < this.runtime.targets.length; i++) {
                        if (this.runtime.targets[i].isInSuperposition) {
                            this.runtime.targets[i].setEffect("ghost", this.clampReflection(increment));
                        }
                    }
                    increment += 10;
                }, 100);
            }


        }

        let increment = 1;

        switch (args.VARIABLES) {
            case "_position_":this.runtime

                // Número máximo de clones
                const MAX_CLONES = 300;

                // Número de clones a usar, capando el máximo
                let numClones = Math.min(args.N_CLONES, MAX_CLONES);

                // Define el radio, podría ser una función del número de clones (aquí es lineal, pero puedes modificar la fórmula)
                let radius = numClones * 10;  // Radio aumenta 10 unidades por cada clon
                radius = Math.min(radius, 1500);  // Capamos el radio máximo a 1500 (arbitrario, ajusta según necesites)

                // Generamos una posición aleatoria dentro del radio
                let angle = Math.random() * 2 * Math.PI; // Ángulo aleatorio
                let distance = Math.random() * radius;   // Distancia aleatoria dentro del radio

                // Convertimos de coordenadas polares a cartesianas
                let posx = util.target.x + distance * Math.cos(angle);
                let posy = util.target.y + distance * Math.sin(angle);

                // Establece las nuevas coordenadas
                util.target.setXY(posx, posy);

                for (let i = 0; i < this.runtime.targets.length; i++) {
                    if (this.runtime.targets[i].isClone && this.runtime.targets[i].targetId == util.target.id) {
                        // Posición aleatoria para cada clon dentro del mismo radio
                        angle = Math.random() * 2 * Math.PI; // Ángulo aleatorio
                        distance = Math.random() * radius;   // Distancia aleatoria dentro del radio

                        posx = util.target.x + distance * Math.cos(angle);
                        posy = util.target.y + distance * Math.sin(angle);

                        this.runtime.targets[i].setXY(posx, posy);
                    }
                }
                break;
            case "_direction_":
                // Generar una dirección aleatoria entre 0 y 360 grados
                let randomDirection = Math.random() * 360;
                util.target.setDirection(randomDirection);

                // Aplicar la misma lógica para los clones
                for (let i = 0; i < this.runtime.targets.length; i++) {
                    if (this.runtime.targets[i].isClone && this.runtime.targets[i].targetId == util.target.id) {
                        // Generar una nueva dirección aleatoria entre 0 y 360 grados para cada clon
                        randomDirection = Math.random() * 360;
                        this.runtime.targets[i].setDirection(randomDirection);
                    }
                }
                break;
            case "_color_":
                let randomColor = Math.random() * 200;
                util.target.setEffect("color", randomColor);

                // Aplicar el mismo cambio a los clones
                for (let i = 0; i < this.runtime.targets.length; i++) {
                    if (this.runtime.targets[i].isClone && this.runtime.targets[i].targetId == util.target.id) {
                        // Generar un nuevo color aleatorio entre 0 y 200 para cada clon
                        randomColor = Math.random() * 200;
                        this.runtime.targets[i].setEffect("color", randomColor);
                    }
                }
                break;
            case "_costume_":
                console.log("_costume_");
                break;
        }

        if (util.target.isInSuperposition) {
            let scripts = BlocksRuntimeCache.getScripts(util.target.blocks, 'quantum_whenSuperpositionStart');
            if (scripts.length >= 1) {
                for (let j = 0; j < scripts.length; j++) {
                    this.pushThread(scripts[j].blockId, util.target, false);
                    for (let i = 0; i < this.runtime.targets.length; i++) {
                        if (this.runtime.targets[i].isClone && this.runtime.targets[i].targetId == util.target.id) {
                            this.pushThread(scripts[j].blockId, this.runtime.targets[i], true);
                        }
                    }
                }
            }
        }


    }*/

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
        if (util.target.isInSuperPosition())
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