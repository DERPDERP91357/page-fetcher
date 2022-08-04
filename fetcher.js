let input = process.argv.slice(2);
const fs = require("fs");
const request = require ("request");
const readline = require('readline');
const { resolve } = require("path");
const { rejects } = require("assert");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


let URL = input[0];
let localPath = input[1];



if(URL === undefined) {
  throw 'URL is not Valid!'
}
console.log('URL is Valid!');
if(!localPath === undefined) {
  throw 'localPath is not Valid!'
}
console.log('localPath is Valid!');

const confirm = function () {
  return new Promise (resolve => {
    rl.question("Files already exists. Do you want to overwrite? (Y/N)\n", (answer) => {
      let converted = answer.toLowerCase();
      if(converted === "y"){
        console.log("Thank you. Request is RESTARTING.")
        resolve();
      } else if (converted === "n"){
        console.log("Thank you. Request is CANCELLED.")
        rl.close();
      } else {
        console.log("INVALID INPUT")
        confirm();
      }
    })
  })
};


const fetcher = function () {
  request(URL, (error, response, body) => {
    console.log('error:', error); 
    console.log('statusCode:', response && response.statusCode);
    fs.writeFile(localPath, body, { flag: 'wx' }, (err) => {
      if (err && response.statusCode === 200) {
        confirm().then((resolve)=>{
          fs.writeFile(localPath, body, (err) => {
            if (err) {
              throw err;
            }
            fs.stat(localPath, (err, stats) => {
              if (err) {
                console.error(err);
              }
              console.log(`File written successfully: ${stats.size} bytes used.`);
            });
            rl.close();
          })
        })
      } else if (err) {
        console.log(err);
        throw "File cannot be written.";
      } else {
        fs.stat(localPath, (err, stats) => {
          if (err) {
            console.error(err);
          }
          console.log(`File written successfully: ${stats.size} bytes used.`);
        });
        rl.close();
      }
    })
  });
};

fetcher();
//node fetcher.js http://example.edu index.html 

//node fetcher.js https://www.google.com/fdsafsafsa.html index.html 