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

// DO NOT EDIT! This is a generated sample ("Request",  "speech_transcribe_multichannel_gcs")

// sample-metadata:
//   title: Multi-Channel Audio Transcription (Cloud Storage)
//   description: Transcribe a short audio file from Cloud Storage with multiple channels
//   usage: node samples/v1/speech_transcribe_multichannel_gcs.js [--storage_uri "gs://cloud-samples-data/speech/multi.wav"]

'use strict';

function main(storageUri = 'gs://cloud-samples-data/speech/multi.wav') {
  // [START speech_transcribe_multichannel_gcs]
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  // const storageUri = 'gs://cloud-samples-data/speech/multi.wav';

  // Imports the client library
  const {SpeechClient} = require('@google-cloud/speech').v1;

  // Instantiates a client
  const speechClient = new SpeechClient();

  async function sampleRecognize() {
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
      // channelTag to recognize which audio channel this result is for
      console.log(`Channel tag: ${result.channelTag}`);
      // First alternative is the most probable result
      const alternative = result.alternatives[0];
      console.log(`Transcript: ${alternative.transcript}`);
    }
  }
  sampleRecognize();
  // [END speech_transcribe_multichannel_gcs]
}

const argv = require(`yargs`).option('storage_uri', {
  default: 'gs://cloud-samples-data/speech/multi.wav',
  string: true,
}).argv;

main(argv.storage_uri);
