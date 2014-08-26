/**
 * Created by Pranesh on 26/8/14.
 */

if(process.argv.length < 3 ){
    console.log("Invalid Arguments.  Usage : node index.js <path to text file>");
    process.exit(1);
}
var filenameFull = process.argv[2];
var filename = process.argv[2].split("\\")[1];
if(!filename.match(/.txt/)){
    console.log("File is not a Text file.  Usage : node index.js <path to text file>");
    process.exit(1);
}
if(filename.match(/.exe/)){
    console.log("Please Specify a Text file not a Binary file.  Usage : node index.js <path to text file>");
    process.exit(1);
}

var fs = require('fs');
var index =  JSON.parse(fs.readFileSync("index.json","utf8")) || {};
var notToIndexWords = JSON.parse(fs.readFileSync("common_words.json"));

//var mongoose = require('mongoose');
//var Schema = mongoose.Schema;
//
//var IndexSchema = new Schema({
//    word : String,
//    files : Array,
//    created_at : Date,
//    updated_at : Date
//});
//mongoose.model( 'IndexSchema', IndexSchema );
//var Index = mongoose.model( 'IndexSchema');
//mongoose.connect( 'mongodb://localhost/rlimgprogtest');



fs.readFile(filenameFull, 'utf8', function(err, data) {
    if (err) throw err;
    data.replace(/[^A-Za-z 0-9 \,\?!@#\$%\^&\*-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '').split(" ").forEach(function(word){
//        (function(word){Index.findOne({ word : word},function(err,word){
//            if(err){
//                console.log("Error Finding words : "+err);
//            }
//            if(word){
//                console.log(word);
//            }
//            else{
//                var i  = new Index({
//                    word : word,
//                    files : [filename.split("\\")]
//                });
//                i.save();
//            }
//        });})(word);
        if(notToIndexWords.indexOf(word)== -1){
            if(index.hasOwnProperty(word)){
                var value = index[word];
                value.forEach(function(obj){
                    if(obj.file == filename){
                        obj.count += 1;
                    }
                    else{
                        value.push({ file : filename , count : 1 });
                    }
                });
            }
            else{
                index[word] = [{ file : filename , count : 1 }];
            }
        }
        fs.writeFileSync("index.json",JSON.stringify(index,null,4));
    });
});


