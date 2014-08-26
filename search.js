/**
 * Created by Pranesh on 26/8/14.
 */

if(process.argv.length < 3 ){
    console.log("Invalid Arguments.  Usage : node index.js <word1> <word2> ...");
    process.exit(1);
}

var words = process.argv;
words.splice(0,2);

var fs = require('fs');
var index = null;
var notToIndexWords = ["a", "an", "is", "index", "it", "for", "in"];

fs.readFile('index.json', function read(err, data) {
    if (err) {
        throw err;
    }
    index = JSON.parse(data);
    words.forEach(function(word){
        if(notToIndexWords.indexOf(word) == -1){
            if(index.hasOwnProperty(word)){
                var obj = index[word][0];
                var filename = obj.file;
                var count = obj.count;
                console.log("Found in:");
                console.log("         File : "+filename+" Count : "+count);
            }
            else{
                console.log("No Matched Found");
            }
        }
        else{
            console.log("'"+ word + "' ignored as it is a very common word");
        }
    });
});

