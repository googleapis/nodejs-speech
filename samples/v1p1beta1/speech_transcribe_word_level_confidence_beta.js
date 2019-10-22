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

// [START speech_transcribe_word_level_confidence_beta]

const {SpeechClient} = require('@google-cloud/speech').v1p1beta1;

const fs = require('fs');
/**
 * Print confidence level for individual words in a transcription of a short audio file.
 *
 * @param localFilePath {string} Path to local audio file, e.g. /path/audio.wav
 */
function sampleRecognize(localFilePath) {
  const client = new SpeechClient();
  // const localFilePath = 'resources/brooklyn_bridge.flac';

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
  const request = {
    config: config,
    audio: audio,
  };
  client
    .recognize(request)
    .then(responses => {
      const response = responses[0];
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
    })
    .catch(err => {
      console.error(err);
    });
}

// [END speech_transcribe_word_level_confidence_beta]
// tslint:disable-next-line:no-any

const argv = require(`yargs`).option('local_file_path', {
  default: 'resources/brooklyn_bridge.flac',
  string: true,
}).argv;

sampleRecognize(argv.local_file_path);
