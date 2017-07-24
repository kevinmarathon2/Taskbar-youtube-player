const VueResource = require("vue-resource");
const cheerio = require("cheerio");

const { ipcRenderer } = require("electron");

Vue.use(VueResource);

var app = new Vue({
  el: "#app",
  data: {},
  watch: {
    videoLists: function(val) {},
    toggle: val => {}
  },
  created() {},
  methods: {
    run: function() {}
  }
});

var timeKeeper = {
  startTimer: "",
  savedVideo: "",
  savedSeconds: ""
};
ipcRenderer.on("Here-is-a-video-to-play", (event, arg) => {
  console.log(arg);
  //alert(arg);
  document.getElementById("sound").src = "https://www.youtube.com" + arg;
  timeKeeper.startTimer = new Date();
  timeKeeper.savedVideo = "https://www.youtube.com" + arg;
});

ipcRenderer.on("Please-Stop", (event, arg) => {
  console.log(arg);
  document.getElementById("sound").src = "nothin";
});

ipcRenderer.on("Please-Pause", (event, arg) => {
  console.log(arg);
  var pauseTimer = new Date();
  console.log(pauseTimer.getTime() - timeKeeper.startTimer.getTime());
  var secondsOffset = Math.floor(
    (pauseTimer.getTime() - timeKeeper.startTimer.getTime()) / 1000
  );

  console.log(secondsOffset);
  timeKeeper.savedSeconds = secondsOffset;
  document.getElementById("sound").src = "nothin";
});

ipcRenderer.on("Please-Resume", (event, arg) => {
  console.log(arg);
  console.log(timeKeeper.savedVideo + "&t=" + timeKeeper.savedSeconds + "s");
  document.getElementById("sound").src =
    timeKeeper.savedVideo + "&t=" + timeKeeper.savedSeconds;
});

console.log(app);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
