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

// DO NOT EDIT! This is a generated sample ("Request",  "speech_transcribe_multilanguage_beta")

// sample-metadata:
//   title: Detecting language spoken automatically (Local File) (Beta)
//   description: Transcribe a short audio file with language detected from a list of possible languages
//   usage: node samples/v1p1beta1/speech_transcribe_multilanguage_beta.js [--local_file_path "resources/brooklyn_bridge.flac"]

'use strict';

function main(localFilePath = 'resources/brooklyn_bridge.flac') {
  // [START speech_transcribe_multilanguage_beta]
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
    // The language of the supplied audio. Even though additional languages are
    // provided by alternative_language_codes, a primary language is still required.
    const languageCode = 'fr';

    // Specify up to 3 additional languages as possible alternative languages
    // of the supplied audio.
    const alternativeLanguageCodesElement = 'es';
    const alternativeLanguageCodesElement2 = 'en';
    const alternativeLanguageCodes = [
      alternativeLanguageCodesElement,
      alternativeLanguageCodesElement2,
    ];
    const config = {
      languageCode: languageCode,
      alternativeLanguageCodes: alternativeLanguageCodes,
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
      // The languageCode which was detected as the most likely being spoken in the audio
      console.log(`Detected language: ${result.languageCode}`);
      // First alternative is the most probable result
      const alternative = result.alternatives[0];
      console.log(`Transcript: ${alternative.transcript}`);
    }
  }
  sampleRecognize();
  // [END speech_transcribe_multilanguage_beta]
}

const argv = require(`yargs`).option('local_file_path', {
  default: 'resources/brooklyn_bridge.flac',
  string: true,
}).argv;

main(argv.local_file_path);
