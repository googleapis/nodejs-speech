// DO NOT EDIT! This is a generated sample ("Request",  "speech_adaptation_beta")
'use strict';

// sample-metadata:
//   title:
//   description: Performs synchronous speech recognition with speech adaptation.
//   usage: node samples/v1p1beta1/speech_adaptation_beta.js [--sample_rate_hertz 44100] [--language_code "en-US"] [--phrase "Brooklyn Bridge"] [--boost 20.0] [--uri_path "gs://cloud-samples-data/speech/brooklyn_bridge.mp3"]

// [START speech_adaptation_beta]
// [START speech_adaptation_beta_core]

const speech = require('speech.v1p1beta1').v1p1beta1;

/**
 * Performs synchronous speech recognition with speech adaptation.
 *
 * @param sampleRateHertz {number} Sample rate in Hertz of the audio data sent in all
 * `RecognitionAudio` messages. Valid values are: 8000-48000.
 * @param languageCode {string} The language of the supplied audio.
 * @param phrase {string} Phrase "hints" help Speech-to-Text API recognize the specified phrases from
 * your audio data.
 * @param boost {number} Positive value will increase the probability that a specific phrase will be
 * recognized over other similar sounding phrases.
 * @param uriPath {string} Path to the audio file stored on GCS.
 */
function sampleRecognize(
  sampleRateHertz,
  languageCode,
  phrase,
  boost,
  uriPath
) {
  const client = new speech.SpeechClient();
  // const sampleRateHertz = 44100;
  // const languageCode = 'en-US';
  // const phrase = 'Brooklyn Bridge';
  // const boost = 20.0;
  // const uriPath = 'gs://cloud-samples-data/speech/brooklyn_bridge.mp3';
  const encoding = 'MP3';
  const phrases = [phrase];
  const speechContextsElement = {
    phrases: phrases,
    boost: boost,
  };
  const speechContexts = [speechContextsElement];
  const config = {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
    speechContexts: speechContexts,
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
        // First alternative is the most probable result
        const alternative = result.alternatives[0];
        console.log(`Transcript: ${alternative.transcript}`);
      }
    })
    .catch(err => {
      console.error(err);
    });
}

// [END speech_adaptation_beta_core]
// [END speech_adaptation_beta]
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
  .option('phrase', {
    default: 'Brooklyn Bridge',
    string: true,
  })
  .option('boost', {
    default: 20.0,
    number: true,
  })
  .option('uri_path', {
    default: 'gs://cloud-samples-data/speech/brooklyn_bridge.mp3',
    string: true,
  }).argv;

sampleRecognize(
  argv.sample_rate_hertz,
  argv.language_code,
  argv.phrase,
  argv.boost,
  argv.uri_path
);
