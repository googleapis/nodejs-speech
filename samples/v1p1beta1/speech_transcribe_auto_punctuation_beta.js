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

// DO NOT EDIT! This is a generated sample ("Request",  "speech_transcribe_auto_punctuation_beta")

// sample-metadata:
//   title: Getting punctuation in results (Local File) (Beta)
//   description: Transcribe a short audio file with punctuation
//   usage: node samples/v1p1beta1/speech_transcribe_auto_punctuation_beta.js [--local_file_path "resources/commercial_mono.wav"]

'use strict';

function main(localFilePath = 'resources/commercial_mono.wav') {
  // [START speech_transcribe_auto_punctuation_beta]
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  // const localFilePath = 'resources/commercial_mono.wav';

  // Imports the client library
  const {SpeechClient} = require('@google-cloud/speech').v1p1beta1;

  // Additional imports
  const fs = require('fs');

  // Instantiates a client
  const speechClient = new SpeechClient();

  async function sampleRecognize() {
    // When enabled, trascription results may include punctuation
    // (available for select languages).
    const enableAutomaticPunctuation = true;

    // The language of the supplied audio. Even though additional languages are
    // provided by alternative_language_codes, a primary language is still required.
    const languageCode = 'en-US';
    const config = {
      enableAutomaticPunctuation: enableAutomaticPunctuation,
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
  // [END speech_transcribe_auto_punctuation_beta]
}

const argv = require(`yargs`).option('local_file_path', {
  default: 'resources/commercial_mono.wav',
  string: true,
}).argv;

main(argv.local_file_path);
