# yaml-builder

| Concatenate and inline reference of several swagger yaml specs

```js
var builder =  require('yaml-builder');

var root = '/controller';
var template = { info: { version: '2.1', description: 'An amazing webapp'}, basePath: '/'};
var filter = /api/;

builder.configure(root, template, filter).compile(function(err, result){

    // Display the compiled swaggerize spec of your server
    console.log(result);
});
```

## Installation
```js
$ npm install --save-dev yaml-builder
```
## Features

* Find yaml in tree directory structure
* Inline the references and base paths to avoid collisions
* Concatenate the files into a single one
* Result overriding using a template
* Filename filtering

## API
### configure([root], [template], [filter])

Configure the builder using the provided parameter:

* `root`: the root folder to find yaml files, default is the current folder
* `template`: an Object template to override attributes after the compilation process
* `filter`: a filter to whitelist filenames, can be an array of exact filename or a RegExp 

Return the builder object.

### compile(callback)

Compile all the yaml files in a directory and its sub folders.

* `callback`: a `function(err, result)` to callback when the compilation is over
