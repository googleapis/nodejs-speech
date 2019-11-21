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

function main(
  storageUri = 'gs://cloud-samples-data/speech/hello.wav',
  model = 'phone_call'
) {
  // [START speech_transcribe_model_selection_gcs]
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  // const storageUri = 'gs://cloud-samples-data/speech/hello.wav';
  // const model = 'phone_call';

  // Imports the client library
  const {SpeechClient} = require('@google-cloud/speech').v1;

  // Instantiates a client
  const speechClient = new SpeechClient();

  async function sampleRecognize() {
    // The language of the supplied audio
    const languageCode = 'en-US';
    const config = {
      model: model,
      languageCode: languageCode,
    };
    const audio = {
      uri: storageUri,
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
  // [END speech_transcribe_model_selection_gcs]
}

const argv = require(`yargs`)
  .option('storage_uri', {
    default: 'gs://cloud-samples-data/speech/hello.wav',
    string: true,
  })
  .option('model', {
    default: 'phone_call',
    string: true,
  }).argv;

main(argv.storage_uri, argv.model);
