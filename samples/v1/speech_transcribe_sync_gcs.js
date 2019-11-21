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

// DO NOT EDIT! This is a generated sample ("Request",  "speech_transcribe_sync_gcs")

// sample-metadata:
//   title: Transcript Audio File (Cloud Storage)
//   description: Transcribe short audio file from Cloud Storage using synchronous speech recognition
//   usage: node samples/v1/speech_transcribe_sync_gcs.js [--storage_uri "gs://cloud-samples-data/speech/brooklyn_bridge.raw"]

'use strict';

function main(
  storageUri = 'gs://cloud-samples-data/speech/brooklyn_bridge.raw'
) {
  // [START speech_transcribe_sync_gcs]
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  // const storageUri = 'gs://cloud-samples-data/speech/brooklyn_bridge.raw';

  // Imports the client library
  const {SpeechClient} = require('@google-cloud/speech').v1;

  // Instantiates a client
  const speechClient = new SpeechClient();

  async function sampleRecognize() {
    // Sample rate in Hertz of the audio data sent
    const sampleRateHertz = 16000;

    // The language of the supplied audio
    const languageCode = 'en-US';

    // Encoding of audio data sent. This sample sets this explicitly.
    // This field is optional for FLAC and WAV audio formats.
    const encoding = 'LINEAR16';
    const config = {
      sampleRateHertz: sampleRateHertz,
      languageCode: languageCode,
      encoding: encoding,
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
  // [END speech_transcribe_sync_gcs]
}

const argv = require(`yargs`).option('storage_uri', {
  default: 'gs://cloud-samples-data/speech/brooklyn_bridge.raw',
  string: true,
}).argv;

main(argv.storage_uri);
