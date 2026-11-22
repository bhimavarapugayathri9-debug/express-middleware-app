const fs = require('fs');

const data = "Hello, this is a sample text to demonstrate file operations in Node.js";

// Write data to file
fs.writeFileSync("sample.txt", data, "utf-8");

// Read data from file
const readData = fs.readFileSync("sample.txt", "utf-8");
console.log(readData);

// Append data to file
const data1 = "\nFSD";
fs.appendFileSync("sample.txt", data1, "utf-8");