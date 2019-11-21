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

// DO NOT EDIT! This is a generated sample ("Request",  "speech_transcribe_enhanced_model")

// sample-metadata:
//   title: Using Enhanced Models (Local File)
//   description: Transcribe a short audio file using an enhanced model
//   usage: node samples/v1/speech_transcribe_enhanced_model.js [--local_file_path "resources/hello.wav"]

'use strict';

function main(localFilePath = 'resources/hello.wav') {
  // [START speech_transcribe_enhanced_model]
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  // const localFilePath = 'resources/hello.wav';

  // Imports the client library
  const {SpeechClient} = require('@google-cloud/speech').v1;

  // Additional imports
  const fs = require('fs');

  // Instantiates a client
  const speechClient = new SpeechClient();

  async function sampleRecognize() {
    // The enhanced model to use, e.g. phone_call
    // Currently phone_call is the only model available as an enhanced model.
    const model = 'phone_call';

    // Use an enhanced model for speech recognition (when set to true).
    // Project must be eligible for requesting enhanced models.
    // Enhanced speech models require that you opt-in to data logging.
    const useEnhanced = true;

    // The language of the supplied audio
    const languageCode = 'en-US';
    const config = {
      model: model,
      useEnhanced: useEnhanced,
      languageCode: languageCode,
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

    // Run request
    const [response] = await speechClient.recognize(request);

    for (const result of response.results) {
      // First alternative is the most probable result
      const alternative = result.alternatives[0];
      console.log(`Transcript: ${alternative.transcript}`);
    }
  }
  sampleRecognize();
  // [END speech_transcribe_enhanced_model]
}

const argv = require(`yargs`).option('local_file_path', {
  default: 'resources/hello.wav',
  string: true,
}).argv;

main(argv.local_file_path);
