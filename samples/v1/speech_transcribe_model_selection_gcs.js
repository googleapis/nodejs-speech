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

// DO NOT EDIT! This is a generated sample ("Request",  "speech_transcribe_model_selection_gcs")

// sample-metadata:
//   title: Selecting a Transcription Model (Cloud Storage)
//   description: Transcribe a short audio file from Cloud Storage using a specified transcription model
//   usage: node samples/v1/speech_transcribe_model_selection_gcs.js [--storage_uri "gs://cloud-samples-data/speech/hello.wav"] [--model "phone_call"]

'use strict';

// [START speech_transcribe_model_selection_gcs]

const {SpeechClient} = require('@google-cloud/speech').v1;

/**
 * Transcribe a short audio file from Cloud Storage using a specified transcription model
 *
 * @param storageUri {string} URI for audio file in Cloud Storage, e.g. gs://[BUCKET]/[FILE]
 * @param model {string} The transcription model to use, e.g. video, phone_call, default
 * For a list of available transcription models, see:
 * https://cloud.google.com/speech-to-text/docs/transcription-model#transcription_models
 */
function sampleRecognize(storageUri, model) {
  const client = new SpeechClient();
  // const storageUri = 'gs://cloud-samples-data/speech/hello.wav';
  // const model = 'phone_call';

  // The language of the supplied audio
  const languageCode = 'en-US';
  const config = {
    model: model,
    languageCode: languageCode,
  };
  const audio = {
    uri: storageUri,
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

// [END speech_transcribe_model_selection_gcs]
// tslint:disable-next-line:no-any

const argv = require(`yargs`)
  .option('storage_uri', {
    default: 'gs://cloud-samples-data/speech/hello.wav',
    string: true,
  })
  .option('model', {
    default: 'phone_call',
    string: true,
  }).argv;

sampleRecognize(argv.storage_uri, argv.model);
