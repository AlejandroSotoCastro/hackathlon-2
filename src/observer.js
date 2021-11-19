// -	Create an app that monitors a folder on a file system and that notifies you on any changes
// -	Make an UI based installation processes that packages the app and allows you
//      to install it as a Windows service
//   o	with user specified.
//   o	with location of app specified.

const chokidar = require("chokidar");
const readLastLines = require("read-last-lines");
const EventEmitter = require("events").EventEmitter;

//
// //Next, we use read-last-lines module for reading the last line of a file:

// readLastLines
//   .read("path/to/file", 42) // read last 42 lines
//   .then((lines) => console.log(lines));

class Observer extends EventEmitter {
  constructor() {
    super();
    this.ready = false;
  }

  async #eventHandler(type, path) {
    let message = "";
    const date = new Date().toLocaleString();
    switch (type) {
      case "ready":
        this.ready = true;
        message = "Initial scan complete. Ready for changes";
        break;
      case "addDir":
        message = `Directory ${path} has been added`;
        break;
      case "unlinkDir":
        message = `Directory ${path} has been removed`;
        break;
      case "add":
        message = `File ${path} has been added`;
        break;
      case "unlink":
        message = `File ${path} has been removed`;
        break;
      case "change":
        // Get update content of file, in this case is one line
        const updateContent = await readLastLines.read(path, 1);
        message = `${path} has been updated:\n${updateContent}`;
        break;
    }
    if (this.ready) {
      // emit an event when the file has been updated
      this.emit("dir-updated", { message: `[${date}] ` + message });
    }
  }

  #errorHandler(error) {
    // emit an event when error
    this.emit("error", { error: error });
  }

  watchFile(targetDirectory) {
    try {
      console.log(
        `[${new Date().toLocaleString()}] Watching for changes on: ${targetDirectory}`
      );

      var watcher = chokidar.watch(targetDirectory, { persistent: true });

      watcher
        .on("ready", () => {
          this.#eventHandler("ready");
        })

        .on("addDir", (path) => this.#eventHandler("addDir", path))
        .on("unlinkDir", (path) => this.#eventHandler("unlinkDir", path))
        .on("add", (path) => this.#eventHandler("add", path))
        .on("unlink", (path) => this.#eventHandler("unlink", path))
        .on("change", (filePath) => this.#eventHandler("change", filePath))
        .on("error", (error) => this.#errorHandler(`Watcher error: ${error}`));
    } catch (error) {
      this.#errorHandler(`General error: ${error}`);
    }
  }
}

module.exports = Observer;
