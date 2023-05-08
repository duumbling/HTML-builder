const path = require("path");
const {
  readdir,
  mkdir,
  copyFile,
  access,
  unlink,
} = require("node:fs/promises");

const copyRecursive = async (src, dest) => {
  try {
    await access(dest);
  } catch (e) {
    await mkdir(dest);
  }

  try {
    const destfiles = await readdir(dest);
    destfiles.forEach(async (file) => {
      try {
        await unlink(path.join(dest, file));
      } catch (e) {
        console.log(e);
      }
    });

    const srcfiles = await readdir(src);
    srcfiles.forEach(async (file) => {
      try {
        await copyFile(path.join(src, file), path.join(dest, file));
      } catch (e) {
        console.log(e);
      }
    });
  } catch (e) {
    console.log(e);
  }
};

copyRecursive(
  path.resolve(__dirname, "files"),
  path.resolve(__dirname, "files-copy")
);
