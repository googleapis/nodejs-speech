// DO NOT EDIT! This is a generated sample ("Request",  "speech_quickstart_beta")
'use strict';

// sample-metadata:
//   title:
//   description: Performs synchronous speech recognition on an audio file.
//   usage: node samples/v1p1beta1/speech_quickstart_beta.js [--sample_rate_hertz 44100] [--language_code "en-US"] [--uri_path "gs://cloud-samples-data/speech/brooklyn_bridge.mp3"]

// [START speech_quickstart_beta]
// [START speech_quickstart_beta_core]

const speech = require('speech.v1p1beta1').v1p1beta1;

/**
 * Performs synchronous speech recognition on an audio file.
 *
 * @param sampleRateHertz {number} Sample rate in Hertz of the audio data sent in all
 * `RecognitionAudio` messages. Valid values are: 8000-48000.
 * @param languageCode {string} The language of the supplied audio.
 * @param uriPath {string} Path to the audio file stored on GCS.
 */
function sampleRecognize(sampleRateHertz, languageCode, uriPath) {
  const client = new speech.SpeechClient();
  // const sampleRateHertz = 44100;
  // const languageCode = 'en-US';
  // const uriPath = 'gs://cloud-samples-data/speech/brooklyn_bridge.mp3';
  const encoding = 'MP3';
  const config = {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  };
  const audio = {
    uri: uriPath,
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
        const transcript = result.alternatives[0].transcript;
        console.log(`Transcript: ${transcript}`);
      }
    })
    .catch(err => {
      console.error(err);
    });
}

// [END speech_quickstart_beta_core]
// [END speech_quickstart_beta]
// tslint:disable-next-line:no-any

const argv = require(`yargs`)
  .option('sample_rate_hertz', {
    default: 44100,
    number: true,
  })
  .option('language_code', {
    default: 'en-US',
    string: true,
  })
  .option('uri_path', {
    default: 'gs://cloud-samples-data/speech/brooklyn_bridge.mp3',
    string: true,
  }).argv;

sampleRecognize(argv.sample_rate_hertz, argv.language_code, argv.uri_path);
