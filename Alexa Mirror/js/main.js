document.addEventListener("keydown", function (e) {
  if (e.which === 123) {
    require('electron').remote.getCurrentWindow().toggleDevTools();
  } else if (e.which === 116) {
    location.reload();
  }
});
let express = require('express'),
  bodyParser = require('body-parser'),
  port = process.env.PORT || 8080,
  app = express();
let alexaVerifier = require('alexa-verifier');
var isFisrtTime = true;
const SKILL_NAME = 'Alexa Mirror';
const HELP_MESSAGE = 'Wait for help!';
const HELP_REPROMPT = 'How can i help you?';
const STOP_MESSAGE = 'Quitting from Alexa Mirror, Good bye!';
const MORE_MESSAGE = 'What else do you want to do?'
const PAUSE = '<break time="0.3s" />'
const WHISPER = '<amazon:effect name="whispered"/>'
var ID = null;
var player = document.getElementsByClassName('audio')[0];


const data = [
  'Aladdin  ',
  'Cindrella ',
  'Bambi',
  'Bella ',
  'Bolt ',
  'Donald Duck',
  'Genie ',
  'Goofy',
  'Mickey Mouse',
];

app.use(bodyParser.json({
  verify: function getRawBody(req, res, buf) {
    req.rawBody = buf.toString();
  }
}));

function requestVerifier(req, res, next) {
  alexaVerifier(
    req.headers.signaturecertchainurl,
    req.headers.signature,
    req.rawBody,
    function verificationCallback(err) {
      if (err) {
        res.status(401).json({
          message: 'Verification Failure',
          error: err
        });
      } else {
        next();
      }
    }
  );
}

function log() {
  if (true) {
    console.log.apply(console, arguments);
  }
}

app.post('/', requestVerifier, async function (req, res) {

  if (req.body.request.type === 'LaunchRequest') {
    res.json(startAlexaMirror());
    isFisrtTime = false
  } else if (req.body.request.type === 'SessionEndedRequest') {
    /* ... */
    log("Session End")
  } else if (req.body.request.type === 'IntentRequest') {
    switch (req.body.request.intent.name) {
      case 'MUSIC_UpVolume':
        break;
      case 'MUSIC_ResumeIntent':
        res.json(resumeMusic());
        break;
      case 'MUSIC_PlayIntent':
        res.json(playMusic());
        break;
      case 'MUSIC_StopIntent':
        res.json(stopMusic());
        break;
      case 'MUSIC_PauseIntent':
        res.json(pauseMusic());
        break;
      case 'MUSIC_SearchIntent':
        var jsonobj = await searchMusic(req.body.request.intent.slots.searchSong.value);
        res.json(jsonobj);
        break;
      case 'MUSIC_NextIntent':
        res.json(nextMusic());
        break;
      case 'MUSIC_PreviousIntent':
        res.json(previousMusic());
        break;
      case 'CALENDAR_SetNewEventIntent':
        res.json(insertNewEventCalendar());
        break;
      case 'CALENDAR_DeleteEventIntent':
        res.json(deleteEventCalendar());
        break;
      case 'CALENDAR_ShowEventsIntent':
        res.json(showEventsIntent());
        break;
      case 'AMAZON.StopIntent':
        res.json(stopAndExit());
        break;
      case 'DestroyPussy':
        res.json(getNewPussy());
        break;
      default:
        break;

    }
  }else if(req.body.request.type == "AudioPlayer.PlaybackFinished"){
    document.getElementById('music-player').classList.remove('fadeIn');
  }
});

function handleDataMissing() {
  return buildResponse(MISSING_DETAILS, true, null)
}

function stopAndExit() {

  const speechOutput = STOP_MESSAGE
  var jsonObj = buildResponse(speechOutput, true, "");
  return jsonObj;
}

//MUSIC
function stopMusic() {
  document.getElementById('music-player').classList.remove('fadeIn');
  player.load();
  const speechOutput = "Stopping music";
  var jsonObj = buildResponse(speechOutput, true, "");
  return jsonObj;
}

function resumeMusic() {
  player.play();
  const speechOutput = "Resuming music";
  var jsonObj = buildResponse(speechOutput, true, "");
  return jsonObj;
}

function playMusic() {
  player.play();
  const speechOutput = "Playing music";
  var jsonObj = buildResponse(speechOutput, true, "");
  return jsonObj;
}

function pauseMusic() {
  player.pause();
  const speechOutput = "Music paused";
  var jsonObj = buildResponse(speechOutput, true, "");
  return jsonObj;
}
player.onended = function() {
  document.getElementById('music-player').classList.remove('fadeIn');

};
function SSong() {
  const ytsr = require('ytsr');
  const ytdl = require('ytdl-core');
  audioContext = new AudioContext();
  const {Readable, Writable} = require('web-audio-stream/stream');
  ytsr('im bad guy', {
    limit: 5
  }, function (err, result) {
    /*var isPlaylist = false;
        if(name.includes('playlist'))
        isPlaylist = true;
        if(isPlaylist){
          
            for(var item of result.items){
              if(item.type=="playlist"){
                var stream = ytdl(item.link).pipe(fs.createWriteStream(ID + '.mp3'));
    
                console.log(JSON.stringify(item));
                break;
              }
            }
        }*/
    ytdl(result.items[0].link).pipe(player);
  });
}

