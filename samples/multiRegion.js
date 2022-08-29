// Copyright 2020 Google LLC
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

function main(gcsUri) {
  // [START syncRecognizeWithMultiRegion]
  // Filters profanity

  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  // const gcsUri = 'gs://my-bucket/audio.raw';

  async function syncRecognizeWithMultiRegion() {
    // Imports the Google Cloud client library
    const speech = require('@google-cloud/speech');

    // Declare your endpoint
    const endPoint = 'eu-speech.googleapis.com';

    // Creates a client
    const client = new speech.SpeechClient({apiEndpoint: endPoint});

    const audio = {
      uri: gcsUri,
    };

    const config = {
      encoding: 'FLAC',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
    };
    const request = {
      audio: audio,
      config: config,
    };

    // Detects speech in the audio file
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log(`Transcription: ${transcription}`);
  }
  syncRecognizeWithMultiRegion().catch(console.error);
  // [END syncRecognizeWithMultiRegion]
}

main(...process.argv.slice(2));
process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});
