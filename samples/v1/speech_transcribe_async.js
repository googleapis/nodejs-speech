// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// DO NOT EDIT! This is a generated sample ("LongRunningPromiseAwait",  "speech_transcribe_async")

// sample-metadata:
//   title: Transcribe Audio File using Long Running Operation (Local File) (LRO)
//   description: Transcribe a long audio file using asynchronous speech recognition
//   usage: node samples/v1/speech_transcribe_async.js [--local_file_path "resources/brooklyn_bridge.raw"]

'use strict';

function main(localFilePath = 'resources/brooklyn_bridge.raw') {
  // [START speech_transcribe_async]
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  // const localFilePath = 'resources/brooklyn_bridge.raw';

  // Imports the client library
  const {SpeechClient} = require('@google-cloud/speech').v1;

  // Additional imports
  const fs = require('fs');

  // Instantiates a client
  const speechClient = new SpeechClient();

  async function sampleLongRunningRecognize() {
    // The language of the supplied audio
    const languageCode = 'en-US';

    // Sample rate in Hertz of the audio data sent
    const sampleRateHertz = 16000;

    // Encoding of audio data sent. This sample sets this explicitly.
    // This field is optional for FLAC and WAV audio formats.
    const encoding = 'LINEAR16';
    const config = {
      languageCode: languageCode,
      sampleRateHertz: sampleRateHertz,
      encoding: encoding,
    };
    const content = fs.readFileSync(localFilePath).toString('base64');
    const audio = {
      content: content,
    };

    // Construct request
    const request = {
      config: config,
      audio: audio,
    };

    // Start long-running operation. You can wait for now or get results later.
    const [operation] = await speechClient.longRunningRecognize(request);

    // Wait for operation to complete.
    const [response] = await operation.promise();

    for (const result of response.results) {
      // First alternative is the most probable result
      const alternative = result.alternatives[0];
      console.log(`Transcript: ${alternative.transcript}`);
    }
  }
  sampleLongRunningRecognize();
  // [END speech_transcribe_async]
}

const argv = require(`yargs`).option('local_file_path', {
  default: 'resources/brooklyn_bridge.raw',
  string: true,
}).argv;

main(argv.local_file_path);
