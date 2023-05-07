const fs = require("fs");
const path = require("path");

const testFolder = path.resolve(__dirname, "secret-folder");
fs.readdir(testFolder, (err, files) => {
  if (err) {
    console.log(err);
  }
  files.forEach((file) => {
    let fullPath = path.resolve(__dirname, "secret-folder", `${file}`);
    if (fs.lstatSync(fullPath).isFile()) {
      console.log(
        path.basename(fullPath).split(".")[0],
        "-",
        path.basename(fullPath).split(".")[1],
        "-",
        fs.statSync(fullPath).size / 1024 + "kb"
      );
    }
  });
});
