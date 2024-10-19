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
        this.addEntangleLink(util.target, child, variable);
    }

    entanglementNClones(args, util) {
        this.collectPossibiltyTreeGarbage();
        const child = this.runtime.getSpriteTargetByName(args.TARGET);
        if (!child) return;
        const variable = args.VARIABLES;
        const nClones = args.N_CLONES;
        if (this.isSuperpose(util.target, variable) && this.isSuperpose(child, variable)) return;

        if (!this.entanglementLinks[util.target.originalId]) {
            this.entanglementLinks[util.target.originalId] = {
                '_position_': [],
                '_direction_': [],
                '_color_': [],
                '_size_': [],
                '_costume_': []
            }
            if (!this.possibilityTree[util.target.originalId]) this.possibilityTree[util.target.originalId] = [util.target];
        }

        if (!this.entanglementLinks[child.originalId]) {
            this.entanglementLinks[child.originalId] = {
                '_position_': [],
                '_direction_': [],
                '_color_': [],
                '_size_': [],
                '_costume_': []
            }
            if (!this.possibilityTree[child.originalId]) this.possibilityTree[child.originalId] = [child];
        }
        this.addEntangleLink(util.target, child, variable);

        let originalId1 = util.target.originalId;
        let originalId2 = child.originalId;
        if (!this.isSuperpose(util.target, variable) && !this.isSuperpose(child, variable)) {
            this.createPossibilities(util.target, nClones, variable);
            this.createPossibilitiesConditioned(child, nClones, variable, this.getOriginal(originalId1));
        } else if (!this.isSuperpose(util.target, variable) && this.isSuperpose(child, variable)) {
            this.createPossibilitiesConditioned(util.target, nClones, variable, this.getOriginal(originalId2));

        } else {
            this.createPossibilitiesConditioned(child, nClones, variable, this.getOriginal(originalId1));
        }

        let increment = 1;

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
        let original1 = this.getOriginal(originalId1);
        let original2 = this.getOriginal(originalId2);

        let scripts = BlocksRuntimeCache.getScripts(original1.blocks, 'quantum_whenEntanglementStart');
        if (scripts.length >= 1) {
            for (let j = 0; j < scripts.length; j++) {
                for (const poss of this.possibilityTree[originalId1]) {
                    this.pushThread(scripts[j].blockId, poss, true);
                }
            }
        }

        scripts = BlocksRuntimeCache.getScripts(original2.blocks, 'quantum_whenEntanglementStart');
        if (scripts.length >= 1) {
            for (let j = 0; j < scripts.length; j++) {
                for (const poss of this.possibilityTree[originalId2]) {
                    this.pushThread(scripts[j].blockId, poss, true);
                }
            }
        }
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

    searchInTreeForSameProperties(original, properties, tree) {
        for (const poss of tree) {
            let isOriginal = false;
            for (const property of properties) {
                if (property == '_size_') {
                    if (original.size == poss.size) {
                        poss.isOriginal = true;
                        return poss;
                    }
                } else if (property == '_direction_') {
                    if (original.direction == poss.direction) {
                        poss.isOriginal = true;
                        return poss;
                    }
                } else if (property == '_color_') {
                    if (original.effects.color == original.effects.color) {
                        poss.isOriginal = true;
                        return poss;
                    }
                } else if (property == '_costume_') {
                    if (original.currentCostume == original.currentCostume) {
                        poss.isOriginal = true;
                        return poss;
                    }
                }
            }
        }
    }

    chooseOriginalFromTreeConditioned(id, variables, tree) {
        for (let i = 0; i < this.possibilityTree[id].length; i++) {
            if (this.possibilityTree[id][i].isOriginal) {
                this.searchInTreeForSameProperties(this.possibilityTree[id][i], variables, tree);
            }
        }
        this.possibilityTree[id][originalIndex].isOriginal = true;
        this.possibilityTree[id][originalIndex].clone = false;
        return this.possibilityTree[id][originalIndex];
    }

    chooseOriginalFromTreeWithIndex(id, index) {
        let originalIndex = index;
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
        for (let i = 0; i < this.possibilityTree[targetId].length; i++) {
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
            let ThisClone = [];
            for (let i = 0; i < nClones; i++) {
                let clone = element.makeClone();
                if (clone) {
                    clone.isClone = true;
                    clone.originalId = element.originalId;
                    clone._isInSuperPositionList = Object.assign({}, element._isInSuperPositionList);
                    this.runtime.addTarget(clone);
                    clone.goBehindOther(element);
                    ThisClone.push(clone);
                    this.possibilityTree[originalId].push(clone);
                }

            }

            this.changeVariable(element, variable, nClones, ThisClone);
        }
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
                for (const poss of this.possibilityTree[originalId]) {
                    this.pushThread(scripts[j].blockId, poss, true);
                }
            }
        }


    }

    createPossibilitiesConditioned(target, nClones, variable, conditionedTarget) {
        let originalId = target.originalId;
        let tree = [...this.possibilityTree[originalId]];
        let originalTarget = this.getOriginal(originalId);
        target._isInSuperPositionList[variable] = true;
        for (const element of tree) {
            this.changeSuperposeState(element, variable);
            this.onTreePopThis(element);
            let ThisClone = [];
            for (let i = 0; i < nClones; i++) {
                let clone = element.makeClone();
                if (clone) {
                    clone.isClone = true;
                    clone.originalId = element.originalId;
                    clone._isInSuperPositionList = Object.assign({}, element._isInSuperPositionList);
                    this.runtime.addTarget(clone);
                    clone.goBehindOther(element);
                    ThisClone.push(clone);
                    this.possibilityTree[originalId].push(clone);
                }

            }

            this.changeVariable(element, variable, nClones, ThisClone);
        }
        let newOriginal = this.searchInTreeForSameProperties(conditionedTarget, [variable], this.possibilityTree[originalId]);
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

        }
        if (!this.isSuperpose(util.target, args.VARIABLES)) {
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
        if (!this.entanglementLinks[target1.originalId][variable].includes(target2)) {
            this.entanglementLinks[target1.originalId][variable].push(target2);
            this.entanglementLinks[target2.originalId][variable].push(target1);
        }
    }

    deleteEntangleLink(target1, target2, variable) {
        if (this.entanglementLinks[target1.originalId][variable].includes(target2)) {
            for (let i = 0; i < this.entanglementLinks[target1.originalId][variable].length; i++) {
                if (this.entanglementLinks[target1.originalId][variable][i].id === target2.id) {
                    this.entanglementLinks[target1.originalId][variable].splice(i, 1);
                }
            }
            for (let i = 0; i < this.entanglementLinks[target2.originalId][variable].length; i++) {
                if (this.entanglementLinks[target2.originalId][variable][i].id === target1.id) {
                    this.entanglementLinks[target2.originalId][variable].splice(i, 1);
                }
            }
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

    changeVariable(target, variable, nClones, tree) {
        console.log(target);
        switch (variable) {
            case "_position_":

                const MAX_CLONES = 300;

                let numClones = Math.min(nClones, MAX_CLONES);

                let radius = numClones * 10;
                radius = Math.min(radius, 200);

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

                for (let i = 0; i < tree.length; i++) {
                    tree[i].setEffect("color", colors[i]);
                }

                break;
            case "_costume_":
                let currentCostume = target.currentCostume;
                let totalNOfCostume = target.sprite.costumes_.length;
                let totalEntitiesCostume = nClones;
                let costumes = [];

                for (let i = 0; i < totalEntitiesCostume; i++) {
                    let newCostume = (currentCostume + i) % totalNOfCostume;
                    costumes.push(newCostume);
                }

                for (let i = costumes.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [costumes[i], costumes[j]] = [costumes[j], costumes[i]];
                }

                for (let i = 0; i < tree.length; i++) {
                    tree[i].setCostume(costumes[i]);
                }
                break;
            case "_size_":
                let initialSize = target.size; 
                let totalEntitiesSize = nClones; 
                let sizes = [];

                let minSize = initialSize * 0.5; 
                let maxSize = initialSize * 1.5; 

                for (let i = 0; i < totalEntitiesSize; i++) {
                    let progress = i / (totalEntitiesSize - 1); 
                    let newSize = maxSize - progress * (maxSize - minSize); 
                    sizes.push(newSize);
                }

                for (let i = 0; i < tree.length; i++) {
                    tree[i].setSize(sizes[i]);
                }
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

        } else if (!this.isSuperpose(util.target, args.VARIABLES)) {

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

    measureTarget(target) {
        if (!target) return;
        let originalId = target.originalId;
        let original = null;

        for (let i = this.possibilityTree[originalId].length - 1; i >= 0; i--) {
            let target1 = this.possibilityTree[originalId][i];
            this.runtime.stopForTarget(target1);
            if (!target1.isOriginal) {
                target1.isVisible = false;
                this.runtime.disposeTarget(target1);
                this.onTreePopThis(target1);

            } else {
                target1._isInSuperPositionList = {
                    '_position_': false,
                    '_direction_': false,
                    '_color_': false,
                    '_size_': false,
                    '_costume_': false
                }

                target1.setEffect("ghost", 0);
                original = target1;
            }
        }

        for (let key in this.entanglementLinks[target.originalId]) {
            for (let i = 0; i < this.entanglementLinks[target.originalId][key].length; i++) {
                let current = this.entanglementLinks[target.originalId][key][i];
                this.deleteEntangleLink(target, current, key);
                this.measureTarget(current);
            }
        }

        let scripts = BlocksRuntimeCache.getScripts(original.blocks, 'quantum_whenMeasured');
        if (scripts.length >= 1) {
            for (let j = 0; j < scripts.length; j++) {
                this.pushThread(scripts[j].blockId, original, true);
            }
        }
    }

    measure(args, util) {
        this.measureTarget(util.target);
    }
}

module.exports = QuantumBlocks;