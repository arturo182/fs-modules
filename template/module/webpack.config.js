const path = require('path');
const fs = require('fs-extra');
const yazl = require('yazl');

const CleanPlugin = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CreateFilePlugin = require('create-file-webpack-plugin');

const pjson = require('./package.json');
const mjson = require('../module.json');

let projectPath = path.resolve(__dirname, '../project/');

function stripStartDirectories(targetPath, numDirs) {
  const p = targetPath.split('/');
  p.splice(0, numDirs);
  return p.join('/');
}

module.exports = (env) => {
  const isRelease = !!env.release;
  if (isRelease)
    projectPath = path.resolve(__dirname, `../build/${pjson.name}/project`);

  const outputPath = path.join(projectPath, 'noodl_modules', pjson.name);

  return {
    entry: './src/index.ts',
    mode: 'production',
    devtool: 'source-map',
    output: {
      filename: 'index.js',
      path: outputPath,
    },
    externals: {
      //react: 'React',
      //'react-dom': 'ReactDOM',
    },
    resolve: {
      extensions: ['.js', '.json', '.css', '.ts', '.tsx'],
    },
    plugins: [
      new CleanPlugin(outputPath, { allowExternal: true }),
      new CopyPlugin([
        { from: 'assets/**/*', transformPath: (targetPath) => stripStartDirectories(targetPath, 1) },
      ]),
      ...(isRelease ? [
        new CopyPlugin([
          { from: '../project/project.json', to: '../../../project.json' },
          { from: '../icon.png', to: `../../../${pjson.name}.png`},
        ]),
        new CreateFilePlugin({
          filePath: `../build/${pjson.name}`,
          fileName:'module.json',
          content: () => {
            return JSON.stringify({
              label : mjson.label,
              desc: mjson.desc,
              docs: mjson.docs,
              icon: `library/modules/${pjson.name}/${pjson.name}.png`,
              project: `library/modules/${pjson.name}/${pjson.name}-${pjson.version.replace(/\./g, '-')}.zip`,
              docs: `library/modules/${pjson.name}/`,
              tags: mjson.tags,
            }, null, 2);
          },
        }),
        {
          apply: (compiler) => {
            compiler.hooks.afterEmit.tapAsync('AfterEmitPlugin', (compilation, callback) => {
              const zip = new yazl.ZipFile();

              const addFolder = (realPath, metadataPath) => {
                fs.readdirSync(realPath).forEach((name) => {
                  const filePath = path.join(realPath, name);
                  const fileMetaPath = path.join(metadataPath, name);
                  if (fs.statSync(filePath).isDirectory()) {
                    addFolder(filePath, fileMetaPath);
                  } else {
                    zip.addFile(filePath, fileMetaPath);
                  }
                });
              };

              addFolder(path.resolve(__dirname, `../build/${pjson.name}/project`), 'project');
              zip.addFile('../project/project.json', 'project/project.json');

              zip.end();

              const writeStream = fs.createWriteStream(`../build/${pjson.name}/${pjson.name}-${pjson.version.replace(/\./g, '-')}.zip`)
              zip.outputStream.pipe(writeStream).on('close', () => {
                fs.unlinkSync(`../build/${pjson.name}/project.json`);
                fs.removeSync(`../build/${pjson.name}/project`);

                callback();
              });
            });
          },
        }
      ] : [
        {
        // Copy the generated module files to the tests project if it exists (development only)
        apply: (compiler) => {
          compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
              if (fs.existsSync(path.resolve(__dirname, '../tests'))) {
                fs.copySync(outputPath, path.resolve(__dirname, '../tests/noodl_modules/' + pjson.name))
              }
            }
          )
        },
        }
      ]),
    ],
    module: {
      rules: [
          {
              test: /\.tsx?$/,
              use: 'ts-loader',
              exclude: /node_modules/,
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
          },
      ],
    },
  };
}
