const fs = require("fs");
const path = require("path");

const testFolder = path.resolve(__dirname, "secret-folder");
fs.readdir(testFolder, (err, files) => {
  if (err) {
    console.log(err);
  }
  files.forEach((file) => {
    let fullPath = path.resolve(__dirname, "secret-folder", `${file}`);
    fs.stat(fullPath, (err, stats) => {
      if (err) {
        console.log(err);
      }

      if (stats.isFile()) {
        let fileName = file.split(".")[0];
        let fileSize = stats.size;
        let fileEx = file.split(".")[1];
        console.log(`${fileName} - ${fileEx} - ${fileSize}b`);
      }
    });
  });
});
