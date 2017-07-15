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

ipcRenderer.on("Here-is-a-video-to-play", (event, arg) => {
  console.log(arg);
  //alert(arg);
  document.getElementById("sound").src = "https://www.youtube.com" + arg;
});

ipcRenderer.on("Please-Stop", (event, arg) => {
  console.log(arg);
  document.getElementById("sound").src = "nothin";
});

console.log(app);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
