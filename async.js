const fs = require('fs');

const data = "Hello, this is a sample text to demonstrate file operation in Node.js";

// Write to the file
fs.writeFile("sample1.txt", data, (err) => {
    if (err) {
        return console.log(err.message);
    }

    console.log("Created asynchronous file");

    // Read the file
    fs.readFile("sample1.txt", "utf-8", (err, readData) => {
        if (err) throw err;

        console.log(readData);

        // Append data to the file
        const a = "\nWelcome to sample file";

        fs.appendFile("sample1.txt", a, (err) => {
            if (err) throw err;

            console.log("This file appended");
        });
    });
});

console.log(1);
console.log(2);
console.log("The end of file operation");