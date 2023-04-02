const fs = require('node:fs');
const path = require('node:path');

function findFiles(directory, fileTypes) {
    const files = fs.readdirSync(directory);
    let result = [];
    
    files.forEach(file => {
        const filePath = path.join(directory, file);
        const fileStat = fs.statSync(filePath);

        if (fileStat.isDirectory()) {
            result = result.concat(findFiles(filePath, fileTypes));
        } else if (fileTypes.includes(path.extname(file))) {
            result.push(filePath);
        }
    });

    return result;
}

module.exports = { findFiles };