const fs = require("fs");
const path = require("path");

class Generator {
  constructor() {
    this.templateDir = "./templates/";
    this.bindings = {
      "make:model": [(dir) => "./src/models/", ""],
      "make:resource": [(dir) => "./src/resources/", "Resource"],
      "make:request": [(dir) => "./src/requests/", "Request"],
      "make:controller": [(dir) => "./src/controllers/", "Controller"],
      "make:middleware": [(dir) => "./src/middleware/", ""],
      "make:seeder": [(dir) => "./src/database/seeders/", ""],
      "make:job": [(dir) => "./src/jobs/", "Job"],
      "make:schedule": [(dir) => "./src/schedules/", "Schedule"],
      "make:observer": [(dir) => "./src/observers/", "Observer"],
    };

    this.crudRequests = ["store", "destroy", "show", "update"];

    this.crudResources = ["index", "store", "destroy", "show", "update"];
  }

  createDirectoryIfNotExist(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  generate(command, name, action) {
    if (command == "make:crud") this.generateCrud(command, name);
    else this.generateSingleFile(command, name, action);
  }

  generateCrud(command, name) {
    this.generateController(name);
    this.generateModel(name);
    this.generateService(name);
    this.generateRequests(name);
    this.generateResource(name);
  }

  generateController(name) {
    let template = fs.readFileSync(
      `${this.templateDir}crud.controller.ts`,
      "utf8"
    );
    template = template.replace(/templateName/g, name);

    const dir = "./src/controllers/";
    const filePath = path.join(dir, `${name}Controller.ts`);
    this.createDirectoryIfNotExist(dir);
    fs.writeFileSync(filePath, template);
    console.log(`${name} controller generated`);
  }
  generateModel(name) {
    let template = fs.readFileSync(`${this.templateDir}model.ts`, "utf8");
    template = template.replace(/templateName/g, name);

    const dir = "./src/models/";
    const filePath = path.join(dir, `${name}.ts`);
    this.createDirectoryIfNotExist(dir);
    fs.writeFileSync(filePath, template);
    console.log(`${name} model generated`);
  }
  generateService(name) {
    let template = fs.readFileSync(
      `${this.templateDir}crud.service.ts`,
      "utf8"
    );
    template = template.replace(/templateName/g, name);

    const dir = "./src/services/";
    const filePath = path.join(dir, `${name}Service.ts`);
    this.createDirectoryIfNotExist(dir);
    fs.writeFileSync(filePath, template);
    console.log(`${name} service generated`);
  }
  generateRequests(name) {
    for (const request of this.crudRequests) {
      let template = fs.readFileSync(
        `${this.templateDir}requests/crud.${request}Request.ts`,
        "utf8"
      );
      template = template.replace(/templateName/g, name);

      const dir = `./src/requests/${name.toLowerCase()}`;
      const filePath = path.join(
        dir,
        `${name}${this.capitalizeFirstLetter(request)}Request.ts`
      );
      this.createDirectoryIfNotExist(dir);
      fs.writeFileSync(filePath, template);
      console.log(`${name} ${request} request generated`);
    }
  }
  generateResource(name) {
    for (const resource of this.crudResources) {
      let template = fs.readFileSync(
        `${this.templateDir}resources/crud.${resource}Resource.ts`,
        "utf8"
      );
      template = template.replace(/templateName/g, name);

      const dir = `./src/resources/${name.toLowerCase()}`;
      const filePath = path.join(
        dir,
        `${name}${this.capitalizeFirstLetter(resource)}Resource.ts`
      );
      this.createDirectoryIfNotExist(dir);
      fs.writeFileSync(filePath, template);
      console.log(`${name} ${resource} resource generated`);
    }
  }
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  generateKernalFile(dir,make_template) {
    if (!fs.existsSync(`./src/${dir}/kernal.ts`)) {
      this.createDirectoryIfNotExist(`./src/${dir}`);

      let template = fs.readFileSync(
        `./templates/${make_template}`,
        "utf8"
      );
      fs.writeFileSync(`./src/${dir}/kernal.ts`, template);
    }
  }

  generateSingleFile(command, name, action) {
    const binding = this.bindings[command];
    const commandArgs = this.getCommandFileName(command);

    if (!binding) {
      console.error("Invalid command");
      return;
    }

    const [getDir, postFix] = binding;

    let template = fs.readFileSync(
      `${this.templateDir}${commandArgs[1]}.ts`,
      "utf8"
    );
    template = template.replace(/templateName/g, name);
    let ActionName = "";
    if (action) {
      template = template.replace(/actionName/g, action);
      ActionName = this.capitalizeFirstLetter(action);
      if (postFix && postFix == "Observer") this.generateKernalFile('observers','observer.kernal.ts');
    }
    if (postFix && postFix == "Schedule") this.generateKernalFile('schedules','schedule.kernal.ts');

    const filePath = path.join(getDir(""), `${name}${ActionName}${postFix}.ts`);
    this.createDirectoryIfNotExist(getDir(""));

    fs.writeFileSync(filePath, template);
    console.log(`${name} ${commandArgs[1]} generated`);
  }

  getCommandFileName(command) {
    return command.split(":");
  }
}

class Routes {
  listRoutes() {
    const apiRoutes = fs.readFileSync("./src/routes/api.ts", "utf-8");

    // Match all non-commented lines using regex
    const nonCommentedLines = apiRoutes
      .split("\n")
      .filter((line) => !line.trim().startsWith("//"))
      .join("\n");

    // Match all route declarations using regex
    const routeMatches = nonCommentedLines.matchAll(
      /router\.(get|post|put|delete|patch|options|head|path)\(['"](.+?)['"](?:,\s*(.+?))?/g
    );

    // Loop through all matches and log the routes
    let data = [];
    for (const match of routeMatches) {
      const method = match[1];
      const path = match[2];
      const handler = match[3] || "";

      data.push({
        method: method.toUpperCase(),
        path: "api" + path,
      });

      //console.log(`${method.toUpperCase()}   api${path}`);
    }

    const regex = /(?<=path: ')[^']+(?=')/g;
    const matches = nonCommentedLines.match(regex);
    if (matches && matches.length > 0) {
      for (const match of matches) {
        data.push({ method: "GET", path: "api" + match });
        data.push({ method: "POST", path: "api" + match });
        data.push({ method: "GET", path: "api" + match + "/:id" });
        data.push({ method: "PUT", path: "api" + match + "/:id" });
        data.push({ method: "DELETE", path: "api" + match + "/:id" });
      }
    }

    console.table(data, ["method", "path"], ["left", "left"]);
  }
}

// get command-line arguments
const args = process.argv.slice(2);

// parse command and filename
const [command, name, action] = args;

// check if command is valid and filename is provided
const generator = new Generator();

const routes = new Routes();

switch (command) {
  case "route:list":
    routes.listRoutes();
    break;
  case "make:observer":
    if (name && action) {
      if (
        [
          "save",
          "remove",
          "update",
          "insertMany",
          "deleteOne",
          "deleteMany",
          "findOneAndUpdate",
        ].includes(action)
      ) {
        generator.generate(command, name, action);
      } else {
        console.error(
          "Invalid action is provided. allowed: save, update, findOneAndUpdate, insertMany,remove, deleteOne, deleteMany"
        );
      }
    } else {
      console.error("Model name or action not provided");
    }
    break;
  case "make:job":
  case "make:schedule":
  case "make:seeder":
  case "make:model":
  case "make:resource":
  case "make:request":
  case "make:controller":
  case "make:crud":
  case "make:middleware":
    if (name) {
      generator.generate(command, name, action);
    } else {
      console.error("Filename not provided");
    }
    break;
  default:
    console.error("Invalid command");
    break;
}
