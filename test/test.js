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
    });

    describe('Given a valid set of yaml file', function(){
        it('should compile severals yaml into a single JSON object', function(done){
            yamlBuilder.configure(__dirname).compile(function(err, result){
                should.not.exist(err);
                result.should.be.an.Object(); 
                should.not.exist(result.definitions);
                done();
            });
        });

        it('should not have a defintion object', function(done){
            yamlBuilder.configure(__dirname).compile(function(err, result){
                should.not.exist(err);
                result.should.be.an.Object(); 
                should.not.exist(result.definitions);
                done();
            });
        });
    });
});
