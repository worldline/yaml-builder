'use strict';

describe('', function(){

    var should      = require('should');
    var yamlBuilder = require('..');
    

    describe('Given a bad set of parameters', function(){
        it('should throw an error if there is no parameter', function(done){
            (function(){
                yamlBuilder.compile();   
            }).should.throw(Error);
            done();
        });

        it('should throw an error if the callback is not a function', function(done){
            (function(){
                yamlBuilder.compile('callback');   
            }).should.throw(Error);
            done();
        })

        it('should throw an error if root is not a string', function(done){
            (function(){
                yamlBuilder.configure({});
            }).should.throw(Error);
            done();
        });

        it('should throw an error if template is not an object', function(done){
            (function(){
                yamlBuilder.configure('test', 'test');
            }).should.throw(Error);
            done();
        });

        it('should throw an error if filter is not an array or regexp', function(done){
            (function(){
                yamlBuilder.configure('test', {}, {});
            }).should.throw(Error);
            done();
        });
 
 
    });

    describe('Given a valid set of yaml file', function(){
        it('should compile severals yaml into a single JSON object', function(done){
            yamlBuilder.configure(__dirname + '/fixtures/valid').compile(function(err, result){
                should.not.exist(err);
                result.should.be.an.Object(); 
                result.paths['/api/v1/orders'].should.be.an.Object();
                result.paths['/api/v1/users'].should.be.an.Object();
                done();
            });
        });

        it('should not have a defintion object', function(done){
            yamlBuilder.configure(__dirname + '/fixtures/valid').compile(function(err, result){
                should.not.exist(err);
                should.not.exist(result.definitions);
                done();
            });
        });

        it('should handle base path without starting slash', function(done){
            yamlBuilder.configure(__dirname + '/fixtures/valid-basepath-1').compile(function(err, result){
                should.not.exist(err);
                result.should.be.an.Object(); 
                result.should.not.be.empty();
                done();
            });
        }); 

        it('should handle base path with a trailing slash', function(done){
            yamlBuilder.configure(__dirname + '/fixtures/valid-basepath-2').compile(function(err, result){
                should.not.exist(err);
                result.should.be.an.Object(); 
                result.should.not.be.empty();
                done();
            });
        }); 

        it('should override result using template', function(done){
            var template = {info: {version: '2.0', title: 'overrided title'}, basePath: '/home'};
             
            yamlBuilder.configure(__dirname + '/fixtures/valid', template).compile(function(err, result){
                should.not.exist(err);
                result.info.version.should.equal('2.0');
                result.basePath.should.equal('/home');
                done();
            });
        });

    });

    describe('Given a unvalid Yaml file', function(){
        it('should compile the valid yaml file(s)', function(done){
            yamlBuilder.configure(__dirname + '/fixtures/parse-error').compile(function(err, result){
                should.not.exist(err);
                result.should.be.an.Object(); 
                result.should.not.be.empty();
                done();
            });
        });

        it('should log an error if NODE_DEBUG is enabled', function(done){
            process.env.NODE_DEBUG = true;
            yamlBuilder.configure(__dirname + '/fixtures/parse-error').compile(function(err, result){
                should.not.exist(err);
                result.should.be.an.Object(); 
                result.should.not.be.empty();
                done();
            });
        });
 
    });
});
