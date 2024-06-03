/* eslint-disable no-useless-escape */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

/**
 * public/models下のglbファイルを全て取得し、jsonを生成します。
 */
const MODELS_PATH = './public/models';
const HTML_PATH = './public';
const OUTPUT_PATH = './json';
const OUTPUT_NAME = 'model-list.json';

const EXTENSION_REGEXP_STR = [`\.glb\.*`];
const EXTENSION_REGEXP = new RegExp(`[${EXTENSION_REGEXP_STR.join('||')}]$`);

const getData = (dir) => {
  const allFileNames = fs.readdirSync(dir);
  const nameAndPath = [];

  allFileNames.forEach((name) => {
    if (name.match(EXTENSION_REGEXP)) {
      const fileNameWithoutExt = name.substring(name.lastIndexOf('/') + 1, name.indexOf('.'));
      const filePath = path.join(MODELS_PATH, name);
      const relativePath = './' + path.join(path.relative(HTML_PATH, MODELS_PATH), name);
      const stats = fs.statSync(filePath);

      if (!stats.isDirectory()) nameAndPath.push([fileNameWithoutExt, relativePath]);
    }
  });

  return nameAndPath;
};

const createModelListData = (fileData) => {
  const modelListObj = { modelList: [] };

  fileData.forEach((data) => {
    const newData = {
      name: capitalize(data[0]),
      path: data[1],
    };

    modelListObj.modelList.push(newData);
  });

  return modelListObj;
};

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.substring(1);
};

const files = getData(MODELS_PATH);
const newData = createModelListData(files);
const jsonData = JSON.stringify(newData);

fs.writeFileSync(path.join(OUTPUT_PATH, OUTPUT_NAME), jsonData);

console.log(newData);
console.log('Finished creating model list json!');
