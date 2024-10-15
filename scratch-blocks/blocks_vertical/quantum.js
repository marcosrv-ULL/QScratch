'use strict';

goog.provide('Blockly.Blocks.quantum');

goog.require('Blockly.Blocks');
goog.require('Blockly.Colours');
goog.require('Blockly.ScratchBlocks.VerticalExtensions');

Blockly.Blocks['quantum_superposition'] = {
    /**
     * @this Blockly.Block
     */
    init: function(){
      this.jsonInit({
        "message0": Blockly.Msg.QUANTUM_SUPERPOSITION, // while confirmed %1
        "message1": "%1",
        "args0": [
          {
            "type": "input_value",
            "name": "N_CLONES"
          },
          {
            "type": "input_value",
            "name": "VARIABLE"
          },
          {
            "type": "input_value",
            "name": "LISTA",
            "variableTypes": [Blockly.LIST_VARIABLE_TYPE]
          }
        ],
        "args1": [
          {
            "type": "input_statement",
            "name": "SUBSTACK"
          }
        ],
        "category": Blockly.Categories.quantum,
        "extensions": ["colours_quantum", "shape_statement"]
      });
    }
  }


  Blockly.Blocks['quantum_superpositions'] = {
    /**
     * @this Blockly.Block
     */
    init: function(){
      this.jsonInit({
        "message0": Blockly.Msg.QUANTUM_SUPERPOSITION1, // while confirmed %1
        "args0": [
          {
            "type": "field_dropdown",
            "name": "VARIABLES",
            "options": [
              [Blockly.Msg.QUANTUM_SUPERPOSITION1_POSITION, '_position_'],
              [Blockly.Msg.QUANTUM_SUPERPOSITION1_DIRECTION, '_direction_'],
              [Blockly.Msg.QUANTUM_SUPERPOSITION1_COLOR, '_color_'],
              [Blockly.Msg.QUANTUM_SUPERPOSITION1_COSTUME, '_costume_']
            ]
          },
          {
            "type": "input_value",
            "name": "N_CLONES"
          },
          {
            "type": "input_value",
            "name": "LISTA",
            "variableTypes": [Blockly.LIST_VARIABLE_TYPE]
          }
        ],
        "category": Blockly.Categories.quantum,
        "extensions": ["colours_quantum", "shape_statement"]
      });
    }
  }

  Blockly.Blocks['quantum_superposition_no_list'] = {
    /**
     * @this Blockly.Block
     */
    init: function(){
      this.jsonInit({
        "message0": Blockly.Msg.QUANTUM_SUPERPOSITION_NO_LIST, // while confirmed %1
        "args0": [
          {
            "type": "field_dropdown",
            "name": "VARIABLES",
            "options": [
              [Blockly.Msg.QUANTUM_SUPERPOSITION1_POSITION, '_position_'],
              [Blockly.Msg.QUANTUM_SUPERPOSITION1_DIRECTION, '_direction_'],
              [Blockly.Msg.QUANTUM_SUPERPOSITION1_COLOR, '_color_'],
              [Blockly.Msg.QUANTUM_SUPERPOSITION1_COSTUME, '_costume_']
            ]
          },
          {
            "type": "input_value",
            "name": "N_CLONES"
          }
        ],
        "category": Blockly.Categories.quantum,
        "extensions": ["colours_quantum", "shape_statement"]
      });
    }
  }

  Blockly.Blocks['quantum_entanglement_no_list'] = {
    /**
     * @this Blockly.Block
     */
    init: function(){
      this.jsonInit({
        "message0": Blockly.Msg.QUANTUM_ENTANGLEMENT_NO_LIST, // while confirmed %1
        "args0": [
          {
            "type": "input_value",
            "name": "TARGET"
          },
          {
            "type": "field_dropdown",
            "name": "VARIABLES",
            "options": [
              [Blockly.Msg.QUANTUM_SUPERPOSITION1_POSITION, '_position_'],
              [Blockly.Msg.QUANTUM_SUPERPOSITION1_DIRECTION, '_direction_'],
              [Blockly.Msg.QUANTUM_SUPERPOSITION1_COLOR, '_color_'],
              [Blockly.Msg.QUANTUM_SUPERPOSITION1_COSTUME, '_costume_']
            ]
          },
          {
            "type": "input_value",
            "name": "N_CLONES"
          }
        ],
        "category": Blockly.Categories.quantum,
        "extensions": ["colours_quantum", "shape_statement"]
      });
    }
  }

  Blockly.Blocks['quantum_entanglement'] = {
    /**
     * @this Blockly.Block
     */
    init: function(){
      this.jsonInit({
        "message0": Blockly.Msg.QUANTUM_ENTANGLEMENT, // while confirmed %1
        "args0": [
          {
            "type": "input_value",
            "name": "TARGET"
          },
          {
            "type": "field_dropdown",
            "name": "VARIABLES",
            "options": [
              [Blockly.Msg.QUANTUM_SUPERPOSITION1_POSITION, '_position_'],
              [Blockly.Msg.QUANTUM_SUPERPOSITION1_DIRECTION, '_direction_'],
              [Blockly.Msg.QUANTUM_SUPERPOSITION1_COLOR, '_color_'],
              [Blockly.Msg.QUANTUM_SUPERPOSITION1_COSTUME, '_costume_']
            ]
          },
          {
            "type": "input_value",
            "name": "N_CLONES"
          },
          {
            "type": "input_value",
            "name": "LISTA",
            "variableTypes": [Blockly.LIST_VARIABLE_TYPE]
          }
        ],
        "category": Blockly.Categories.quantum,
        "extensions": ["colours_quantum", "shape_statement"]
      });
    }
  }

  Blockly.Blocks['quantum_whenEntanglementStart'] = {
    /**
     * @this Blockly.Block
     */
    init: function(){
      this.jsonInit({
        "message0": Blockly.Msg.QUANTUM_WHENENTANGLEMENTSTART,
        "category": Blockly.Categories.event,
        "extensions": ["colours_quantum", "shape_hat"]
      });
    }
  };

  Blockly.Blocks['quantum_measure'] = {
    /**
     * @this Blockly.Block
     */
    init: function(){
      this.jsonInit({
        "message0": Blockly.Msg.QUANTUM_MEASURE, // while confirmed %1
        "category": Blockly.Categories.quantum,
        "extensions": ["colours_quantum", "shape_statement"]
      });
    }
  }


  Blockly.Blocks['quantum_whenSuperpositionStart'] = {
    /**
     * @this Blockly.Block
     */
    init: function(){
      this.jsonInit({
        "message0": Blockly.Msg.QUANTUM_WHENSUPERPOSITIONSTART,
        "category": Blockly.Categories.event,
        "extensions": ["colours_quantum", "shape_hat"]
      });
    }
  };