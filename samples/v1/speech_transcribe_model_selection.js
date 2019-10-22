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

// DO NOT EDIT! This is a generated sample ("Request",  "speech_transcribe_model_selection")

// sample-metadata:
//   title: Selecting a Transcription Model (Local File)
//   description: Transcribe a short audio file using a specified transcription model
//   usage: node samples/v1/speech_transcribe_model_selection.js [--local_file_path "resources/hello.wav"] [--model "phone_call"]

'use strict';

// [START speech_transcribe_model_selection]

const {SpeechClient} = require('@google-cloud/speech').v1;

const fs = require('fs');
/**
 * Transcribe a short audio file using a specified transcription model
 *
 * @param localFilePath {string} Path to local audio file, e.g. /path/audio.wav
 * @param model {string} The transcription model to use, e.g. video, phone_call, default
 * For a list of available transcription models, see:
 * https://cloud.google.com/speech-to-text/docs/transcription-model#transcription_models
 */
function sampleRecognize(localFilePath, model) {
  const client = new SpeechClient();
  // const localFilePath = 'resources/hello.wav';
  // const model = 'phone_call';

  // The language of the supplied audio
  const languageCode = 'en-US';
  const config = {
    model: model,
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

// [END speech_transcribe_model_selection]
// tslint:disable-next-line:no-any

const argv = require(`yargs`)
  .option('local_file_path', {
    default: 'resources/hello.wav',
    string: true,
  })
  .option('model', {
    default: 'phone_call',
    string: true,
  }).argv;

sampleRecognize(argv.local_file_path, argv.model);
