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

// DO NOT EDIT! This is a generated sample ("Request",  "speech_contexts_classes_beta")

// sample-metadata:
//   title: Using Context Classes (Cloud Storage)
//   description: Transcribe a short audio file with static context classes.
//   usage: node samples/v1p1beta1/speech_contexts_classes_beta.js [--storage_uri "gs://cloud-samples-data/speech/time.mp3"] [--phrase "$TIME"]

'use strict';

// [START speech_contexts_classes_beta]

const {SpeechClient} = require('@google-cloud/speech').v1p1beta1;

/**
 * Transcribe a short audio file with static context classes.
 *
 * @param storageUri {string} URI for audio file in Cloud Storage, e.g. gs://[BUCKET]/[FILE]
 * @param phrase {string} Phrase "hints" help recognize the specified phrases from your audio.
 * In this sample we are using a static class phrase ($TIME).
 * Classes represent groups of words that represent common concepts
 * that occur in natural language.
 */
function sampleRecognize(storageUri, phrase) {
  const client = new SpeechClient();
  // const storageUri = 'gs://cloud-samples-data/speech/time.mp3';
  // const phrase = '$TIME';
  const phrases = [phrase];
  const speechContextsElement = {
    phrases: phrases,
  };
  const speechContexts = [speechContextsElement];

  // The language of the supplied audio
  const languageCode = 'en-US';

  // Sample rate in Hertz of the audio data sent
  const sampleRateHertz = 24000;

  // Encoding of audio data sent. This sample sets this explicitly.
  // This field is optional for FLAC and WAV audio formats.
  const encoding = 'MP3';
  const config = {
    speechContexts: speechContexts,
    languageCode: languageCode,
    sampleRateHertz: sampleRateHertz,
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

// [END speech_contexts_classes_beta]
// tslint:disable-next-line:no-any

const argv = require(`yargs`)
  .option('storage_uri', {
    default: 'gs://cloud-samples-data/speech/time.mp3',
    string: true,
  })
  .option('phrase', {
    default: '$TIME',
    string: true,
  }).argv;

sampleRecognize(argv.storage_uri, argv.phrase);
