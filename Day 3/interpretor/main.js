import { createAST } from "../ast/main.js";
import { parse } from "../parser/main.js";
import { tokenize } from "../lexer/tokenizer.js";
import { codeCleaner } from "../lexer/cleaners.js";

import { Memory } from "../core/memory.js";

import { stringSanitizeforFinalOutput } from "./helpers.js";

import fs from "fs";
import chalk from "chalk";

function interpretMiniJs(code) {
  try {
    const miniJs = {};
    // STEP 1: Clean the Sourcecode written by Developer
    miniJs.cleaned_code = codeCleaner(code);
    // console.log(chalk.blue("   Cleaned Code:"), miniJs.cleaned_code);

    // STEP 2: Convert the Sourcecode into Array of Tokens
    miniJs.tokens = tokenize(miniJs.cleaned_code);
    console.log(chalk.blue("Tokens:"), miniJs.tokens);

    // STEP 3: Give meaning to each Token in AST
    const ast = createAST(miniJs.tokens);
    miniJs.ast = ast;
    console.log("ast:", ast);

    miniJs.output = [];

    //from Memory.js
    miniJs.memory = Memory;
    console.log("Memory:", Memory);

    for (let i = 0; i < ast.length; i++) {
      const currentNode = ast[i];
      const currentNodeType = currentNode.nodeType;
      const currentNodeMetaData = currentNode.metaData;

      let result;

      switch (currentNodeType) {
        //2nd Phase of Memory, Declared variables are assigned Values

        case "VariableDeclaration":
          result = currentNodeMetaData.value;

          Memory.write(currentNodeMetaData, result, "Global");

          break;
        case "PrintStatement":
          switch (currentNodeMetaData.to_print) {
            case "variable":
              // console.log(chalk.yellow.bold("      Printing Variable:"));
              // console.log(chalk.yellow("         currentNode:"), currentNode);
              //access the latest value from 2nd phase of memory
              result = Memory.read(currentNodeMetaData.toPrint[0]);
              miniJs.output.push(result);
              break;
            case "literal":
              // console.log(chalk.yellow.bold("      Printing Literal:"));
              // console.log(chalk.yellow("         currentNode:"), currentNode);
              let literalstring = currentNodeMetaData.toPrint.join(" ");
              result = stringSanitizeforFinalOutput(literalstring);
              miniJs.output.push(result);
              break;
            default:
              console.log(chalk.red("      Unknown to_print type"));
          }
          break;
        default:
          console.log(chalk.red("   Unknown currentNode Type"));
          console.log(chalk.yellow("         currentNode:"), currentNode);
      }
    }

    console.log(chalk.blue("Stack Memory:"));

    let x = miniJs.memory.stack.map((item) => ({
      Name: item.name,
      Value: item.value || item.address, // replace property1 with the actual property name
      // replace property1 with the actual property name
    }));

    console.table(x);

    console.log(chalk.blue("Heap Memory:"));

    let y = Array.from(miniJs.memory.heap.entries()).map(([key, value]) => ({
      Address: key,
      Value: value.value,
    }));

    console.table(y);

    return miniJs;
  } catch (error) {
    console.log("error:", error);
  }
}

function runFile(filePath) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(`Error reading file: ${filePath}`);
      console.error(err);
      return;
    }

    let { output } = interpretMiniJs(data);
    output.forEach((element) => {
      console.log(element);
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
