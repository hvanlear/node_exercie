/* 
Add a feature where, on the command line, you can 
optionally provide an argument to output to a file instead of printing to the console. 
The argument should look like this: --out output-filename.txt readfile-or-url.

*/

const fs = require("fs");
const process = require("process");
const axios = require("axios");

/** handle output: write to file if out given, else print */
function handleOutput(text, out) {
  if (out) {
    fs.writeFile(out, text, "utf8", function (err) {
      if (err) {
        console.error(`coundnt write ${out}: ${err}`);
        process.exit(1);
      }
    });
  } else {
    console.log(text);
  }
}

// read file at path and print it out

function cat(path, out) {
  fs.readFile(path, "utf8", function (err, data) {
    if (err) {
      console.log(err);
      process.exit(1);
    } else {
      handleOutput(data, out);
    }
  });
}

// read page at URL and print it out

async function webCat(url, out) {
  try {
    let resp = await axios.get(url);
    handleOutput(resp.data, out);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

let path;
let out;

console.log(process.argv);

if (process.argv[2] === "--out") {
  out = process.argv[3];
  path = process.argv[4];
} else {
  path = proces.argv[2];
}

if (path.slice(0, 4) === "http") {
  webCat(path, out);
} else {
  cat(path, out);
}

/* 

$ node step3.js --out new.txt one.txt
$ # no output, but new.txt contains contents of one.txt

$ node step3.js --out new.txt  http://google.com
$ # no output, but new.txt contains google's HTML
*/
