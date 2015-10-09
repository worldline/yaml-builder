'use strict';

var _        = require('lodash');
var async    = require('async');
var fs       = require('fs');
var jsonRefs = require('json-refs');
var walk     = require('walk');
var yaml     = require('js-yaml');

// Add the base path to the root of every spec
var inlineBasePath = function(swaggerSpec, cb){

  // Copy descriptor basePath into its individual paths, and removes it.
  // It allows descriptors to have different pathPath, without conflicts
  var basePath = swaggerSpec.basePath || '';
  if (basePath[0] !== '/') {
    basePath = '/' + basePath;
  }
  if (basePath[basePath.length-1] === '/') {
    basePath = basePath.slice(0, -1);
  }

  for (var route in swaggerSpec.paths) {
    var newRoute = basePath + (route[0] !== '/' ? '/' : '') + route;
    if (newRoute !== route) {
      swaggerSpec.paths[newRoute] = swaggerSpec.paths[route];
      delete swaggerSpec.paths[route];
    }
  }

  delete swaggerSpec.basePath;

  return cb(null, swaggerSpec);
};


var resolveRefs = function(swaggerSpec, cb){
  jsonRefs.resolveRefs(swaggerSpec, {}, function(err, data){
    return cb(err, data);
  });
};

var parseYaml = function(file, cb){
    try{
        return cb(null, yaml.safeLoad(file, yaml.DEFAULT_SAFE_SCHEMA));
    }
    catch(e){
        return cb(new Error('parse error: ' + e.message));
    }
};

var merge = function(accumulator, yaml, cb){
    return cb(null, _.merge(accumulator, yaml));
};

var loadYaml = function(filePath, accumulator, cb){
    async.waterfall([
        async.apply(fs.readFile, filePath), 
        async.apply(parseYaml),
        async.apply(inlineBasePath),
        async.apply(resolveRefs),
        async.apply(merge, accumulator)
    ], function(err){
        if(err && process.env.NODE_DEBUG){
            console.log('Error while handling the file ' + filePath + ': ' + err);
        }
        return cb();
    });
     
};

var isLoadable = function(filename, filenameFilter){
    if(filename.match(/\.y[a]?ml/)){
        var name = filename.substring(0, filename.indexOf('.'));
        if(_.isArray(filenameFilter)){
            return _.contains(filenameFilter, name);
        }else if(_.isRegExp(filenameFilter)){
            return filenameFilter.exec(name);
        }else{
            return true;
        }
    }else{
       return false;
    }

};

module.exports = {

    root: '.',

    configure: function(root, template, filter){
        if(root && ! _.isString(root)){
            throw new Error('root must be a string');
        }

        this.root = root || this.root;

        if(template && ! _.isObject(template)){
            throw new Error('template must be an object');
        }

        this.template = template; 

        if(filter && ! _.isRegExp(filter) && ! _.isArray(filter)){
            throw new Error('filter must be an array or a regexp');
        }

        this.filter = filter;

        return this;
    },

    compile: function(cb){

        // Callback check
        if(!_.isFunction(cb)){
            throw new Error('Compile requires at least a callback function');
        }

        var walker = walk.walk(this.root);
        var accumulator = {};
        walker.on('file', function(root, fileStats, next){
           if(isLoadable(fileStats.name, this.filter)){
                return loadYaml(root + '/' + fileStats.name, accumulator, next);
           }else{
                return next();
           }        
        }.bind(this)); 

        // Triggered only when the entire file tree has been walked
        walker.on('end', function(){
            delete accumulator.definitions;
            if(this.template){
                _.merge(accumulator, this.template);
            }
            cb(null, accumulator);
        }.bind(this));
    }
};
