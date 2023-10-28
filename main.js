const fs = require('fs');
const path = require('path');
const readline = require('readline');

function findDuplicateFiles(folder1, folder2) {
  const duplicates = [];

  function traverseDirectory(dir, relativePath) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath1 = path.join(dir, file);
      const filePath2 = path.join(folder2, relativePath, file);

      if (fs.existsSync(filePath2) && fs.lstatSync(filePath1).isFile() && fs.lstatSync(filePath2).isFile()) {
        if (fs.readFileSync(filePath1).equals(fs.readFileSync(filePath2))) {
          duplicates.push(filePath2);
        }
      }

      if (fs.lstatSync(filePath1).isDirectory()) {
        traverseDirectory(filePath1, path.join(relativePath, file));
      }
    }
  }

  traverseDirectory(folder1, '');

  return duplicates;
}

function deleteDuplicateFiles(duplicates) {
  for (const file of duplicates) {
    fs.unlinkSync(file);
    console.log(`Deleted duplicate file: ${file}`);
  }
}

if (process.argv.length !== 4) {
  console.log(`duplicate-file-clean\nCompare the files in folder1 with those in folder2 and remove duplicate files in folder2\nUsage: npx duplicate-file-clean folder1 folder2`);
  process.exit(1);
}

const folder1 = process.argv[2];
const folder2 = process.argv[3];

const duplicates = findDuplicateFiles(folder1, folder2);

if (duplicates.length > 0) {
  console.log('Found duplicate files:');
  for (const file of duplicates) {
    console.log(file);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Do you want to delete the duplicate files? (y/n): ', (answer) => {
    rl.close();
    if (answer.toLowerCase() === 'y') {
      deleteDuplicateFiles(duplicates);
    } else {
      console.log('Duplicate files not deleted.');
    }
  });
} else {
  console.log('No duplicate files found.');
}

module.exports = { findDuplicateFiles, deleteDuplicateFiles };