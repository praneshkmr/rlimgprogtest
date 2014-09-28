var expect = require("chai").expect;
var util = require("../index");
var fs = require('fs');

describe("Utils", function(){
    describe("#indexWordsInFile()", function(){
       it("should index words from a txt file", function(done){
            var result = {
                "An" : 1,
                "accelerometer" : 1,
                "device" : 1,
                "that" : 1,
                "measures" : 1,
                "proper" : 1,
                "acceleration" :3,
                "Proper" : 1,
                "not" : 1,
                "same" : 1,
                "coordinate" : 1,
                "rate" : 1,
                "change" : 1,
                "velocity" : 1
            }
           util.indexWordsInFile("test\\accelerometer.txt",function(err,words){
                expect(words).to.deep.equal(result);
                done();
            });
       });
       
       it("should not index common words ", function(done){
           util.indexWordsInFile("test\\accelerometer.txt",function(err,words){
                fs.readFile("common_words.json", 'utf8', function(err, common_words){
                    for (var common_word in common_words) {
                        expect(words).to.not.have.property(common_word);
                    }
                    done();
                });
            });
       });
   });
    
    describe("#searchWord()", function(){
        it("should search words from the index ", function(done){
            var result = { file : "test\\accelerometer.txt" , occurance : 3 };
            util.searchWord("acceleration",function(err,files){
                expect(files).to.include(result);
                done();
            });
        });
        
        it("should not search comman words from the index ", function(done){
            util.searchWord("the",function(err,files){
                expect(files).to.be.empty;
                done();
            });
        });
    });
    
    describe("#deleteIndex()", function(){
        it("should delete the index created from a particular file", function(done){
            var result = [
                "An",
                "accelerometer",
                "device",
                "that",
                "measures",
                "proper",
                "acceleration",
                "Proper",
                "not",
                "same",
                "coordinate",
                "rate",
                "change",
                "velocity"
            ]
            util.deleteIndex("test\\accelerometer.txt",function(err,words){
                result.forEach(function(word){
                    expect(words).to.include(word);
                });
                done();
            });
        });
    });
    
});