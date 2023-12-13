import { createAST } from "../ast/main.js";
import { tokenize } from "../lexer/tokenizer.js";

function parse(code) {
  const tokens = tokenize(code);
  console.log("tokens:", tokens);
  const ast = createAST(tokens);

  //1. loop over the tokens
  //2. perform data cleaning

  //based on token type, implement TypeChecking write isArray,isXYZ functions
  //based on type, write handlers, which handles operators, conditions etc
  //based on Type, implement PushTokens which contains complete metadata about a string

  // Parse tokens into a structure (abstract syntax tree)
  // For simplicity, this example does not actually create an AST
  return ast;
}

export { parse };
