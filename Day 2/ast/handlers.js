import { isAllDigits } from "./utility.js";
import { findTokenDataType, findTokenValue } from "./tokens-find.js";

// Helper function to consume tokens and return a metadata object for variable declarations
function ParseVariableStatement(tokens, index, kind) {
  // // Node for variable declaration
  const declarationNode = {
    nodeType: "VariableDeclaration",
    metaData: {
      name: tokens[index + 1],
      // scope: scope, // assuming all variables are global for this example
      // value: kind === "var" ? undefined : ReferenceError(kind),
      value: undefined,
      kind: kind,

      dataType: findTokenDataType(tokens, index),
    },
  };

  // Node for variable assignment
  const assignmentNode = {
    nodeType: "VariableAssignment",
    metaData: {
      name: tokens[index + 1],
      dataType: findTokenDataType(tokens, index),

      value: findTokenValue(tokens, index),
    },
  };

  return {
    declarationNode,
    assignmentNode,
    newIndex: index + 4,
  };
}

// Helper function to consume tokens and return a metadata object for print statements
function handlePrintStatement(index, tokens) {
  const node = {
    nodeType: "PrintStatement",
    metaData: {
      toPrint: [], // to be filled with the printed value or expression
    },
  };
  index += 2; // Move past 'print' and '(' tokens

  while (tokens[index] !== ")") {
    node.metaData.toPrint.push(tokens[index]);
    index++;
  }

  //taking care that print(1234) does not get treated as variable

  node.metaData.to_print =
    node.metaData.toPrint.length === 1 && !isAllDigits(node.metaData.toPrint)
      ? "variable"
      : "literal";

  return { node, newIndex: index + 1 }; // +1 to move past the closing ')'
}

function ReferenceError(kind) {
  return `ReferenceError: Cannot access '${kind}' before initialization`;
}

export { handlePrintStatement, ParseVariableStatement };
