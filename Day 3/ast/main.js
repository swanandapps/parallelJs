import { handlePrintStatement, ParseVariableStatement } from "./handlers.js";
import { Memory } from "../core/memory.js";
function createAST(tokens) {
  // Initialize an array to hold our AST nodes
  const ast = [];

  //get a token
  // switch cases: run typecheck, isVariable()
  //parse token and generate node
  //push node to ast
  //push some nodes to memory

  // Loop over the tokens and create AST nodes based on token patterns
  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];

    switch (token) {
      //show em a better way of doing this typecheck.js-
      case "var":
      case "let":
      case "const":
        // console.log("var declaration found");
        //we are geeting two nodes here
        const {
          declarationNode: nodeDeclaration,
          assignmentNode: nodeAssignment,
          newIndex: newIndexLet,
        } = ParseVariableStatement(tokens, i, token);
        ast.push(nodeAssignment);
        ast.unshift(nodeDeclaration);
        //1st phase of memory
        //Hoisting implementation

        Memory.write({ ...nodeDeclaration.metaData });

        i = newIndexLet - 1; // -1 because the loop will increment i
        break;

      case "print":
        const { node: nodePrint, newIndex: newIndexPrint } =
          handlePrintStatement(i, tokens);
        ast.push(nodePrint);
        i = newIndexPrint - 1;
        break;

      default:
        // Code for handling unknown tokens
        break;
    }
  }

  return ast;
}

export { createAST };
