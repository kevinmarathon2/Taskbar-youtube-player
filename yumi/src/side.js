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
    loading: false
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
    run: function() {
      this.loading = true;
      var string = this.searchBar.replace(new RegExp(" ", "g"), "+");
      console.log(string);
      this.$http
        .get("https://www.youtube.com/results?search_query=" + string)
        .then(
          response => {
            // get body data
            var $ = cheerio.load(response.body);
            //console.log(response.body);
            //console.log(response.body);
            //console.log($("[data-video-ids]"));

            var infoVideos = $(".yt-lockup-thumbnail");
            //console.log(infoVideos);
            var infoVideosamount = $(".yt-lockup-thumbnail").length;
            // console.log(infoVideosamount);

            var list = [];
            for (var counter = 0; counter < infoVideosamount; counter++) {
              // list.push(videoList[counter].attribs["data-video-ids"]);
              var video = {};
              var test = cheerio.load(infoVideos[counter]);
              // console.log(test(".yt-thumb-simple"));
              var element = test(".yt-thumb-simple > img");
              //console.log(element[0]);
              // console.log(element[0].attribs["data-thumb"]);
              if (element[0].attribs["data-thumb"] == undefined) {
                video.image = element[0].attribs["src"];
              } else {
                video.image = element[0].attribs["data-thumb"];
              }
              //console.log(element[0]);
              //video.image = element[0].children[0].attribs["src"];
              //console.log(test(".video-time"));
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
              //console.log(video);
            }
            console.log(list);
            console.log(list.length);
            // var videoList = $("[data-video-ids]");
            // var videoAmount = $("[data-video-ids]").length;

            // for (var counter = 0; counter < videoAmount; counter++) {
            //   list.push(videoList[counter].attribs["data-video-ids"]);
            // }

            // var result = [];
            // list.forEach(function(item) {
            //   if (result.indexOf(item) < 0) {
            //     result.push(item);
            //   }
            // });
            // console.log(result);
            //this.videoLists = result;
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

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
