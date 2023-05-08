const path = require("path");
const {
  mkdir,
  access,
  readFile,
  readdir,
  writeFile,
  rm,
  stat,
  copyFile,
} = require("node:fs/promises");

const templatePath = path.resolve(__dirname, "template.html");
const componentsPath = path.resolve(__dirname, "components");
const stylesPath = path.resolve(__dirname, "styles");
const assetsPath = path.resolve(__dirname, "assets");
const projectDistIndexPath = path.resolve(__dirname, "project-dist/index.html");
const projectDistStylePath = path.resolve(__dirname, "project-dist/style.css");
const projectDistAssetsPath = path.resolve(__dirname, "project-dist", "assets");

//функция для создания папки project-dist
const createDir = async () => {
  await mkdir(path.resolve(__dirname, "project-dist"));
};

//функция для замены тегов в файле template.html
const replaceTags = async () => {
  try {
    //читаем содержимое файла template.html
    let tempData = await readFile(templatePath, "utf-8");
    //читаем названия файлов в папке components
    let componentsFiles = await readdir(componentsPath);
    //перебираем названия файлов из папки components
    for (const file of componentsFiles) {
      try {
        tempData = tempData.replace(
          new RegExp("{{" + file.split(".")[0] + "}}", "g"),
          `\n${await readFile(path.resolve(componentsPath, `${file}`), "utf8")}`
        );
      } catch (e) {
        console.log(e);
      }
    }
    try {
      //сохраняем результат в project-dist/index.html
      await writeFile(projectDistIndexPath, tempData);
      console.log("Файл index.html успешно создан!");
    } catch (e) {
      console.log("Ошибка при сохранении файла index.html:", e);
    }
  } catch (e) {
    console.log(e);
  }
};

//функция для сбора стилей в файл style.css
const collectStyles = async () => {
  //читаем названия файлов в папке styles
  try {
    const sylesFiles = await readdir(stylesPath);
    let styleData = "";
    //перебираем названия файлов из папки styles
    for (let file of sylesFiles) {
      styleData += await readFile(path.resolve(stylesPath, `${file}`), "utf8");
    }
    // сохраняем переменную styleData в файл style.css
    try {
      await writeFile(projectDistStylePath, styleData);
      console.log("Файл style.css успешно создан!");
    } catch (e) {
      console.log("Ошибка при сохранении файла style.css:", e);
    }
  } catch (e) {
    console.log("Ошибка при чтении папки styles:", e);
  }
};

//функция для копирования папки assets в project-dist/assets
const copyAssets = async (src, dest) => {
  await mkdir(dest, { recursive: true });

  const files = await readdir(src);
  for (const file of files) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    const stats = await stat(srcPath);
    if (stats.isDirectory()) {
      await copyAssets(srcPath, destPath);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
};

//запускаем функции по очереди
const checkIfExists = async () => {
  try {
    await access(path.resolve(__dirname, "project-dist"));
  } catch (e) {
    await createDir();
    console.log("Папки project-dist не существует! Она будет создана");
  }

  const destExists = await access(projectDistAssetsPath)
    .then(() => true)
    .catch(() => false);

  if (destExists) {
    console.log(`Removing ${projectDistAssetsPath}`);
    await rm(path.resolve(projectDistAssetsPath), { recursive: true });
  }

  await replaceTags();
  await collectStyles();
  await copyAssets(assetsPath, projectDistAssetsPath);
};

checkIfExists();
