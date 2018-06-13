/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This application demonstrates how to perform basic recognize operations with
 * with the Google Cloud Speech API.
 *
 * For more information, see the README.md under /speech and the documentation
 * at https://cloud.google.com/speech/docs.
 */

'use strict';

/**
 * Note: Correct microphone settings is required: check enclosed link, and make
 * sure the following conditions are met:
 * 1. SoX must be installed and available in your $PATH- it can be found here:
 * http://sox.sourceforge.net/
 * 2. Microphone must be working
 * 3. Encoding, sampleRateHertz, and # of channels must match header of audio file you're
 * recording to.
 * 4. Get Node-Record-lpcm16 https://www.npmjs.com/package/node-record-lpcm16
 * More Info: https://cloud.google.com/speech-to-text/docs/streaming-recognize
 */

//uncomment below and see Errata at end of file for more configurations
// const encoding = 'LINEAR16';
// const sampleRateHertz = 16000;
// const languageCode = 'en-US';

//Event Emitter for Combined Test
const events = require(`events`);
const eventEmitter = new events.EventEmitter();

eventEmitter.on(`micStreamRecognize: complete`, () => {
  //console.log(`***EventEmitter reports: micStreamRecognize: complete***`);
});

eventEmitter.on(`wavFileToText: complete`, () => {
  //console.log(`***EventEmitter reports: wavFileToText: complete***`);
});

eventEmitter.on(`micStreamRecognize: Started`, () => {
  //console.log(`***EventEmitter reports: micStreamRecognize: Started***`);
});

eventEmitter.on(`wavFileToText: Started`, () => {
  //console.log(`***EventEmitter reports: wavFileToText: Started***`);
});

eventEmitter.on(`test_1: Started`, () => {
  //console.log(`***EventEmitter reports: test_1: Started***`);
});

eventEmitter.on(`test_1: complete`, () => {
  //console.log(`***EventEmitter reports: test_1: complete***`);
});

function micStreamRecognize(
  filename,
  secondsofRecording,
  encoding,
  sampleRateHertz,
  languageCode
) {
  // [START micStreamRecognize]
  //returns speech-to-text, from streamingRecognize - request object is simplified
  //streams audio from microphone to filename, for secondsofRecording seconds, using simplified request object
  //config is .wav by default, change request object (see above) for more options.
  eventEmitter.emit(`micStreamRecognize: Started`);

  const config = {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  };

  const request = {
    config,
    interimResults: true, // If you want interim results, set this to true
  };

  //To write .wav to file
  const fs = require('fs');

  //Node-Record-lpcm16
  const record = require('node-record-lpcm16');
  //https://www.npmjs.com/package/node-record-lpcm16

  // Imports the Google Cloud client library
  const speech = require('@google-cloud/speech');

  // Creates a client
  const client = new speech.SpeechClient();

  //Creates an array of interim results, for testing
  var InterimResults = [];

  //defensive code in case user doesn't specify audio file type
  if (filename.substr(filename.length - 4) !== `.wav`)
    filename = filename + `.wav`;

  var file = fs.createWriteStream(filename, {
    encoding: 'binary',
  });

  // Create a recognize stream
  const recognizeStream = client
    .streamingRecognize(request)
    .on('error', console.error)
    .on('data', data => {
      if (
        data.results[0] &&
        data.results[0].alternatives[0] &&
        data.results[0].isFinal
      )
        process.stdout.write(
          `micStreamRecognize: Transcript; 
          ${data.results[0].alternatives[0].transcript} \n`
        );
      streamtranscription = data.results[0].alternatives[0].transcript;
      var a = [];
      a.push(data.results[0].alternatives[0].transcript);
      a.push(data.results[0].isFinal.toString());
      if (!data.results[0].isFinal)
        a.push(data.results[0].stability.toString());
      InterimResults.push(a); //CF: array of alternatives for testing
    });

  // Start recording and send the microphone input to the Speech API
  record
    .start({
      sampleRateHertz: sampleRateHertz,
      threshold: 0, //silence threshold
      // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
      //verbose: true, //CF: verbose true just outputs 1/2 the samplerateHertz every 1/2 sec.  Not all that necessary.
      recordProgram: 'rec', // was 'rec' : Try also "arecord" or "sox"
      silence: '5.0', //seconds of silence before ending
      //device: null
    })
    .on(`data`, chunk => {
      file.write(chunk);
    })
    .on('error', console.error)
    .pipe(recognizeStream);

  console.log(
    `micStreamRecognize: Listening for ${secondsofRecording} seconds, press Ctrl+C to stop.`
  );

  //CF: records for secondsofRecording seconds.
  setTimeout(function() {
    record.stop();
    console.log(`micStreamRecognize: Recording complete!`);
    console.log(
      `micStreamRecognize: There are ${
        InterimResults.length
      } InterimResults generated from the recording`
    );
    console.log(
      `**Note that best guess/ non-interim results below are included below, true, and don't include confidence value**`
    );

    for (var i in InterimResults) {
      console.log(`  `, i, `)`, InterimResults[i].toString());
    }
    eventEmitter.emit(`micStreamRecognize: complete`);
  }, secondsofRecording * 1000);
  return InterimResults;
  // [END micStreamRecognize]
}

