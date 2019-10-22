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

// [START speech_transcribe_diarization_beta]

const {SpeechClient} = require('@google-cloud/speech').v1p1beta1;

const fs = require('fs');
/**
 * Print confidence level for individual words in a transcription of a short audio file
 * Separating different speakers in an audio file recording
 *
 * @param localFilePath {string} Path to local audio file, e.g. /path/audio.wav
 */
async function sampleLongRunningRecognize(localFilePath) {
  const client = new SpeechClient();
  // const localFilePath = 'resources/commercial_mono.wav';

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
  const request = {
    config: config,
    audio: audio,
  };

  // Create a job whose results you can either wait for now, or get later
  const [operation] = await client.longRunningRecognize(request);

  // Get a Promise representation of the final result of the job
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

// [END speech_transcribe_diarization_beta]
// tslint:disable-next-line:no-any

const argv = require(`yargs`).option('local_file_path', {
  default: 'resources/commercial_mono.wav',
  string: true,
}).argv;

sampleLongRunningRecognize(argv.local_file_path).catch(console.error);
