var collage = collage.create(document.getElementById('collage'));

chrome.runtime.onMessage.addListener(function(msg, sender, respond) {
  console.log('message', msg);
  shuffle(msg);

  var tags = [];
  var queries = [];
  var strings = [];
  var gfys = [];
  for (var i = 0; i < msg.length; i++) {
    var chance;
    switch(msg[i].topic) {
      case 'Hobbies and activities':
        chance = 0.9;
        break;
      default:
        chance = 0.2;
    }

    console.log(msg[i].name);

    if (Math.random() < chance / 2) (function(q) {
      var url = "http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=" + q;
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          console.log(xmlhttp.responseText);
          var data = JSON.parse(xmlhttp.responseText);
          if (data.data) {
            //var video = document.createElement('video');
            //video.isIn = function() {return false;};
            //video.src = data.data.image_mp4_url;
            //video.autoPlay = true;
            //video.loop = true;
            gfys.push(data.data.image_url);
          }
        }
      };
      xmlhttp.open("GET", url, true);
      xmlhttp.send();
    })(msg[i].name.split(' ').join('+'))


    if (tags.length < 200 && Math.random() < chance)
      tags.push({
        tags: msg[i].name
      });
    if (queries.length < 200 && Math.random() < chance)
      queries.push({
        query: msg[i].name
      });
    if (strings.length < 200 && Math.random() < chance)
      strings.push(msg[i].name);
  }


  setTimeout(function() {
    console.log(gfys);
    collage.load('media', {
      flickr: tags,
      reddit: queries,
      googleNews: strings
    });

    for (var i = 0; i < gfys.length; i++)
      if (gfys[i] !== undefined)
        collage.load('media', {
          image: [gfys[i]]
        });
    //collage.add('media', gfys);

    setTimeout(function() {
      console.log('starting');
      collage.start('media');
      collage.speed(12);
      document.body.style.opacity = 1;
    }, 3000);
  }, 2000);
});

/*google.load("search", "1");
google.setOnLoadCallback(function() {
  try {
    var imageSearch = new google.search.ImageSearch();
    imageSearch.setSearchCompleteCallback(this, function() {
      console.log(imageSearch.results);
    }, null);
    imageSearch.execute('waterpipe');
    //google.search.Search.getBranding('branding');
  }
  catch (e) {
    console.log(e);
  }
});*/

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