async function ytPlay(name) {
  const request = require('request');
  const {
    getInfo
  } = require('ytdl-getinfo');
  await getInfo(name).then(async info => {
    window.songName = info.items[0].title;

    await request(info.items[0].url, function (err, response, body) {
      if (response.statusCode == '403') {
        console.log('Got Error');
        ytPlay(name);
      } else {
        console.log('Smart mirror: Playing.')
        player.src = info.items[0].url;
        player.play();
        document.getElementById('audio-title').innerHTML = info.items[0].title;
        document.getElementById('music-player').classList.add('fadeIn');
      }
    });
  });
}

async function searchMusic(name) {
  const ytsr = require('ytsr');
  const fs = require('fs');
  const ytdl = require('ytdl-core');
  const request = require('request');
  const {
    getInfo
  } = require('ytdl-getinfo');
  window.oldID = ID;
  ID = randomString();
  /*ytsr(name, {
    limit: 5
  }, function (err, result) {
    var isPlaylist = false;
    if(name.includes('playlist'))
    isPlaylist = true;
    if(isPlaylist){
      
        for(var item of result.items){
          if(item.type=="playlist"){
            var stream = ytdl(item.link).pipe(fs.createWriteStream(ID + '.mp3'));

            console.log(JSON.stringify(item));
            break;
          }
        }
    }else
  });*/
  window.oldID = ID;
  ID = randomString();
  window.songName = "";
  //await ytPlay(name);
  await getInfo(name).then(async info => {
    window.songName = info.items[0].title;
    window.songFile = info.items[0].url;
    window.songID = info.items[0].id;
    await request(info.items[0].url, function (err, response, body) {
      if (response.statusCode == '403') {
        window.statusCode =='error';
      } else {
        document.getElementById('audio-title').innerHTML = info.items[0].title;
        document.getElementById('music-player').classList.add('fadeIn');
      }
    });
  });
  if(window.statusCode=='error'){
    console.log('Error with song download');
    var jsonObj= buildResponse('There was a problem with the Song you asked', true, speechOutput);
  }else{
    const speechOutput = "Playing " + window.songName;
    var jsonObj= buildResponseWithSong(speechOutput, true, window.songName, window.songFile, speechOutput);
    //var jsonObj = buildResponse(speechOutput, true, "");
    console.log(speechOutput);
  }
  return jsonObj;
  
}
/*async function streamMusic(url, ID) {
  const fs = require('fs');
  const request = require('request');
  var stream = request(url).pipe(fs.createWriteStream(ID + '.mp3'));
  stream.on('finish', function () {
    console.log('finished');
    audio.src = ID + '.mp3';
    audio.load();
    audio.play();
    console.log(window.oldID);
    if (window.oldID != null) {
      fs.unlinkSync(window.oldID + '.mp3', function () {});
    }
  });
}*/

function randomString() {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
}

/*function downloadAndConv(videoId) {
  window.oldID = ID;
  ID = randomString();
  const fs = require('fs');
  const ytdl = require('ytdl-core');
  var stream = ytdl('https://www.youtube.com/watch?v=' + videoId).pipe(fs.createWriteStream(ID + '.mp3'));

  stream.on('data', function(dataChunk){});

  stream.on('finish', function () {
    console.log('finished');
    const stats = fs.statSync(ID + '.mp3');
    if (stats.size != 0) {
      audio.src = ID + '.mp3';
      audio.load();
      audio.play();
      console.log(window.oldID);
      if (window.oldID != null) {
        fs.unlinkSync(window.oldID + '.mp3', function () {});
      }
    }

    audArr.push(audio);
    for(var i=0; i<audArr.length-1; i++){
      audArr[i].currentTime = 0.0;
      audArr[i].pause();
    }
    audArr[audArr.length-1].play();
  });*/

  /*.pipe(fs.createWriteStream('video.mp3')).on('finish', async function(){
        var audio = new Audio('video.mp3');
        audio.play();
        /**
         *    input - string, path of input file
         *    output - string, path of output file
         *    callback - function, node-style callback fn (error, result)        
         
        const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
        const ffmpeg = require('fluent-ffmpeg');
        ffmpeg.setFfmpegPath(ffmpegPath);
    
        const extractAudio = require('ffmpeg-extract-audio');
        await extractAudio({
          input: 'video.mp4',
          output: 'test.mp3'
        });
        
      });*/



function help() {

  const speechOutput = HELP_MESSAGE
  const reprompt = HELP_REPROMPT
  var jsonObj = buildResponseWithRepromt(speechOutput, true, "", reprompt);

  return jsonObj;
}

