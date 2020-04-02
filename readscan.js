const sampleTagURL="http://fantasy-worlds.org/lib/tag62/";
const sampleBookURL = "http://fantasy-worlds.org/lib/id30377/"; // last book id on 4/1/2020
const sampleSerialURL = "http://fantasy-worlds.org/series/id6198/";

// MAIN LOGIC
// 1. read url into file(?) 
// 2. parse answer
// 3. write num-tag pair into base
// 4. increase num and go step 1

const http = require("http");
const fs = require("fs");

let tags = [];
const tagsFileName = "tagsName.txt";

let tagNum = 0;
const getNextTagUrl = () => `http://fantasy-worlds.org/lib/tag${tagNum++}/`;

const writeScanned = () => {
    //console.log(tags);
    fs.open(tagsFileName, "w+", (err, fd)=>{
        fs.appendFileSync(fd, `--- #\n`);
        for(let el of tags) {
            fs.appendFileSync(fd, ` - id${el.num}:"${el.name}"\n`, `utf8`);
        }
        fs.close(fd, (err) => {
            if (err) throw err;
        });
    });
};

const readAndScan = () => {
    const requestedURL = getNextTagUrl();
    // console.log(requestedURL);
http.get(requestedURL, (res) => {
    const { statusCode } = res;
    const contentType = res.headers['content-type'];
    if (statusCode === 200) {
        let rawData = '';
        res.on('data', (d) => { rawData += d; });
        res.on('end', () => {
            const tagParse = /Тег:\s+([^<]+)\</.exec(rawData);
            if (tagParse && tagParse.length) {
                const tagName = tagParse[1];
                console.log(`Tag #${tagNum} name is: ${tagName}`);
                tags.push({num:tagNum, name:tagName});
            } else {
                console.log(`Tag #${tagNum} has no name`);
            }
            if (tagNum<5000) {
                readAndScan();
            } else {
                writeScanned();
            }
        });
    }
}).on('error', (e) => {
    console.error(`Gor error: ${e.message} (${tagNum})`);
});
}; // readAndScan

readAndScan();