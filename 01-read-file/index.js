const fs = require("fs");
const path = require("path");

const read = fs.createReadStream(path.resolve(__dirname, "text.txt"), {
  encoding: "utf-8",
});
read.on("data", (chunk) => {
  console.log(chunk);
});
