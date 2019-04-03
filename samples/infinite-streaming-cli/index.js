'use strict';

const chalk = require('chalk');
const { Transform } = require('stream');
const record = require('node-record-lpcm16');
const speech = require('@google-cloud/speech').v1p1beta1;

const client = new speech.SpeechClient();

const config = {
  encoding: 'LINEAR16',
  sampleRateHertz: 16000,
  languageCode: 'en-US',
};

const request = {
  config,
  interimResults: true,
};

const STREAMING_LIMIT = 10000;
let recognizeStream = null;
let restartCounter = 0;
let audioArray = [];
let lastAudioArray = [];
let resultEndTime = 0;
let isFinalEndTime = 0;
let finalRequestEndTime = 0;
let newStream = true;
let bridgingOffset = 0;
let lastTranscriptWasFinal = false;

function startStream() {
  audioArray = [];
  // Initiate (Reinitiate) a recognize stream
  recognizeStream = client
    .streamingRecognize(request)
    .on('error', (err) => {
        //console.error('API request error ' + err);
    })
    .on('data', speechCallback);

  setTimeout(restartStream, STREAMING_LIMIT);
}

const audioStreamTransform = new Transform({
  transform: (chunk, encoding, callback) => {

    if(newStream && (lastAudioArray.length !=0 )) {
    //approximate math to calculate time of chunks
      let chunkTime = STREAMING_LIMIT / lastAudioArray.length;
      if(chunkTime != 0){
        if (bridgingOffset < 0) {
          bridgingOffset = 0;
        }
        if(bridgingOffset > finalRequestEndTime) {
          bridgingOffset = finalRequestEndTime;
        }
        let chunksFromMS = Math.floor(
          (finalRequestEndTime - bridgingOffset) / chunkTime
        );
        bridgingOffset = Math.floor(
          (lastAudioArray.length - chunksFromMS) * chunkTime
        );

        for(let i=chunksFromMS; i<lastAudioArray.length; i++){
          recognizeStream.write(lastAudioArray[i]);
        }

      }
      newStream = false;
    }

    audioArray.push(chunk);

    if (recognizeStream!=null) {
      recognizeStream.write(chunk);
    }

    callback();
  }
})

const speechCallback = (stream) => {

  resultEndTime = stream.results[0].resultEndTime.seconds * 1000 +
    Math.round(stream.results[0].resultEndTime.nanos / 1000000);

  let correctedTime =
    resultEndTime - bridgingOffset + (STREAMING_LIMIT * restartCounter);

  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  let stdoutText = `\n\nReached transcription time limit, press Ctrl+C\n`;
  if(stream.results[0] && stream.results[0].alternatives[0]){
    stdoutText =
      correctedTime + ': ' + stream.results[0].alternatives[0].transcript;
  }

  if(stream.results[0].isFinal){

    process.stdout.write(chalk.green(`${stdoutText}\n`));

    isFinalEndTime = resultEndTime;
    lastTranscriptWasFinal = true;
  }
  else {
    //make sure transcript does not exceed console character length
    if (stdoutText.length > process.stdout.columns){
      stdoutText = stdoutText.substring(0, process.stdout.columns-4) + '...';
    }
    process.stdout.write(chalk.red(`${stdoutText}`));

    lastTranscriptWasFinal = false;
  }
};
function restartStream() {

  if(recognizeStream){
    recognizeStream.removeListener('data', speechCallback);
    recognizeStream = null;
  }
  if(resultEndTime>0){
      finalRequestEndTime = isFinalEndTime;
  }
  resultEndTime = 0;

  lastAudioArray = [];
  lastAudioArray = audioArray;

  restartCounter++;

  if(!lastTranscriptWasFinal){
    process.stdout.write(`\n`);
  }
  process.stdout.write(chalk.yellow(
    `${(STREAMING_LIMIT * restartCounter)}: RESTARTING REQUEST\n`)
  );

  newStream=true;

  startStream();
}

record
  .start({
    sampleRateHertz: 16000,
    threshold: 0, //silence threshold
    silence: (STREAMING_LIMIT*2)/1000,
    keepSilence: true,
    recordProgram: 'rec', // Try also "arecord" or "sox"
  })
  .on('error', (err) => {
    console.error('Audio recording error ' + err);
  })
  .pipe(audioStreamTransform);

console.log('');
console.log('Listening, press Ctrl+C to stop.');
console.log('');
console.log('End (ms)       Transcript Results/Status');
console.log('=========================================================');

startStream();
