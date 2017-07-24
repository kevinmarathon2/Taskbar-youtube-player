const VueResource = require("vue-resource");
const cheerio = require("cheerio");
const { ipcRenderer } = require("electron");

Vue.use(VueResource);
ipcRenderer.send("asking-status", "");

var app = new Vue({
  el: "#app",
  data: {
    videoLists: [],
    searchBar: "",
    currentVideo: 0,
    currentVideoImg: "",
    currentVideoTitle: "",
    currentVideoTime: "",
    isPlaying: false,
    loading: false,
    isPaused: false
  },
  watch: {
    videoLists: function(val) {}
  },
  created() {},
  methods: {
    sendmessage() {
      console.log("send");
    },
    backToSearch() {
      this.isPlaying = false;
    },
    nextSong() {
      this.currentVideo++;
      console.log(this.videoLists);
      console.log(this.videoLists[this.currentVideo]);
      ipcRenderer.send(
        "Here-is-a-video-to-play",
        this.videoLists[this.currentVideo].videosrc
      );
      this.currentVideoImg = this.videoLists[this.currentVideo].image;
      this.currentVideoTitle = this.videoLists[this.currentVideo].title;
      this.currentVideoTime = this.videoLists[this.currentVideo].timelength;
      console.log(this.videoLists[this.currentVideo]);
      ipcRenderer.send("change-status", {
        action: "Playing",
        videoplaying: this.currentVideo,
        videolist: this.videoLists
      });
    },

    stopSong() {
      ipcRenderer.send("asking-stop", "");
      this.isPlaying = false;
    },
    pauseSong() {
      if (this.isPaused) {
        ipcRenderer.send("asking-resume", "");
      } else {
        ipcRenderer.send("asking-pause", "");
      }
      this.isPaused = !this.isPaused;
    },
    resumeSong() {},
    run: function() {
      if (this.searchBar == "") return 0;
      this.loading = true;
      var string = this.searchBar.replace(new RegExp(" ", "g"), "+");
      console.log(string);
      this.$http
        .get("https://www.youtube.com/results?search_query=" + string)
        .then(
          response => {
            // get body data
            var $ = cheerio.load(response.body);

            var infoVideos = $(".yt-lockup-thumbnail");

            var infoVideosamount = $(".yt-lockup-thumbnail").length;

            var list = [];
            for (var counter = 0; counter < infoVideosamount; counter++) {
              var video = {};
              var test = cheerio.load(infoVideos[counter]);

              var element = test(".yt-thumb-simple > img");

              if (element[0].attribs["data-thumb"] == undefined) {
                video.image = element[0].attribs["src"];
              } else {
                video.image = element[0].attribs["data-thumb"];
              }
              if (test(".video-time").html() == null) {
                video.timelength = "";
              } else {
                video.timelength = test(".video-time").html();
              }

              var infotitle = $(".yt-lockup-title");
              //console.log(infotitle[counter].children[0].attribs.title);
              video.title = infotitle[counter].children[0].attribs.title;
              //console.log(infotitle[counter].children[0].attribs.href);
              video.videosrc = infotitle[counter].children[0].attribs.href;
              list.push(video);
            }

            this.videoLists = list;
            ipcRenderer.send("Here-is-a-video-to-play", list[0].videosrc);
            ipcRenderer.send("change-status", {
              action: "Playing",
              videoplaying: 0,
              videolist: list
            });
            this.isPlaying = true;
            this.loading = false;
            this.currentVideoImg = list[0].image;
            this.currentVideoTitle = list[0].title;
            this.currentVideoTime = list[0].timelength;
          },
          response => {
            // error callback
          }
        );
    }
  }
});

ipcRenderer.on("Here-is-status", (event, arg) => {
  if (arg.action == "Playing") {
    app.isPlaying = true;
    app.currentVideo = arg.videoplaying;
    app.videoLists = arg.videolist;
    console.log(arg);
    console.log(app.videoLists);
    app.currentVideoImg = app.videoLists[app.currentVideo].image;
    app.currentVideoTitle = app.videoLists[app.currentVideo].title;
    app.currentVideoTime = app.videoLists[app.currentVideo].timelength;
  }
});
