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

// [START speech_transcribe_enhanced_model]

const {SpeechClient} = require('@google-cloud/speech').v1;

const fs = require('fs');
/**
 * Transcribe a short audio file using an enhanced model
 *
 * @param localFilePath {string} Path to local audio file, e.g. /path/audio.wav
 */
function sampleRecognize(localFilePath) {
  const client = new SpeechClient();
  // const localFilePath = 'resources/hello.wav';

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
  const request = {
    config: config,
    audio: audio,
  };
  client
    .recognize(request)
    .then(responses => {
      const response = responses[0];
      for (const result of response.results) {
        // First alternative is the most probable result
        const alternative = result.alternatives[0];
        console.log(`Transcript: ${alternative.transcript}`);
      }
    })
    .catch(err => {
      console.error(err);
    });
}

// [END speech_transcribe_enhanced_model]
// tslint:disable-next-line:no-any

const argv = require(`yargs`).option('local_file_path', {
  default: 'resources/hello.wav',
  string: true,
}).argv;

sampleRecognize(argv.local_file_path);
