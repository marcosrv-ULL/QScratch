class TutorialModDialogsBlocks {
    constructor (runtime){
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }

    /**
     * Retrieve the block primitives implemented by this package.
     * @return {object.<string, Function>} Mapping of opcode to Function.
     */
    getPrimitives () {
        return {
            dialogs_alert: this.alertBlock,
            dialogs_prompt: this.promptBlock,
            dialogs_whileconfirmed: this.whileConfirmedBlock,
            dialogs_randomchoice: this.randomChoice
        };
    }

    alertBlock(args, util) {
        alert(args.MESSAGE);
    }

    promptBlock(args, util) {
        return prompt(args.MESSAGE);
    }

    whileConfirmedBlock(args, util){
        if(confirm(args.MESSAGE)){
            util.startBranch(1, true);
        }
    }

    randomChoice(args, util){
        let randomValue = Math.floor(Math.random() * 3 + 1);
        util.startBranch(randomValue, false);
    }
}

module.exports = TutorialModDialogsBlocks;