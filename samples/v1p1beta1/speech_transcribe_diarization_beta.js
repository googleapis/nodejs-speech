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

// DO NOT EDIT! This is a generated sample ("LongRunningPromiseAwait",  "speech_transcribe_diarization_beta")

// sample-metadata:
//   title: Separating different speakers (Local File) (LRO) (Beta)
//   description: Print confidence level for individual words in a transcription of a short audio file
//     Separating different speakers in an audio file recording
//   usage: node samples/v1p1beta1/speech_transcribe_diarization_beta.js [--local_file_path "resources/commercial_mono.wav"]

'use strict';

function main(localFilePath = 'resources/commercial_mono.wav') {
  // [START speech_transcribe_diarization_beta]
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  // const localFilePath = 'resources/commercial_mono.wav';

  // Imports the client library
  const {SpeechClient} = require('@google-cloud/speech').v1p1beta1;

  // Additional imports
  const fs = require('fs');

  // Instantiates a client
  const speechClient = new SpeechClient();

  async function sampleLongRunningRecognize() {
    // If enabled, each word in the first alternative of each result will be
    // tagged with a speaker tag to identify the speaker.
    const enableSpeakerDiarization = true;

    // Optional. Specifies the estimated number of speakers in the conversation.
    const diarizationSpeakerCount = 2;

    // The language of the supplied audio
    const languageCode = 'en-US';
    const config = {
      enableSpeakerDiarization: enableSpeakerDiarization,
      diarizationSpeakerCount: diarizationSpeakerCount,
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

    // Start long-running operation. You can wait for now or get results later.
    const [operation] = await speechClient.longRunningRecognize(request);

    // Wait for operation to complete.
    const [response] = await operation.promise();

    for (const result of response.results) {
      // First alternative has words tagged with speakers
      const alternative = result.alternatives[0];
      console.log(`Transcript: ${alternative.transcript}`);
      // Print the speakerTag of each word
      for (const word of alternative.words) {
        console.log(`Word: ${word.word}`);
        console.log(`Speaker tag: ${word.speakerTag}`);
      }
    }
  }
  sampleLongRunningRecognize();
  // [END speech_transcribe_diarization_beta]
}

const argv = require(`yargs`).option('local_file_path', {
  default: 'resources/commercial_mono.wav',
  string: true,
}).argv;

main(argv.local_file_path);