function wavFileToText(filename, encoding, sampleRateHertz, languageCode) {
  // [START wavFileToText]

  const config = {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  };
  eventEmitter.emit(`test_1: Started`);
  eventEmitter.emit(`wavFileToText: Started`);
  // Imports the Google Cloud client library
  const speech = require('@google-cloud/speech');

  // Imports fs to save recording locally
  const fs = require('fs');

  // Creates a client
  const client = new speech.SpeechClient();

  const path = require(`path`);

  filename = path.resolve(filename);
  console.log(`resolved filename ${filename}`);
  const audio = {
    content: fs.readFileSync(filename).toString('base64'),
  };

  const request = {
    config: config,
    audio: audio,
  };

  // Detects speech in the audio file
  client
    .recognize(request)
    .then(data => {
      const response = data[0];
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      console.log(`wavFileToText: Transcription; \n`, transcription);
      wavtranscription = transcription;
      const confidence = response.results
        .map(result => result.alternatives[0].confidence)
        .join('\n');
      console.log(`wavFileToText: Confidence; \n`, confidence);
      eventEmitter.emit(`wavFileToText: complete`);
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
  // [END wavFileToText]
}

function test_1(
  targetfile,
  recordingtime,
  encoding,
  sampleRateHertz,
  languageCode
) {
  const fs = require('fs');
  if (targetfile.substr(targetfile.length - 4) !== `.wav`)
    targetfile = targetfile + `.wav`;
  eventEmitter.emit(`test_1: Started`);
  fs.access(targetfile, fs.constants.W_OK, err => {
    console.log(`${targetfile} ${err ? 'is not writable' : 'is writable'}`);
  });
  var streamRes = micStreamRecognize(
    targetfile,
    recordingtime,
    encoding,
    sampleRateHertz,
    languageCode
  );
  var test1trans = [];
  eventEmitter.on(`micStreamRecognize: complete`, () => {
    wavFileToText(targetfile, encoding, sampleRateHertz, languageCode);
    for (var i in streamRes) {
      if (streamRes[i].length < 3) test1trans.push(`\n` + streamRes[i][0]);
    }
    console.log(`test_1: Streaming result(s); ${test1trans}`);
    console.log(`test_1: Complete!  File at: ${targetfile}`);
  });
  eventEmitter.on(`wavFileToText: complete`, () => {
    compareLiveStreamtoWavFile(wavtranscription, streamtranscription);
  });
}

//globals to assist with compareLiveStreamtoWavFile test (below)
var wavtranscription;
var streamtranscription;

//Simple test function that outputs to console results of comparing stream to .wav translation
function compareLiveStreamtoWavFile(wavtranscription, streamtranscription) {
  const wav = wavtranscription;
  const stream = streamtranscription;
  if (wav !== null && stream !== null) {
    console.log(
      `Is .Wav speech to text is same as Streamed speech to text?: ${(
        wav === stream
      ).toString()}`
    );
  }
  console.log(`stream speech to text is: ${stream}`);
  console.log(`   wav speech to text is: ${wav}`);
}

require(`yargs`)
  .demand(1)
  .command(
    `run`,
    `Runs complete streaming test: \n 1. streams from microphone, outputting streamed speech-to-text to console, \n 2. records that streamed sample to resources folder, \n 3. runs speech-to-text on that local file to compare to step 1.`,
    {},
    opts =>
      test_1(
        opts.targetfile,
        opts.recordingtime,
        opts.encoding,
        opts.sampleRateHertz,
        opts.languageCode
      )
  )
  .command(
    `wavFileToText`,
    `Runs .wav file to text translation from target file`,
    {},
    opts =>
      wavFileToText(
        opts.targetfile,
        opts.encoding,
        opts.sampleRateHertz,
        opts.languageCode
      )
  )
  .command(
    `micStreamRecognize`,
    `Streams audio input from microphone, translates to text`,
    {},
    opts =>
      micStreamRecognize(
        opts.targetfile,
        opts.recordingtime,
        opts.encoding,
        opts.sampleRateHertz,
        opts.languageCode
      )
  )

  .options({
    recordingtime: {
      alias: 't',
      default: 5,
      global: true,
      requiresArg: true,
      type: 'number',
    },
    targetfile: {
      alias: 'f',
      default: `./resources/ManualTest.wav`,
      global: true,
      requiresArg: false,
      type: 'string',
    },
    encoding: {
      alias: 'e',
      default: 'LINEAR16',
      global: true,
      requiresArg: true,
      type: 'string',
    },
    sampleRateHertz: {
      alias: 'r',
      default: 16000,
      global: true,
      requiresArg: true,
      type: 'number',
    },
    languageCode: {
      alias: 'l',
      default: 'en-US',
      global: true,
      requiresArg: true,
      type: 'string',
    },
  })
  .example(`node $0 run`)
  .example(`node $0 wavFileToText`)
  .example(`node $0 micStreamRecognize`)
  .wrap(120)
  .recommendCommands()
  .epilogue(`For more information, see https://cloud.google.com/speech/docs`)
  .help()
  .strict().argv;
