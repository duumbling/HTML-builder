const path = require("path");
const { readdir, lstat } = require("node:fs/promises");
const fs = require("fs");

const stylesFolder = path.resolve(__dirname, "styles");
const bundleFolder = path.resolve(__dirname, "project-dist", "bundle.css");
const writeStream = fs.createWriteStream(bundleFolder);

const merge = async (src) => {
  try {
    const files = await readdir(src);

    files.forEach(async (file) => {
      let fullPath = path.join(src, file);
      const readStream = fs.createReadStream(path.resolve(fullPath), {
        encoding: "utf-8",
      });

      let isFile = await lstat(fullPath).then((data) => data.isFile());
      if (isFile && path.basename(fullPath).split(".")[1] === "css") {
        readStream.on("data", (chunk) => {
          writeStream.write(`${chunk}\n`);
        });
      }
    });
  } catch (e) {
    console.log(e);
  }
};
merge(stylesFolder);
