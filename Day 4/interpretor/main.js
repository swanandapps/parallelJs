import fs from "fs";
import chalk from "chalk";
import { tokenize } from "../lexer/tokenizer.js";
import { codeCleaner } from "../lexer/cleaners.js";
import { Parse } from "../parser/main.js";
import { logMemory } from "../core/helpers.js";

import { Memory } from "../core/memory.js";

import { stringSanitizeforFinalOutput } from "../interpretor/helpers.js";
function InterpretJs(sourcecode) {
  //Step 1: Read Sourcecode using node fs module

  //Step 2: Cleaning the Sourcecode
  let result = codeCleaner(sourcecode);
  //Step 3: Tokenise source code

  //ideal tokens array = [let, x, =, 10, const, y , = ,20]
  let tokens = tokenize(sourcecode);
  console.log(tokens);

  //Step 4: Parser(tokens) -> AST

  let AST = Parse(tokens);
  console.log("AST:", AST);

  let output = [];
  logMemory();

  //loop over each ast node and interpret

  function InterPretAST(AST) {
    for (let i = 0; i < AST.length; i++) {
      //Read AST Node Data
      const currrentNode = AST[i];
      const currrentNodeType = currrentNode.nodeType;
      const currrentNodeMetaData = currrentNode.metaData;

      let result;
      switch (currrentNodeType) {
        case "VariableDeclaration":
          //interpret var dec here

          //currrentNodeMetaData = { name: 'num', dataType: 'number', value: '12', kind: 'var' }

          /* Grab the node value found through
           ParseVariableDeclaration() in our Parser */
          result = currrentNodeMetaData.value;

          Memory.write(currrentNodeMetaData, result);

          break;

        case "PrintStatement":
          //interpret print statements here

          switch (currrentNodeMetaData.printType) {
            case "variable":
              // Give the variable name, get back the value from Heap
              result = Memory.read(currrentNodeMetaData.toPrint[0]); //arr, name, str

              output.push(result.value);

              break;

            case "literal":
              let literalstring = currrentNodeMetaData.toPrint.join(" ");

              result = stringSanitizeforFinalOutput(literalstring);

              output.push(result);
              break;
          }

          break;

        case "FunctionCall":
          // const { lhs, operator, rhs } = AcurrrentNodeMetaData.condition;
          console.log("function currrentNodeMetaData:", currrentNodeMetaData);

          result = Memory.read(currrentNodeMetaData.functionName);

          let x = InterPretAST(result.value);
          console.log("x:", x);
        // const expression = lhsValue + " " + operator + " " + rhs;

        // result = eval(expression);

        default:
          console.log("Unknown NodeType", currrentNode);
      }
    }
  }

  InterPretAST(AST);

  logMemory();

  return output;
}

function runFile(filePath) {
  fs.readFile(filePath, "utf8", (err, sourcecode) => {
    if (err) {
      console.error(`Error reading file: ${filePath}`);
      console.error(err);
      return;
    }

    //passing the sourcecode
    let output = InterpretJs(sourcecode);

    output.forEach((singleoutput) => {
      console.log(singleoutput);
    });
  });
}

if (process.argv.length < 3) {
  console.log("Usage: node mainer.js <filename>");
  process.exit(1);
}

const fileName = process.argv[2];
runFile(fileName);

//functions

// Function to remove comments and unnecessary whitespaces from each line
// Tokenize the input code into an array of tokens
