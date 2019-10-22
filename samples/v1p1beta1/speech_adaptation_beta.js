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

// DO NOT EDIT! This is a generated sample ("Request",  "speech_adaptation_beta")

// sample-metadata:
//   title: Speech Adaptation (Cloud Storage)
//   description: Transcribe a short audio file with speech adaptation.
//   usage: node samples/v1p1beta1/speech_adaptation_beta.js [--storage_uri "gs://cloud-samples-data/speech/brooklyn_bridge.mp3"] [--phrase "Brooklyn Bridge"]

'use strict';

// [START speech_adaptation_beta]

const {SpeechClient} = require('@google-cloud/speech').v1p1beta1;

/**
 * Transcribe a short audio file with speech adaptation.
 *
 * @param storageUri {string} URI for audio file in Cloud Storage, e.g. gs://[BUCKET]/[FILE]
 * @param phrase {string} Phrase "hints" help recognize the specified phrases from your audio.
 */
function sampleRecognize(storageUri, phrase) {
  const client = new SpeechClient();
  // const storageUri = 'gs://cloud-samples-data/speech/brooklyn_bridge.mp3';
  // const phrase = 'Brooklyn Bridge';
  const phrases = [phrase];

  // Hint Boost. This value increases the probability that a specific
  // phrase will be recognized over other similar sounding phrases.
  // The higher the boost, the higher the chance of false positive
  // recognition as well. Can accept wide range of positive values.
  // Most use cases are best served with values between 0 and 20.
  // Using a binary search happroach may help you find the optimal value.
  const boost = 20.0;
  const speechContextsElement = {
    phrases: phrases,
    boost: boost,
  };
  const speechContexts = [speechContextsElement];

  // Sample rate in Hertz of the audio data sent
  const sampleRateHertz = 44100;

  // The language of the supplied audio
  const languageCode = 'en-US';

  // Encoding of audio data sent. This sample sets this explicitly.
  // This field is optional for FLAC and WAV audio formats.
  const encoding = 'MP3';
  const config = {
    speechContexts: speechContexts,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
    encoding: encoding,
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

// [END speech_adaptation_beta]
// tslint:disable-next-line:no-any

const argv = require(`yargs`)
  .option('storage_uri', {
    default: 'gs://cloud-samples-data/speech/brooklyn_bridge.mp3',
    string: true,
  })
  .option('phrase', {
    default: 'Brooklyn Bridge',
    string: true,
  }).argv;

sampleRecognize(argv.storage_uri, argv.phrase);
