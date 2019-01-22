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
 * This application demonstrates how to continuously perform basic recognize
 * operations with the Google Cloud Speech API.
 *
 * For more information, see the README.md under /speech and the documentation
 * at https://cloud.google.com/speech/docs.
 */

'use strict';

/**
 * Note: Correct microphone settings are required: check enclosed link, and make
 * sure the following conditions are met:
 * 1. SoX must be installed and available in your $PATH- it can be found here:
 * http://sox.sourceforge.net/
 * 2. Microphone must be working
 * 3. Encoding, sampleRateHertz, and # of channels must match header of audio
 * file you're recording to.
 * 4. Get Node-Record-lpcm16 https://www.npmjs.com/package/node-record-lpcm16
 * More Info: https://cloud.google.com/speech-to-text/docs/streaming-recognize
 */

// const encoding = 'LINEAR16';
// const sampleRateHertz = 16000;
// const languageCode = 'en-US';

function continuousMicrophoneStream(encoding, sampleRateHertz, languageCode) {
  // [START micStreamRecognize]

  // Node-Record-lpcm16
  const record = require('node-record-lpcm16');

  // Imports the Google Cloud client library
  const speech = require('@google-cloud/speech');

  const config = {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  };

  const request = {
    config,
    interimResults: true, //Get interim results from stream
  };

  const STREAMING_LIMIT = 55000

  // Create a client
  const client = new speech.SpeechClient();

  function startStream() {
    // Initiate (Reinitiate) a recognize stream
    const recognizeStream = client
      .streamingRecognize(request)
      .on('error', console.error)
      .on('data', data => {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(data.results[0].alternatives[0].transcript);
        if (data.results[0].isFinal) process.stdout.write('\n');
      });

    // Start recording and send the microphone input to the Speech API
    record
      .start({
        sampleRateHertz: sampleRateHertz,
        threshold: 0, //silence threshold
        recordProgram: 'rec', // Try also "arecord" or "sox"
      })
      .on('error', console.error)
      .pipe(recognizeStream);

    //Stop the stream before reinitializing it, after streaming_limit expires
    setTimeout(stopStream, STREAMING_LIMIT);
  }
  function stopStream() {
    record.stop();
    startStream();
  }
  console.log('Listening, press Ctrl+C to stop.');
  startStream();
}

var argv = require(`yargs`)
  .options({
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
  .example(`node $0`)
  .wrap(120)
  .epilogue(`For more information, see https://cloud.google.com/speech/docs`)
  .help()
  .strict().argv;

continuousMicrophoneStream(argv.encoding, argv.sampleRateHertz, argv.languageCode);
