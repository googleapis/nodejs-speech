// Copyright 2021 Google LLC
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

'use strict';

function main(
  inputUri,
  outputStorageUri,
  encoding,
  sampleRateHertz,
  languageCode
) {
  // [START speech_export_to_gcs]
  /**
   * TODO(developer): Uncomment these variables before running the sample.\
   * (Not necessary if passing values as arguments)
   */

  // const inputUri = 'YOUR_AUDIO_TO_TRANSCRIBE';
  // const outputStorageUri = 'YOUR_STORAGE_BUCKET_OUTPUT_URI';
  // const encoding = 'ENCODING_OF_AUDIO_FILE';
  // const sampleRateHertz = 16000 // Sampling rate;
  // const languageCode = 'BCP-47_LANGUAGE_CODE_OF_AUDIO';

  // Imports the Speech-to-Text client library
  const speech = require('@google-cloud/speech').v1p1beta1;

  // Creates a client
  const client = new speech.SpeechClient();

  async function exportTranscriptToStorage() {
    const audio = {
      uri: inputUri,
    };

    // Pass in the URI of the Cloud Storage bucket to hold the transcription
    const outputConfig = {
      gcsUri: outputStorageUri,
    };

    const config = {
      encoding,
      sampleRateHertz,
      languageCode,
    };

    const request = {
      config,
      audio,
      outputConfig,
    };

    const [operation] = await client.longRunningRecognize(request);

    // Wait for operation to complete
    const [response] = await operation.promise();

    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log('Transcription: ', transcription);
  }
  exportTranscriptToStorage();
  // [END speech_export_to_gcs]
}

process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});

main(...process.argv.slice(2));
