//06-build-page
const fs = require("fs");
const path = require("path");

//функция для создания папки project-dist
function createDir() {
  fs.mkdir(path.resolve(__dirname, "project-dist"), (err) => {
    if (err) {
      console.log("Ошибка при создании папки:", err);
      return;
    }
    console.log("Папка project-dist успешно создана!");
  });
}

//функция для замены тегов в файле template.html
function replaceTags() {
  //читаем содержимое файла template.html
  fs.readFile(path.resolve(__dirname, "template.html"), "utf8", (err, data) => {
    if (err) {
      console.log("Ошибка при чтении файла template.html:", err);
      return;
    }
    //читаем названия файлов в папке components
    fs.readdir(path.resolve(__dirname, "components"), (err, files) => {
      if (err) {
        console.log("Ошибка при чтении папки components:", err);
        return;
      }
      //перебираем названия файлов из папки components
      files.forEach((file) => {
        //заменяем теги с названием файла на содержимое файла
        data = data.replace(
          new RegExp("{{" + file.split(".")[0] + "}}", "g"),
          `\n${fs.readFileSync(
            path.resolve(__dirname, "components", `${file}`),
            "utf8"
          )}`
        );
      });
      //сохраняем результат в project-dist/index.html
      fs.writeFile(
        path.resolve(__dirname, "project-dist/index.html"),
        data,
        (err) => {
          if (err) {
            console.log("Ошибка при сохранении файла index.html:", err);
            return;
          }
          console.log("Файл index.html успешно создан!");
        }
      );
    });
  });
}

//функция для сбора стилей в файл style.css
function collectStyles() {
  //читаем названия файлов в папке styles
  fs.readdir(path.resolve(__dirname, "styles"), (err, files) => {
    if (err) {
      console.log("Ошибка при чтении папки styles:", err);
      return;
    }
    let styleData = "";
    //перебираем названия файлов из папки styles
    files.forEach((file) => {
      //читаем содержимое файла и добавляем в переменную styleData
      styleData += fs.readFileSync(
        path.resolve(__dirname, "styles", `${file}`),
        "utf8"
      );
    });
    //сохраняем переменную styleData в файл style.css
    fs.writeFile(
      path.resolve(__dirname, "project-dist/style.css"),
      styleData,
      (err) => {
        if (err) {
          console.log("Ошибка при сохранении файла style.css:", err);
          return;
        }
        console.log("Файл style.css успешно создан!");
      }
    );
  });
}

//функция для копирования папки assets в project-dist/assets
function copyAssets() {
  fs.mkdir(path.resolve(__dirname, "project-dist", "assets"), (err) => {
    if (err) {
      if (err.code === "EEXIST") {
        console.log(
          "Папка assets уже существует в project-dist, файлы будут перезаписаны"
        );
      } else {
        console.log("Ошибка при создании папки assets в project-dist:", err);
        return;
      }
    }
    //читаем названия файлов и папок в папке assets
    fs.readdir(
      path.resolve(__dirname, "assets"),
      { withFileTypes: true },
      (err, files) => {
        if (err) {
          console.log("Ошибка при чтении папки assets:", err);
          return;
        }
        //перебираем названия файлов и папок из папки assets
        files.forEach((file) => {
          //проверяем тип файла или папки
          if (file.isFile()) {
            //копируем файл в project-dist/assets
            fs.copyFileSync(
              path.resolve(__dirname, "assets", `${file.name}`),
              path.resolve(__dirname, "project-dist", "assets", `${file.name}`)
            );
          } else if (file.isDirectory()) {
            //если это папка, то создаем ее в project-dist/assets и рекурсивно копируем содержимое
            fs.mkdir(
              path.resolve(__dirname, "project-dist", "assets", `${file.name}`),
              { recursive: true },
              (err) => {
                if (err) {
                  console.log(
                    "Ошибка при создании папки `${file.name}` в project-dist/assets:",
                    err
                  );
                  return;
                }
                //рекурсивно копируем содержимое папки
                copyAssetsRecursive(
                  path.resolve(__dirname, "assets", `${file.name}`),
                  path.resolve(
                    __dirname,
                    "project-dist",
                    "assets",
                    `${file.name}`
                  )
                );
              }
            );
          }
        });
        console.log("Папка assets успешно скопирована в project-dist!");
      }
    );
  });
}

//рекурсивная функция для копирования содержимого папки
function copyAssetsRecursive(source, target) {
  fs.readdir(source, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.log("Ошибка при чтении папки ${source}:", err);
      return;
    }
    files.forEach((file) => {
      if (file.isFile()) {
        fs.copyFileSync(
          path.resolve(source, `${file.name}`),
          path.resolve(target, `${file.name}`)
        );
      } else if (file.isDirectory()) {
        fs.mkdir(path.resolve(target, `${file.name}`), (err) => {
          if (err) {
            console.log(
              `Ошибка при создании папки ${file.name} в ${target}:`,
              err
            );
            return;
          }
          copyAssetsRecursive(
            path.resolve(source, `${file.name}`),
            path.resolve(target, `${file.name}`)
          );
        });
      }
    });
  });
}
//запускаем функции по очереди
if (!fs.existsSync(path.resolve(__dirname, "project-dist"))) createDir();

replaceTags();
collectStyles();
copyAssets();
