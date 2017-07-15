var fs = require("fs");
const path = require("path");
const url = require("url");

function searchForFolders() {}
// function getDirectories (srcpath) {
//   return fs.readdirSync(srcpath)
//     .filter(file => fs.lstatSync(path.join(srcpath, file)).isDirectory())
// }

function filewatch(mainWindow, FilesToWatch) {
  if (FilesToWatch == undefined) {
  } else {
    FilesToWatch.forEach(value => {
      fs.watch(value, { encoding: "buffer" }, (eventType, filename) => {
        if (filename) console.log(filename);
        mainWindow.loadURL(
          url.format({
            pathname: path.join(__dirname, "./yumi/index.html"),
            protocol: "file:",
            slashes: true
          })
        );
      });
    });
  }
}
module.exports = filewatch;

//  var fs = require("fs");
//                 const path = require("path");
//                 const url = require("url");
//                 function getDirectories(srcpath) {

//                     return fs.readdirSync(srcpath)
//                         .filter(file => {
//                             console.log(path.join(srcpath, file))
//                             console.log(fs.lstatSync(path.join(srcpath, file)).isDirectory())
//                             if (fs.lstatSync(path.join(srcpath, file)).isDirectory()) {
//                                 console.log("problem")
//                                 return fs.lstatSync(path.join(srcpath, file)).isDirectory()
//                             } else {

//                             };
//                         })
//                 }
//                 var filelist = ["./"]
//                 var excludeList = ["node_modules", "bower_components", ".git", ".idea"]
//                 for (var i = 0; i < 20; i++) {
//                     var templist = getDirectories(filelist[i]);
//                     templist.forEach(dir => {
//                         if (excludeList.find(function (element) { return element == dir })) {

//                         } else if (dir == null || dir == undefined) {
//                             console.log(" dir is empty")
//                         } else {
//                             console.log(dir)
//                             filelist.push(filelist[i].toString() + dir.toString() + "/")
//                         }
//                         console.log(filelist)

//                     })
//                     //console.log(filelist + "filelist")
//                 }
//                 console.log(getDirectories(filelist.length))
