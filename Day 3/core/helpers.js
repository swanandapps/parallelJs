// Helper method to check if a node is uninitialized
function isUninitialized(node) {
  return (
    (node.kind === "let" || node.kind === "const") &&
    node.value === undefined &&
    node.address === undefined
  );
}

// Helper method to get value from heap
function getHeapValue(node, heap) {
  const heapNode = heap.get(node.address);
  console.log("heapNode:", heapNode);
  return heapNode ? heapNode.value : "no value found in heap";
}
// Determines if a data type is a primitive
function isPrimitive(dataType) {
  return ["number", "string", "boolean", "undefined", "symbol"].includes(
    dataType
  );
}
function generateMemoryAddress() {
  // Generate a random number between 0x1000 (4096) and 0xFFFF (65535)
  let address = Math.floor(Math.random() * (0xffff - 0x1000 + 1)) + 0x1000;
  // Convert it to a hexadecimal string
  return "0x" + address.toString(16).toUpperCase();
}

export { isUninitialized, getHeapValue, isPrimitive, generateMemoryAddress };
