const fs = require('fs');
const path = require('path');

const prompt = (query) => {
  process.stdout.write(query);

  return new Promise(resolve => {
    process.stdin.setEncoding('utf8');

    process.stdin.on('data', (data) => {
      resolve(data.trim());
    });
  });
};

async function main() {
  console.log([
    'This utility will walk you through creating a Fluxscape module.',
    '',
    'Remember to call `npm install` inside the module/ directory afterwards.',
    '',
    'Press ^C at any time to quit.',
  ].join('\n'));

  const name = await prompt('Module name (my-module): ') || 'my-module';
  const namespace = await prompt('Module namespace (com.my-module): ') || 'com.my-module';
  const author = await prompt('Author (Anonymous): ') || 'Anonymous';
  const description = await prompt('Description: ') || '';

  const templateDir = path.join(__dirname, 'template');
  const targetDir = path.join(__dirname, name);

  console.log(`About to create ${targetDir}`);

  const confirm = await prompt('Is this OK? (yes): ') || 'yes';
  if (confirm != 'yes') {
    console.log('Aborted.');
    process.exit(0);
  }

  fs.cpSync(templateDir, targetDir, { recursive: true });

  const replaceVariables = (filePath) => {
    const fullPath = path.join(targetDir, filePath);
    let content = fs.readFileSync(fullPath, 'utf8');

    content = content.replace(/{{name}}/g, name);
    content = content.replace(/{{namespace}}/g, namespace);
    content = content.replace(/{{author}}/g, author);
    content = content.replace(/{{description}}/g, description);

    fs.writeFileSync(fullPath, content);
  };

  const templateFiles = [
    'README.md',
    'module.json',
    'module/package.json',
    'module/src/constants.ts',
    'project/project.json',
  ];
  templateFiles.forEach(replaceVariables);

  process.exit(0);
}

main();
