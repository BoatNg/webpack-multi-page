const glob = require('glob')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const PROJECT_DIR = path.join(__dirname, '..')
function getEntryJS() {
  var entry = {};
  glob.sync(`${PROJECT_DIR}/src/pages/**/*.js`)
    .forEach(function (name) {
      var start = name.indexOf('src/') + 4,
        end = name.length - 3;
      var eArr = [];
      var n = name.slice(start, end);
      n = n.slice(0, n.lastIndexOf('/'));
      n = n.split('/')[1];
      eArr.push(name);
      entry[n] = eArr;
    });
  return entry;
};

function getEntryHTML() {
  var entry = {};
  glob.sync(`${PROJECT_DIR}/src/pages/**/*.html`)
    .forEach(function (name) {
      var start = name.indexOf('src/') + 4,
        end = name.length - 5;
      var eArr = [];
      var n = name.slice(start, end);
      n = n.slice(0, n.lastIndexOf('/'));
      n = n.split('/')[1];
      eArr.push(name);
      entry[n] = eArr;
    });
  return entry;
};

let htmlDir = getEntryHTML()
let htmlPluginArr = Object.keys(htmlDir).map((t) => {
  return new HtmlWebpackPlugin({
    filename: `${t}.html`,
    template: htmlDir[t][0],
    chunks: [t, "vendors"],
    favicon: `${PROJECT_DIR}/src/assert/img/icon.png`,
    minify: {    //压缩HTML文件
      removeComments: true,    //移除HTML中的注释
      collapseWhitespace: true    //删除空白符与换行符
    }
  })
})

const isProd = process.env.NODE_ENV === 'production'
module.exports = {
  entry: getEntryJS(),
  htmlPluginArr,
  PROJECT_DIR,
  isProd
}
