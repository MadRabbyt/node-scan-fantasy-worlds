const fs = require("fs");
const fileName = "file.txt";

fs.open(fileName, "w+", (err, fd)=>{
    if(err) throw err;
    let i = 0;
    let num;
    const nextLineNumber = () => i += 1;
    const appendFirstLine = () => {
        fs.appendFile(fd, `--- # new comment\n`, `utf8`, (err) => {
            if (err) throw err;
            appendNextLine();
        });        
    };
    const appendNextLine = () => {
        num = nextLineNumber();
        fs.appendFile(fd, ` - id${num} : "line #${num}"\n`, `utf8`, (err) => {
            if (num < 100) {
                appendNextLine();
            } else {
                fs.close(fd, (err) => {
                    if (err) throw err;
                });
            }
            if (err) throw err;
        }); 
    };
    // appendNextLine();
    appendFirstLine();
    
});