/**
 * Copyright 2017, Google, LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This application demonstrates how to perform basic recognize operations with
 * with the Google Cloud Speech API.
 *
 * For more information, see the README.md under /speech and the documentation
 * at https://cloud.google.com/speech/docs.
 */

'use strict';

// # DIARIZATION

function speechTranscribeDiarization(speechFile) {
  //[START speech_transcribe_diarization]
  const fs = require('fs');

  // Imports the Google Cloud client library
  const speech = require('@google-cloud/speech').v1p1beta1;

  // Creates a client
  const client = new speech.SpeechClient();

  /**
   * TODO(developer): Uncomment the following lines before running the sample.
   */
  // const filename = 'Local path tols -a audio file, e.g. /path/to/audio.raw';

  const config = {
    encoding: `LINEAR16`,
    sampleRateHertz: 8000,
    languageCode: `en-US`,
    enableSpeakerDiarization: true,
    diarizationSpeakerCount: 2,
    model: `phone_call`,
  };

  const audio = {
    content: fs.readFileSync(speechFile).toString('base64'),
  };

  const request = {
    config: config,
    audio: audio,
  };

  client
    .recognize(request)
    .then(data => {
      const response = data[0];
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      console.log(`Transcription: ${transcription}`);
      console.log(`Speaker Diarization:`);
      const chunks = response.results.map(result => result.alternatives[0]);
      console.log(`WORDS: `);
      //words.forEach(a => console.log(JSON.stringify(a, null, 4)));
      const lastChunk = chunks[chunks.length - 1].words;
      lastChunk.forEach(a => console.log(JSON.stringify(a, null, 4)));
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
  //[END speech_transcribe_diarization]
}

//DIARIZATIONGCS

function asyncSpeechTranscribeDiarizationGCS(gcsUri) {
  // [START speech_transcribe_diarization_gcs]
  //   """Transcribe the given audio file asynchronously with
  //     the selected model."""

  const speech = require('@google-cloud/speech').v1p1beta1;

  // Creates a client
  const client = new speech.SpeechClient();

  /**
   * TODO(developer): Uncomment the following line before running the sample.
   */
  // const uri = path to GCS audio file e.g. `gs:/bucket/audio.wav`;

  const config = {
    encoding: `LINEAR16`,
    sampleRateHertz: 8000,
    languageCode: `en-US`,
    enableSpeakerDiarization: true,
    diarizationSpeakerCount: 2,
    model: `phone_call`,
  };

  const audio = {
    uri: gcsUri,
  };

  const request = {
    config: config,
    audio: audio,
  };

  client
    .recognize(request)
    .then(data => {
      const response = data[0];
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      console.log(`Transcription: ${transcription}`);
      console.log(`Speaker Diarization:`);
      const chunks = response.results.map(result => result.alternatives[0]);
      console.log(`WORDS: `);
      //words.forEach(a => console.log(JSON.stringify(a, null, 4)));
      const lastChunk = chunks[chunks.length - 1].words;
      lastChunk.forEach(a => console.log(JSON.stringify(a, null, 4)));
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
  // [END speech_transcribe_diarization_gcs]
}

// MULTI CHANNEL

function speechTranscribeMultiChannel(fileName) {
  // [START speech_transcribe_multichannel]
  //   """Transcribe the given audio file asynchronously with
  //     the selected model."""

  const fs = require('fs');
  const speech = require('@google-cloud/speech').v1p1beta1;

  // Creates a client
  const client = new speech.SpeechClient();

  /**
   * TODO(developer): Uncomment the following lines before running the sample.
   */
  // const fileName = 'Local path tols -a audio file, e.g. /path/to/audio.raw';

  const config = {
    encoding: `LINEAR16`,
    languageCode: `en-US`,
    audioChannelCount: 2,
    enableSeparateRecognitionPerChannel: true,
  };

  const audio = {
    content: fs.readFileSync(fileName).toString('base64'),
  };

  const request = {
    config: config,
    audio: audio,
  };

  // Detects speech in the audio file. This creates a recognition job that you
  // can wait for now, or get its result later.
  client
    .recognize(request)
    .then(data => {
      const response = data[0];
      const transcription = response.results
        .map(
          result =>
            ` Channel Tag: ` +
            result.channelTag +
            ` ` +
            result.alternatives[0].transcript
        )
        .join('\n');
      console.log(`Transcription: \n${transcription}`);
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
  // [END speech_transcribe_multichannel]
}

// function speechTranscribeMultichannelGCS(gcsUri) {
//   // [START speech_transcribe_multichannel_gcs]

//   //const fs = require('fs');
//   const speech = require('@google-cloud/speech').v1p1beta1;

//   // Creates a client
//   const client = new speech.SpeechClient();

//   const config = {
//     encoding: 'LINEAR16',
//     languageCode: `en-US`,
//     audioChannelCount: 2,
//     enableSeparateRecognitionperChannel: true,
//   };

//   const audio = {
//     uri: gcsUri,
//   };

//   const request = {
//     config: config,
//     audio: audio,
//   };

//   client
//     .recognize(request)
//     .then(data => {
//       const response = data[0];
//       const transcription = response.results
//         .map(
//           result =>
//             ` Channel Tag: ` +
//             result.channelTag +
//             ` ` +
//             result.alternatives[0].transcript
//         )
//         .join('\n');
//       console.log(`Transcription: \n${transcription}`);
//     })
//     .catch(err => {
//       console.error('ERROR:', err);
//     });
//   // [END speech_transcribe_multichannel_gcs]
// }

// # MULTI LANGUAGE

function speechTranscribeMultilang(fileName) {
  //[START speechTranscribeMultilang]

  const fs = require('fs');
  const speech = require('@google-cloud/speech').v1p1beta1;

  // Creates a client
  const client = new speech.SpeechClient();

  /**
   * TODO(developer): Uncomment the following lines before running the sample.
   */
  // const fileName = 'Local path tols -a audio file, e.g. /path/to/audio.raw';

  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 44100,
    languageCode: `en-US`,
    alternativeLanguageCodes: [`es-ES`, `en-US`],
    audioChannelCount: 2,
  };

  const audio = {
    content: fs.readFileSync(fileName).toString('base64'),
  };

  const request = {
    config: config,
    audio: audio,
  };

  client
    .recognize(request)
    .then(data => {
      const response = data[0];
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      console.log(`Transcription: ${transcription}`);
    })
    .catch(err => {
      console.error('ERROR:', err);
    });

  //[END speech_transcribe_multilang]
}

function speechTranscribeMultilangGCS(gcsUri) {
  // [START speech_transcribe_multilang_gcs]

  const speech = require('@google-cloud/speech').v1p1beta1;

  // Creates a client
  const client = new speech.SpeechClient();

  /**
   * TODO(developer): Uncomment the following line before running the sample.
   */
  // const uri = path to GCS audio file e.g. `gs:/bucket/audio.wav`;

  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 44100,
    languageCode: `en-US`,
    alternativeLanguageCodes: [`es-ES`, `en-US`],
    audioChannelCount: 2,
  };

  const audio = {
    uri: gcsUri,
  };

  const request = {
    config: config,
    audio: audio,
  };

  client
    .longRunningRecognize(request)
    .then(data => {
      const operation = data[0];
      // Get a Promise representation of the final result of the job
      return operation.promise();
    })
    .then(data => {
      const response = data[0];
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      console.log(`Transcription: ${transcription}`);
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
  // [END speech_transcribe_multilang_gcs]
}

// WORD LEVEL CONFIDENCE
function speechTranscribeWordLevelConfidence(speechFile) {
  // [START speech_transcribe_word_level_confidence]
  const fs = require('fs');

  // Imports the Google Cloud client library
  const speech = require('@google-cloud/speech').v1p1beta1;

  // Creates a client
  const client = new speech.SpeechClient();

  /**
   * TODO(developer): Uncomment the following lines before running the sample.
   */
  // const fileName = 'Local path tols -a audio file, e.g. /path/to/audio.raw';

  const config = {
    encoding: `FLAC`,
    sampleRateHertz: 16000,
    languageCode: `en-US`,
    enableWordTimeOffsets: true,
    enableWordConfidence: true,
  };

  const audio = {
    content: fs.readFileSync(speechFile).toString('base64'),
  };

  const request = {
    config: config,
    audio: audio,
  };

  client
    .recognize(request)
    .then(data => {
      const response = data[0];
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      const confidence = response.results
        .map(result => result.alternatives[0].confidence)
        .join(`\n`);
      console.log(
        ` Transcription: ${transcription} \n Confidence: ${confidence}`
      );

      console.log(` Word-Level-Confidence:`);
      const words = response.results.map(result => result.alternatives[0]);
      console.log(`WORDS: `);
      words.forEach(a => console.log(JSON.stringify(a, null, 4)));
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
  // [END speech_transcribe_word_level_confidence]
}

function speechTranscribeWordLevelConfidenceGCS(gcsUri) {
  // [START speech_transcribe_word_level_confidence_gcs]

  // Imports the Google Cloud client library
  const speech = require('@google-cloud/speech').v1p1beta1;

  // Creates a client
  const client = new speech.SpeechClient();

  /**
   * TODO(developer): Uncomment the following line before running the sample.
   */
  // const uri = path to GCS audio file e.g. `gs:/bucket/audio.wav`;

  const config = {
    encoding: `FLAC`,
    sampleRateHertz: 16000,
    languageCode: `en-US`,
    enableWordTimeOffsets: true,
    enableWordConfidence: true,
  };

  const audio = {
    uri: gcsUri,
  };

  const request = {
    config: config,
    audio: audio,
  };

  client
    .recognize(request)
    .then(data => {
      const response = data[0];
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      const confidence = response.results
        .map(result => result.alternatives[0].confidence)
        .join(`\n`);
      console.log(
        ` Transcription: ${transcription} \n Confidence: ${confidence}`
      );

      console.log(` Word-Level-Confidence:`);
      const words = response.results.map(result => result.alternatives[0]);
      console.log(`WORDS: `);
      words.forEach(a => console.log(JSON.stringify(a, null, 4)));
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
  // [END speech_transcribe_word_level_confidence_gcs]
}

//audio file paths for Defaults
const path = require(`path`);
const monoFileName = `commercial_mono.wav`;
const monoFilePath = path.join(
  __dirname,
  `../samples/resources/${monoFileName}`
);
// const defaultURI = 'gs://cloud-samples-tests/speech/commercial_mono.wav';
const stereoFileName = `commercial_stereo.wav`;
const stereoFilePath = path.join(
  __dirname,
  `../samples/resources/${stereoFileName}`
);
const multiLanguageFileName = `multi.wav`;
const multiLanguageFile = path.join(
  __dirname,
  `../samples/resources/${multiLanguageFileName}`
);

const gnomef = `Google_Gnome.wav`;
const gnome = path.join(__dirname, `../samples/resources/${gnomef}`);

const Brooklyn = 'brooklyn.flac';
const BrooklynFilePath = path.join(
  __dirname,
  `../samples/resources/${Brooklyn}`
);

require(`yargs`)
  .demand(1)
  .command(
    `Diarization`,
    `Isolate distinct speakers in an audio file`,
    {},
    opts => speechTranscribeDiarization(opts.speechFile)
  )
  .command(
    `DiarizationGCS`,
    `Isolate distinct speakers in an audio file located in a Google Cloud Storage bucket.`,
    {},
    opts => asyncSpeechTranscribeDiarizationGCS(opts.gcsUri)
  )
  .command(
    `multiChannelTranscribe`,
    `Differentiates input by audio channel in local audio file.`,
    {},
    opts => speechTranscribeMultiChannel(opts.speechFileStereo)
  )
  // .command(
  //   `multiChannelTranscribeGCS`,
  //   `Differentiates input by audio channel from GCS audio file.`,
  //   {},
  //   opts => speechTranscribeMultichannelGCS(opts.gcsUriStereo)
  // )
  .command(
    `multiLanguageTranscribe`,
    `Transcribes multiple languages from local audio file.`,
    {},
    opts => speechTranscribeMultilang(opts.multiSpeechFile)
  )
  .command(
    `multiLanguageTranscribeGCS`,
    `Transcribes multiple languages from GCS audio file.`,
    {},
    opts => speechTranscribeMultilangGCS(opts.multiSpeechUri)
  )
  .command(
    `wordLevelConfidence`,
    `Detects word level confidence from local audio file.`,
    {},
    opts => speechTranscribeWordLevelConfidence(opts.brooklynBridgeSpeechFile)
  )
  .command(
    `wordLevelConfidenceGCS`,
    `Detects word level confidence from GCS audio file.`,
    {},
    opts =>
      speechTranscribeWordLevelConfidenceGCS(opts.brooklynBridgeSpeechFileURI)
  )
  .options({
    speechFile: {
      alias: 'f',
      default: monoFilePath,
      global: true,
      requiresArg: false,
      type: 'string',
    },
    gcsUri: {
      alias: 'u',
      default: 'gs://cloud-samples-tests/speech/commercial_mono.wav',
      global: true,
      requiresArg: true,
      type: 'string',
    },
    speechFileGnome: {
      alias: 'gf',
      default: gnome,
      global: true,
      requiresArg: true,
      type: 'string',
    },
    gcsUriStereo: {
      alias: 'us',
      default: 'gs://cloud-samples-tests/speech/commercial_stereo.wav',
      global: true,
      requiresArg: true,
      type: 'string',
    },
    multiSpeechFile: {
      alias: 'ms',
      default: multiLanguageFile,
      global: true,
      requiresArg: true,
      type: 'string',
    },
    multiSpeechUri: {
      alias: 'msu',
      default: `gs://cloud-samples-tests/speech/multi.wav`,
      global: true,
      requiresArg: true,
      type: 'string',
    },
    speechFileStereo: {
      alias: 'fs',
      default: stereoFilePath,
      global: true,
      requiresArg: true,
      type: 'string',
    },
    brooklynBridgeSpeechFile: {
      alias: 'bb',
      default: BrooklynFilePath,
      global: true,
      requiresArg: true,
      type: 'string',
    },
    brooklynBridgeSpeechFileURI: {
      alias: 'bbu',
      default: 'gs://cloud-samples-tests/speech/brooklyn.flac',
      global: true,
      requiresArg: true,
      type: 'string',
    },
  })
  .example(`node $0 Diarization`)
  .example(`node $0 DiarizationGCS`)
  .example(`node $0 multiChannelTranscribe`)
  .example(`node $0 multiChannelTranscribeGCS`)
  .example(`node $0 multiLanguageTranscribe`)
  .example(`node $0 multiLanguageTranscribeGCS`)
  .example(`node $0 wordLevelConfidence`)
  .example(`node $0 wordLevelConfidenceGCS`)
  .wrap(120)
  .recommendCommands()
  .epilogue(`For more information, see https://cloud.google.com/speech/docs`)
  .help()
  .strict().argv;
