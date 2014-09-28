var fs = require('fs');
var redis = require("redis"),
client = redis.createClient();

var async = require('async');

client.on("error", function (err) {
    console.log("Error " + err);
});

function Util() {
    
}

Util.indexWordsInFile=function(file,callback){
    var index = {};
    async.waterfall([
        function(cb){
            fs.readFile(file, 'utf8', cb); // Reads the file to be indexed
        },
        function(data,cb){
            fs.readFile("common_words.json", 'utf8', function(err, common_words){ // Fetched the list of common words not to be indexed
                cb(err,common_words,data);
            });
        },
        function(common_word,data,cb){
            data.replace(/[^\w\s]/gi, '').split(" ").forEach(function(word){ // Cleans up txt file, removing the symbols and creating an array of words to be indexed
                if (common_word.indexOf(word) == -1) {
                    if (index[word] == undefined) {
                        index[word] = 1;
                    }
                    else{
                        index[word] += 1;
                    }
                }
            });
            cb(null,index);
        },
        function(index,cb) {
            for (var key in index) {
                var present = false;
                if (index.hasOwnProperty(key)) {
                    client.zadd("program:word:"+key,index[key],file); // Creates a Redis Sorted Set for each word to be indexed
                    client.sadd("program:file:"+file,key); // Creates a Redis Set for each file which contains the list of words indexed
                }
            }
            cb(null,index);
        }
    ], callback);
}

Util.searchWord = function(word,callback){
    async.waterfall([
        function(cb){
            client.zrange("program:word:"+word,"0","-1","withscores", function (err, replies) { // Fetched the index from Redis for a particular word
                cb(err,replies);
            });
        },
        function (replies,cb) {
            var files = [];
            var curr = null;
            replies.forEach(function (reply, i) { // Splits the reply into file where the word is present and its occurance
                if (i % 2 == 0) {
                    curr = { file : reply };
                }
                else{
                    curr.occurance = parseInt(reply);
                    files.push(curr);
                }                
            });
            cb(null,files);
        }
        ], callback);
}

Util.deleteIndex = function(file,callback){
    async.waterfall([
        function(cb){
            client.smembers("program:file:"+file, function (err, replies) { // Fetches the set of words present in that particular file 
                cb(err,replies);
            });
        },
        function(replies,cb){
            async.each(replies, function( word, cb2) {
                client.zrem("program:word:"+word, file); // Removes the Sorted Set entry for that particular file which matches the file name
                cb2();
            }, function(err){
                cb(err,replies);
            });
        },
        function(replies,cb){
            client.del("program:file:"+file); // Removes the Set which contains the words which were indexed for that particular file
            cb(null,replies);
        }
    ],callback);
}
    

module.exports = Util;