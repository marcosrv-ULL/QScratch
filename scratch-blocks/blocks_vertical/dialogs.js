'use strict';

goog.provide('Blockly.Blocks.dialogs');

goog.require('Blockly.Blocks');
goog.require('Blockly.Colours');
goog.require('Blockly.ScratchBlocks.VerticalExtensions');

Blockly.Blocks['dialogs_alert'] = {
  /**
   * @this Blockly.Block
   */
  init: function(){
    this.jsonInit({
      "message0": Blockly.Msg.DIALOGS_ALERT, 
      "args0": [
        {
          "type": "input_value",
          "name": "MESSAGE"
        }
      ],
      "category": Blockly.Categories.dialogs,
      "extensions": ["colours_dialogs", "shape_statement"]
    });
  }
};

Blockly.Blocks['dialogs_prompt'] = {
    /**
     * @this Blockly.Block
     */
    init: function(){
      this.jsonInit({
        "message0": Blockly.Msg.DIALOGS_PROMPT, 
        "args0": [
          {
            "type": "input_value",
            "name": "MESSAGE"
          }
        ],
        "category": Blockly.Categories.dialogs,
        "extensions": ["colours_dialogs", "output_string"]
      });
    }
  };

  Blockly.Blocks['dialogs_confirm'] = {
    /**
     * @this Blockly.Block
     */
    init: function(){
      this.jsonInit({
        "message0": Blockly.Msg.TUTORIALMOD_DIALOGS_CONFIRM, 
        "args0": [
          {
            "type": "input_value",
            "name": "MESSAGE"
          }
        ],
        "category": Blockly.Categories.dialogs,
        "extensions": ["colours_dialogs", "output_boolean"]
      });
    }
  };

  Blockly.Blocks['dialogs_whileconfirmed'] = {
    /**
     * @this Blockly.Block
     */
    init: function(){
      this.jsonInit({
        "message0": Blockly.Msg.DIALOGS_WHILECONFIRMED, // while confirmed %1
        "message1": "%1",
        "args0": [
          {
            "type": "input_value",
            "name": "MESSAGE"
          }
        ],
        "args1": [
          {
            "type": "input_statement",
            "name": "SUBSTACK"
          }
        ],
        "category": Blockly.Categories.dialogs,
        "extensions": ["colours_dialogs", "shape_statement"]
      });
    }
  }

  Blockly.Blocks['dialogs_randomchoice'] = {
    /**
     * @this Blockly.Block
     */
    init: function(){
      this.jsonInit({
        "message0": Blockly.Msg.DIALOGS_RANDOMCHOICE,
        "message1": "%1",
        "message2": "%1",
        "message3": "%1",
        "args1": [
          {
            "type": "input_statement",
            "name": "SUBSTACK"
          }
        ],
        "args2": [
          {
            "type": "input_statement",
            "name": "SUBSTACK2"
          }
        ],
        "args3": [
          {
            "type": "input_statement",
            "name": "SUBSTACK3"
          }
        ],
        "category": Blockly.Categories.dialogs,
        "extensions": ["colours_dialogs", "shape_statement"]
      });
    }
  };