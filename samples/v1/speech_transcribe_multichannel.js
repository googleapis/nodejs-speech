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

// DO NOT EDIT! This is a generated sample ("Request",  "speech_transcribe_multichannel")

// sample-metadata:
//   title: Multi-Channel Audio Transcription (Local File)
//   description: Transcribe a short audio file with multiple channels
//   usage: node samples/v1/speech_transcribe_multichannel.js [--local_file_path "resources/multi.wav"]

'use strict';

// [START speech_transcribe_multichannel]

const {SpeechClient} = require('@google-cloud/speech').v1;

const fs = require('fs');
/**
 * Transcribe a short audio file with multiple channels
 *
 * @param localFilePath {string} Path to local audio file, e.g. /path/audio.wav
 */
function sampleRecognize(localFilePath) {
  const client = new SpeechClient();
  // const localFilePath = 'resources/multi.wav';

  // The number of channels in the input audio file (optional)
  const audioChannelCount = 2;

  // When set to true, each audio channel will be recognized separately.
  // The recognition result will contain a channel_tag field to state which
  // channel that result belongs to
  const enableSeparateRecognitionPerChannel = true;

  // The language of the supplied audio
  const languageCode = 'en-US';
  const config = {
    audioChannelCount: audioChannelCount,
    enableSeparateRecognitionPerChannel: enableSeparateRecognitionPerChannel,
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
        // channelTag to recognize which audio channel this result is for
        console.log(`Channel tag: ${result.channelTag}`);
        // First alternative is the most probable result
        const alternative = result.alternatives[0];
        console.log(`Transcript: ${alternative.transcript}`);
      }
    })
    .catch(err => {
      console.error(err);
    });
}

// [END speech_transcribe_multichannel]
// tslint:disable-next-line:no-any

const argv = require(`yargs`).option('local_file_path', {
  default: 'resources/multi.wav',
  string: true,
}).argv;

sampleRecognize(argv.local_file_path);
