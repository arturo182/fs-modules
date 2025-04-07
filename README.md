# Fluxscape Module Template

A basic template for creatin a Fluxscape module.

## Creating a Module

Use the `create-module.js` script to generate a new module:

```sh
  $ node create-module.js
```

This will copy the `template` directory and configure it with the data provided to the script.

## Generating module libraries

You can generate the libraries using the `generate-libraries.js` script. The libraries need to be hosted on a server, you must provide the base url of the server to the script:

```sh
  $ node generate-libraries.js http://www.example.com/
```

This will iterate all modules in the repo, build the release script on them, then copy the artifacts and generate the library json file. The result will be available in the `static` directory.
