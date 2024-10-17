
const Cast = require('../util/cast');
const Sequencer = require('../engine/sequencer');
const execute = require('../engine/execute');
const Thread = require('../engine/thread');
const Target = require('../engine/target');
const BlocksRuntimeCache = require('../engine/blocks-runtime-cache');

class QuantumBlocks {

    constructor(runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        //this.hasStart = false;

        this.possibilityTree = {};
        this.isInSuperPositionList = {};
        this.entanglementLinks = {};
    }

    /**
     * Retrieve the block primitives implemented by this package.
     * @return {object.<string, Function>} Mapping of opcode to Function.
     */
    getPrimitives() {
        return {
            quantum_entanglement: this.entanglement,
            quantum_entanglement_no_list: this.entanglementNClones,
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

    collectPossibiltyTreeGarbage() {
        for (let key in this.possibilityTree) {
            if (this.possibilityTree.hasOwnProperty(key)) {
                let array = this.possibilityTree[key];
                
                // Recorrer el array y eliminar los valores undefined
                for (let i = array.length - 1; i >= 0; i--) {
                    if (array[i].isGarbage) {
                        array.splice(i, 1); // Eliminar valor undefined
                    }
                }
            }
        }
    }

    whenSuperpositionStart(args, util) {
        return (util.target.isInSuperposition != true) ? false : true;
    }

    entanglement(args, util) {
        const child = this.runtime.getSpriteTargetByName(args.TARGET);
        if (!child) return;
        const variable = args.VARIABLES;
        const list1 = args.LISTA1;
        const list2 = args.LISTA2;
        this.util.target.addEntangleLink(child, variable);
    }

    entanglementNClones(args, util) {
        const child = this.runtime.getSpriteTargetByName(args.TARGET);
        if (!child) return;
        const variable = args.VARIABLES;
        const nClones = args.N_CLONES;
    }

    onTreePopThis(target) {
        for (let i = 0; i < this.possibilityTree[target.originalId].length; i++) {
            if (this.possibilityTree[target.originalId][i].id === target.id) {
                this.possibilityTree[target.originalId].splice(i, 1);
                this.possibilityTree[target.originalId].isOriginal = false;
                this.possibilityTree[target.originalId].clone = true;
            }
        }
    }

    chooseOriginalFromTree(id) {
        let originalIndex = (Math.floor(Math.random() * this.possibilityTree[id].length));
        for (let i = 0; i < this.possibilityTree[id].length; i++) {
            if (this.possibilityTree[id][i].isOriginal) {
                this.possibilityTree[id][i].isOriginal = false;
                this.possibilityTree[id][i].clone = true;
            }
        }
        this.possibilityTree[id][originalIndex].isOriginal = true;
        this.possibilityTree[id][originalIndex].clone = false;
        return this.possibilityTree[id][originalIndex];
    }

    getOriginal(targetId) {
        for(let i = 0; i < this.possibilityTree[targetId].length; i++) {
            if (this.possibilityTree[targetId][i].isOriginal) {
                return this.possibilityTree[targetId][i];
            }
        }
    }

    createPossibilities(target, nClones, variable) {
        let originalId = target.originalId;
        let tree = [...this.possibilityTree[originalId]];
        let originalTarget = this.getOriginal(originalId);
        target._isInSuperPositionList[variable] = true;
        for (const element of tree) {
            this.changeSuperposeState(element, variable);
            this.onTreePopThis(element);
            let ThisClone = []
            for (let i = 0; i < nClones; i++) {
                let clone = element.makeClone();
                clone.isClone = true;
                clone.originalId = element.originalId;
                clone._isInSuperPositionList = Object.assign({}, element._isInSuperPositionList);
                this.runtime.addTarget(clone);
                clone.goBehindOther(element);
                ThisClone.push(clone);
                this.possibilityTree[originalId].push(clone);
            }

            this.changeVariable(element, variable, nClones, ThisClone);

            //console.log(tree.length);
            
        }
        console.log(this.possibilityTree[originalId]);
        let newOriginal = this.chooseOriginalFromTree(originalId);
        for (let i = 0; i < this.runtime.threads.length; i++) {
            let targetThread = this.runtime.threads[i].target;
            if (targetThread.id === originalTarget.id) {
                const nextBlockId = originalTarget.blocks.getNextBlock(this.runtime.threads[i].peekStack());
                this.runtime.threads[i].id = newOriginal.id;
                this.runtime._pushThread(nextBlockId, newOriginal);
            }
        }
        
        for (const element of tree) {
            element.runtime.disposeTarget(element);
        }
        let scripts = BlocksRuntimeCache.getScripts(newOriginal.blocks, 'quantum_whenSuperpositionStart');
        if (scripts.length >= 1) {
            for (let j = 0; j < scripts.length; j++) {
                console.log(this.possibilityTree[originalId]);
                for (const poss of this.possibilityTree[originalId]) {
                    this.pushThread(scripts[j].blockId, poss, true);
                }
            }
        }
    
        
    }

    pushThread(blockId, target, canStep) {
        let isBlockIdAndTarget = false
        for (let i = 0; i < this.runtime.threads.length; i++) {
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

    superposition(args, util) {
        this.collectPossibiltyTreeGarbage();
        util.target.isOriginal = true;
        if (!this.isInSuperPosition(util.target)) {
            this.possibilityTree[util.target.originalId] = [util.target];
            console.log(this.possibilityTree[util.target.originalId])

        }
        if(!this.isSuperpose(util.target, args.VARIABLES)) {
            this.createPossibilities(util.target, parseInt(args.N_CLONES, 10), args.VARIABLES);
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

    isEntangle(target) {
        return Object.values(target._entanglementLinks).some(value => value.length > 0);
    }

    addEntangleLink(target1, target2, variable) {
        if (!target1._entanglementLinks[variable].includes(target2)) {
            target1._entanglementLinks[variable].push(target2);
            target2._entanglementLinks[variable].push(target1);
        }
    }

    isInSuperPosition(target) {
        return Object.values(target._isInSuperPositionList).some(value => value === true);
    }

    isSuperpose(target, variable) {
        return target._isInSuperPositionList[variable]; 
    }

    changeSuperposeState(target, variable) {
        target._isInSuperPositionList[variable] = true;
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

    changeVariable(target, variable, nClones,tree) {
        switch (variable) {
            case "_position_":

                const MAX_CLONES = 300;

                let numClones = Math.min(nClones, MAX_CLONES);

                let radius = numClones * 10;
                radius = Math.min(radius, 1500);

                let angle = Math.random() * 2 * Math.PI;
                let distance = Math.random() * radius;

                let posx = 0;
                let posy = 0;

                for (const clone of tree) {
                    // Posición aleatoria para cada clon dentro del mismo radio
                    angle = Math.random() * 2 * Math.PI; // Ángulo aleatorio
                    distance = Math.random() * radius;   // Distancia aleatoria dentro del radio

                    posx = target.x + distance * Math.cos(angle);
                    posy = target.y + distance * Math.sin(angle);

                    clone.setXY(posx, posy);
                }

                break;
            case "_direction_":
                let originalDirection = target.direction;
                let totalEntities = nClones;
                let increment = 360 / totalEntities;
                let directions = [];

                for (let i = 0; i < totalEntities; i++) {
                    let newDirection = (originalDirection + i * increment) % 360;
                    directions.push(newDirection);
                }

                for (let i = directions.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [directions[i], directions[j]] = [directions[j], directions[i]];
                }

                for (let i = 0; i < tree.length; i++) {
                    tree[i].setDirection(directions[i]);
                }
            
                break;
            case "_color_":
                let originalColor = 0;
                let totalEntitiesColor = nClones;
                let incrementColor = 200 / totalEntitiesColor;
                let colors = [];

                for (let i = 0; i < totalEntitiesColor; i++) {
                    let newColor = originalColor + i * incrementColor;
                    colors.push(newColor);
                }

                for (let i = colors.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [colors[i], colors[j]] = [colors[j], colors[i]];
                }

                console.log(colors);
                for (let i = 0; i < tree.length; i++) {
                    tree[i].setEffect("color", colors[i]);
                }
                
                break;
            case "_costume_":
                break;
        }
    }

    superpositions(args, util) {
        /*util.target.isOriginal = true;
        if (!util.target._isInSuperpositionVariable[args.VARIABLES]) {
            util.target.superposeWithList(parseInt(args.N_CLONES, 10), args.VARIABLES, this.convertToList(args.LISTA));
        }*/
        if (!this.isInSuperPosition(util.target)) {
            this.possibilityTree[util.target.originalId] = [util.target];
            
        } else if(!this.isSuperpose(util.target, args.VARIABLES)) {

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
        let originalId = util.target.originalId;
        let original = null;
        for (let i = this.possibilityTree[originalId].length - 1; i >= 0; i--) {
            let target = this.possibilityTree[originalId][i];
            this.runtime.stopForTarget(target);
            if (!target.isOriginal) {
                target.isVisible = false;
                this.runtime.disposeTarget(target);
                this.onTreePopThis(target);

            } else {
                target._isInSuperPositionList = {
                    '_position_': false,
                    '_direction_': false,
                    '_color_': false
                }
                
                target.setEffect("ghost", 0);
                original = target;
            }
        }
        console.log(this.possibilityTree[originalId]);
        let scripts = BlocksRuntimeCache.getScripts(original.blocks, 'quantum_whenMeasured');
        if (scripts.length >= 1) {
            for (let j = 0; j < scripts.length; j++) {
                original.pushThread(scripts[j].blockId, original, true);
            }
        }
    }
}

module.exports = QuantumBlocks;