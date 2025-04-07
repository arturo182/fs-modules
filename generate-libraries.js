const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const { URL } = require('url');

const baseUrl = process.argv[process.argv.length - 1];
if (!baseUrl.startsWith('http')) {
  console.log('Usage: node generate-libraries.js <baseUrl>');
  process.exit(1);
}

const ignoredDirs = [
  'template',
  'static'
];

const modules = fs.readdirSync(__dirname)
  .filter((name) => {
    return fs.statSync(path.join(__dirname, name)).isDirectory()
      && !ignoredDirs.includes(name)
      && !name.startsWith('.');
  });

if (modules.length == 0) {
  console.log('No modules found, exiting.');
  process.exit(0);
}

console.log(`Found ${modules.length} modules: [${modules.join(', ')}]`);

const modulesPath = path.join(__dirname, 'static', 'library', 'modules');

const infos = [];

modules.forEach((module) => {
  const modulePath = path.join(__dirname, module, 'module');
  const buildPath = path.join(__dirname, module, 'build', module);
  const destPath = path.join(modulesPath, module);

  console.log(`Processing ${module}`);
  childProcess.execSync('npm run release', { cwd: modulePath, stdio: 'inherit' });

  fs.mkdirSync(destPath, { recursive: true });

  fs.readdirSync(buildPath)
    .filter((name) => name != 'module.json')
    .forEach((name) => {
      fs.cpSync(path.join(buildPath, name), path.join(destPath, name));
  });

  const fixUrl = (url) => url.startsWith('http') ? url : new URL(url, baseUrl).toString();

  const info = require(path.join(buildPath, 'module.json'));
  info.docs = fixUrl(info.docs);
  info.icon = fixUrl(info.icon);
  info.project = fixUrl(info.project);

  infos.push(info);
});

fs.writeFileSync(path.join(modulesPath, 'index.json'), JSON.stringify(infos, null, 2));
