// Import necessary helper functions from helpers.js file
import { getHeapValue, generateMemoryAddress } from "./helpers.js";

// Step 1: Define the MemoryImp class
class MemoryImp {
  // Constructor to initialize the memory with stack and heap
  constructor() {
    this.stack = []; // Stack array to hold simple memory items like variables
    this.heap = new Map(); // Heap map to manage more complex memory items like objects and arrays
  }

  // Step 2: Define the read method to read values from memory
  read(nodeName) {
    // Find a memory node in the stack with the given name
    const memoryNode = this.stack.find((item) => item.name === nodeName);

    //2 cases of memorynode

    // If
    if (memoryNode.value === undefined) {
      let error = {};
      error.value =
        memoryNode.kind === "var"
          ? "undefined"
          : `Reference Error: Cannot Access '${memoryNode.kind}' before Initialization`;

      return error;
    }

    // Return the node value directly if it's primitive, otherwise get the value from the heap
    return getHeapValue(memoryNode, this.heap);
  }

  // Step 4: Define AssignValue method to assign new values to a node
  write(node, newval, scope) {
    // Find the node name in the stack

    // Try to find the memory node in the stack

    // two operations
    //1. Create
    //2. Update
    let memoryNode = this.stack.find((item) => item.name === node.name);
    // If the memory node doesn't exist, add it
    if (!memoryNode) {
      this._createMemoryNode(node);
    } else {
      this._updateMemoryNode(memoryNode, node, newval);
    }
  }

  _createMemoryNode(node) {
    //shallow copy
    let memoryNode = { ...node };
    memoryNode.value = undefined;
    this.stack.push(memoryNode);
  }

  _updateMemoryNode(memoryNode, node, newval) {
    // If non-primitive:
    // Generate a new memory address
    let address = generateMemoryAddress();
    // Set the memory node value to the new value
    memoryNode.value = address;
    // Update the node with the new value
    node.value = newval;
    // Log the new value for debugging purposes
    console.log("newval:", newval);
    // Store the node in the heap with the new address
    this.heap.set(address, node);
    // Update the memory node with the address reference
    // Update the memory node with the current scope
    // memoryNode.scope = scope;
  }

  // Other methods can be added here as needed...
}

// Step 6: Create an instance of the MemoryImp class
const Memory = new MemoryImp();

// Step 7: Export the Memory instance for use in other parts of the application
export { Memory };
