const fs = require("fs");
const path = require("path");
const readline = require("readline");

const writeStream = fs.createWriteStream(path.resolve(__dirname, "text.txt"));

var rl = readline.createInterface(process.stdin, process.stdout);
rl.question("Hello! How r u?", (answer) => {
  writeStream.write(`${answer}\n`);
  rl.on("line", (saying) => {
    if (saying.toLowerCase().includes("exit")) {
      rl.close();
    } else {
      writeStream.write(`${saying}\n`);
    }
  });
  rl.on("close", () => {
    console.log("Bye!");
  });
});