function startAlexaMirror() {

  var welcomeSpeechOutput = 'Welcome on Alexa Mirror<break time="0.3s" />'
  if (!isFisrtTime) {
    welcomeSpeechOutput = '';
  }

  const tempOutput = WHISPER + PAUSE;
  const speechOutput = welcomeSpeechOutput + tempOutput;
  const more = MORE_MESSAGE;


  return buildResponseWithRepromt(speechOutput, true, "Welcome!", more);

}

/*function getNewPussy() {

  var welcomeSpeechOutput = 'Questa è la tua figa bro: <break time="0.3s" />';

  if (!isFisrtTime) {
    welcomeSpeechOutput = '';
  }

  const pussyArr = [
	'Prima figa',
	'Seconda figa',
	'Terza figa',
	'Nerini',
	'Bea',
	];
  const pussyIndex = Math.floor(Math.random() * pussyArr.length);
  const randomPussy = pussyArr[pussyIndex];
  const tempOutput = WHISPER + randomPussy + PAUSE;
  const speechOutput = welcomeSpeechOutput + tempOutput + MORE_MESSAGE;
  const more = MORE_MESSAGE;

  return buildResponseWithRepromt(speechOutput, false, randomPussy, more);

}*/

function buildResponse(speechText, shouldEndSession, cardText) {

  const speechOutput = "<speak>" + speechText + "</speak>"
  var jsonObj = {
    "version": "1.0",
    "response": {
      "shouldEndSession": shouldEndSession,
      "outputSpeech": {
        "type": "SSML",
        "ssml": speechOutput
      }
    },
    "card": {
      "type": "Simple",
      "title": SKILL_NAME,
      "content": cardText,
      "text": cardText
    },
  }
  return jsonObj
}

function buildResponseWithSong(speechText, shouldEndSession, songName, songFile, cardText) {

  const speechOutput = "<speak>" + speechText + "</speak>"
  var jsonObj = {
    "version": "1.0",
    "response": {
      "shouldEndSession": shouldEndSession,
      "outputSpeech": {
        "type": "SSML",
        "ssml": speechOutput
      },
      "directives": [{
        "type": "AudioPlayer.Play",
        "playBehavior": "REPLACE_ALL",
        "audioItem": {
          "stream": {
            "url": songFile,
            "token": window.songID,
            "offsetInMilliseconds": 0
          },
          "metadata": {
            "title": songName,
            "subtitle": "on Alexa Mirror"
          }
        }
      }]
    },
    "card": {
      "type": "Simple",
      "title": SKILL_NAME,
      "content": cardText,
      "text": cardText
    },
  }
  return jsonObj
}

function buildResponseWithRepromt(speechText, shouldEndSession, cardText, reprompt) {

  const speechOutput = "<speak>" + speechText + "</speak>"
  var jsonObj = {
    "version": "1.0",
    "response": {
      "shouldEndSession": shouldEndSession,
      "outputSpeech": {
        "type": "SSML",
        "ssml": speechOutput
      }
    },
    "card": {
      "type": "Simple",
      "title": SKILL_NAME,
      "content": cardText,
      "text": cardText
    },
    "reprompt": {
      "outputSpeech": {
        "type": "PlainText",
        "text": reprompt,
        "ssml": reprompt
      }
    },
  }
  return jsonObj
}

app.listen(port);

console.log('Alexa mirror started on: ' + port);


  //GOOD CODE MUSIC

  /*var array = new Array();
    for(var item of result.items){
        if(item.type=='video')
          array.push(item);
    }

    var stream = ytdl(array[0].link).pipe(fs.createWriteStream(ID + '.mp3'));
    stream.on('finish', function () {
      console.log('finished');
      audio.src = ID + '.mp3';
      audio.load();
      audio.play();
      console.log(window.oldID);
      if (window.oldID != null) {
        fs.unlinkSync(window.oldID + '.mp3', function () { });
      }
    });
    console.log(JSON.stringify(result));
  });
  //var youTube = new YouTube();
  /*const {
    getInfo
  } = require('ytdl-getinfo');
  window.oldID = ID;
  ID = randomString();
  await getInfo(name).then(info => {
    // info.items[0] contains information of the first search result
    console.log(JSON.stringify(info.items[0].id));
    console.log(JSON.stringify(info.items[0].url));
    window.songName = info.items[0].title;
    //downloadAndConv(info.items[0].id);
    streamMusic(info.items[0].url, ID);
    
  });*/


  /*youTube.setKey('AIzaSyDeEk8wfWENJgNeP8-g8kKHFjwC2Ewk4wI');

  youTube.search(name, 2, function(error, result) {
    if (error) {
      console.log(error);
    }
    else {
      console.log(JSON.stringify(result, null, 2));
      
        for(var i=0;i<result.items.length; i++){
          if(result.items[i].id.channelId == null){
            var videoId = result.items[i].id.videoId;
            downloadAndConv(videoId);
            return 0;
          }
        }
    }
  });*/