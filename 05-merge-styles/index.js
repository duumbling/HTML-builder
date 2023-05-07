const fs = require("fs");
const path = require("path");

const stylesFolder = path.resolve(__dirname, "styles");
const bundleFolder = path.resolve(__dirname, "project-dist", "bundle.css");
const writeStream = fs.createWriteStream(bundleFolder);

fs.readdir(stylesFolder, (err, files) => {
  if (err) {
    console.log(err);
  }
  files.forEach((file) => {
    let fullPath = path.resolve(__dirname, "styles", `${file}`);
    const readStream = fs.createReadStream(path.resolve(fullPath), {
      encoding: "utf-8",
    });

    if (
      fs.lstatSync(fullPath).isFile() &&
      path.basename(fullPath).split(".")[1] === "css"
    ) {
      readStream.on("data", (chunk) => {
        writeStream.write(`${chunk}\n`);
      });
    }
  });
});
