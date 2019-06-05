// DO NOT EDIT! This is a generated sample ("Request",  "speech_contexts_classes_beta")
'use strict';

// sample-metadata:
//   title:
//   description: Performs synchronous speech recognition with static context classes.
//   usage: node samples/v1p1beta1/speech_contexts_classes_beta.js [--sample_rate_hertz 24000] [--language_code "en-US"] [--phrase "$TIME"] [--uri_path "gs://cloud-samples-data/speech/time.mp3"]

// [START speech_contexts_classes_beta]
// [START speech_contexts_classes_beta_core]

const speech = require('@google-cloud/speech').v1p1beta1;

/**
 * Performs synchronous speech recognition with static context classes.
 *
 * @param sampleRateHertz {number} Sample rate in Hertz of the audio data sent in all
 * `RecognitionAudio` messages. Valid values are: 8000-48000.
 * @param languageCode {string} The language of the supplied audio.
 * @param phrase {string} Phrase "hints" help Speech-to-Text API recognize the specified phrases from
 * your audio data. In this sample we are using a static class phrase ($TIME). Classes represent
 * groups of words that represent common concepts that occur in natural language. We recommend
 * checking out the docs page for more info on static classes.
 * @param uriPath {string} Path to the audio file stored on GCS.
 */
function sampleRecognize(sampleRateHertz, languageCode, phrase, uriPath) {
  const client = new speech.SpeechClient();
  // const sampleRateHertz = 24000;
  // const languageCode = 'en-US';
  // const phrase = '$TIME';
  // const uriPath = 'gs://cloud-samples-data/speech/time.mp3';
  const encoding = 'MP3';
  const phrases = [phrase];
  const speechContextsElement = {
    phrases: phrases,
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

// [END speech_contexts_classes_beta_core]
// [END speech_contexts_classes_beta]
// tslint:disable-next-line:no-any

const argv = require(`yargs`)
  .option('sample_rate_hertz', {
    default: 24000,
    number: true,
  })
  .option('language_code', {
    default: 'en-US',
    string: true,
  })
  .option('phrase', {
    default: '$TIME',
    string: true,
  })
  .option('uri_path', {
    default: 'gs://cloud-samples-data/speech/time.mp3',
    string: true,
  }).argv;

sampleRecognize(
  argv.sample_rate_hertz,
  argv.language_code,
  argv.phrase,
  argv.uri_path
);
