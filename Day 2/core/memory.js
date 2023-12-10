import {
  isUninitialized,
  getHeapValue,
  isPrimitive,
  generateMemoryAddress,
} from "./helpers.js";

class MemoryImp {
  constructor() {
    this.stack = [];
    this.heap = new Map(); // Array to hold memory items
  }

  // Read a value by node name
  read(nodeName) {
    const memoryNode = this.stack.find((item) => item.name === nodeName);
    if (!memoryNode) return "no value found";

    if (isUninitialized(memoryNode)) {
      memoryNode.value = `Reference Error: Cannot Access '${memoryNode.kind}' before Initialization`;
      return memoryNode;
    }

    return isPrimitive(memoryNode.dataType)
      ? memoryNode
      : getHeapValue(memoryNode, this.heap);
  }

  // Write a value by key
  write(node) {
    let index = this.stack.findIndex((item) => item.name === node.name);
    // Update existing item if found, or add a new item otherwise
    index >= 0 ? (this.stack[index].value = node.value) : this.stack.push(node);
  }

  //New: Assign a new value to a node coming from AST
  //AST already has the value but in assignment nodes
  AssignValue(node, newval, scope) {
    const nodename = node.name;

    //find the memorynode in stack
    const memoryNode = this.stack.find((item) => item.name === nodename);
    if (!memoryNode) return "Error in assigning value: no memorynode found";

    if (isPrimitive(node.dataType)) {
      //if primitive directly return the value found by ast in parsing phase
      /*value is found in multiple ways
         unless its method, AST already knows the value
        For methods value is known through object wrappers
        */
      memoryNode.value = newval;
    } else {
      //if non primitive
      /*
        this are stored with address as reference
        1. calculate address
        2. prepare node with newval coming from AssignValue(node, result)
        3. set this node in heap with address as key
        issue - if node is reassigned, we will set a new node
         */

      let address = generateMemoryAddress();
      memoryNode.value = newval;
      node.value = newval;
      console.log("newval:", newval);
      this.heap.set(address, node);
      memoryNode.address = address;
    }
    memoryNode.scope = scope;
  }

  // Clear all memory
  clear() {
    this.stack = [];
  }

  // Other methods as needed...
}

const Memory = new MemoryImp();

export { Memory };
