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

// DO NOT EDIT! This is a generated sample ("Request",  "speech_transcribe_word_level_confidence_beta")

// sample-metadata:
//   title: Enabling word-level confidence (Local File) (Beta)
//   description: Print confidence level for individual words in a transcription of a short audio file.
//   usage: node samples/v1p1beta1/speech_transcribe_word_level_confidence_beta.js [--local_file_path "resources/brooklyn_bridge.flac"]

'use strict';

function main(localFilePath = 'resources/brooklyn_bridge.flac') {
  // [START speech_transcribe_word_level_confidence_beta]
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  // const localFilePath = 'resources/brooklyn_bridge.flac';

  // Imports the client library
  const {SpeechClient} = require('@google-cloud/speech').v1p1beta1;

  // Additional imports
  const fs = require('fs');

  // Instantiates a client
  const speechClient = new SpeechClient();

  async function sampleRecognize() {
    // When enabled, the first result returned by the API will include a list
    // of words and the confidence level for each of those words.
    const enableWordConfidence = true;

    // The language of the supplied audio
    const languageCode = 'en-US';
    const config = {
      enableWordConfidence: enableWordConfidence,
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

    // The first result includes confidence levels per word
    const result = response.results[0];
    // First alternative is the most probable result
    const alternative = result.alternatives[0];
    console.log(`Transcript: ${alternative.transcript}`);
    // Print the confidence level of each word
    for (const word of alternative.words) {
      console.log(`Word: ${word.word}`);
      console.log(`Confidence: ${word.confidence}`);
    }
  }
  sampleRecognize();
  // [END speech_transcribe_word_level_confidence_beta]
}

const argv = require(`yargs`).option('local_file_path', {
  default: 'resources/brooklyn_bridge.flac',
  string: true,
}).argv;

main(argv.local_file_path);
