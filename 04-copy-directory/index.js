const fs = require("fs");
const path = require("path");

const copyRecursive = (src, dest) => {
  //true if path exists
  const exist = fs.existsSync(src);
  //true if object is file or directory
  const stats = exist && fs.statSync(src);
  //true if object is direcrory
  const isDirectory = stats && stats.isDirectory();
  //if object exists and its a directory
  if (isDirectory) {
    //create destination directory if destination directory doesn't exist already
    if (!fs.existsSync(dest)) fs.mkdirSync(dest);
    //copy all files from start directory to destination directory
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursive(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
    //if objext exists and its a file
  } else {
    //create destnation file if destinationn file doens't exist
    if (!fs.existsSync(dest)) fs.copyFileSync(src, dest);
  }
};

copyRecursive(
  path.resolve(__dirname, "files"),
  path.resolve(__dirname, "files-copy")
);
