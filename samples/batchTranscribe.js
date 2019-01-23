/**
 * Copyright 2017, Google, Inc.
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

function batchTranscribe(
  directoryPath,
  languageCode,
  encoding,
  sampleRateHertz,
  audioChannelCount
) {

  const fs = require('fs');
  const speech = require('@google-cloud/speech').v1p1beta1;

  const client = new speech.SpeechClient();

  const config = {
    languageCode: languageCode,
    //encoding: encoding,
    //sampleRateHertz: sampleRateHertz,
    //audioChannelCount: audioChannelCount
  };

  fs.readdirSync(directoryPath).forEach(filename => {

    const audio = {
      content: fs.readFileSync(directoryPath + filename).toString('base64'),
    };

    const request = {
      config: config,
      audio: audio,
    };

    getTranscriptForFile(request, filename);

  })

  async function getTranscriptForFile(request, filename){

    try {

      console.log("transcript requested for " + filename);
      const [response] = await client.recognize(request);
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      console.log('\n' + filename + ' transcription: ' + transcription);

    } catch (error) {

      console.error('\nSPEECH API ERROR (' + filename + '): ' + error.message);

    }

  }
}

async function batchTranscribeGCS(
  gcsUri,
  languageCode,
  encoding,
  sampleRateHertz,
  audioChannelCount
) {

  // Imports the Google Cloud client libraries
  const speech = require('@google-cloud/speech').v1p1beta1;
  const {Storage} = require('@google-cloud/storage');

  // Creates the clients
  const client = new speech.SpeechClient();
  const storage = new Storage();

  const config = {
    languageCode: languageCode,
    //encoding: encoding,
    //sampleRateHertz: sampleRateHertz,
    //audioChannelCount: audioChannelCount
  };

  const [files] = await storage.bucket(gcsUri).getFiles();

  files.forEach(file => {
    const audio = {
      uri: gcsUri + file.name,
    };

    const request = {
      config: config,
      audio: audio,
    };

    getTranscriptForFile(request, file.name);
  });

  async function getTranscriptForFile(request, filename){

    try {

      console.log("transcript requested for " + filename);
      const [response] = await client.recognize(request);
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      console.log('\n' + filename + ' transcription: ' + transcription);

    } catch (error) {

      console.error('\nSPEECH API ERROR (' + filename + '): ' + error.message);

    }
  }
}

async function ffprobeBatchTranscribe(
  directoryPath,
  languageCode,
  encoding,
  sampleRateHertz,
  audioChannelCount
) {

  const fs = require('fs'),
        ffprobe = require('ffprobe'),
        ffprobeStatic = require('ffprobe-static');

  const speech = require('@google-cloud/speech').v1p1beta1;

  const client = new speech.SpeechClient();

  fs.readdirSync(directoryPath).forEach(filename => {

      createRequestAndTranscribe(filename);

  });

  async function createRequestAndTranscribe (filename){

    const audio = {
      content: await fs.readFileSync(directoryPath + filename).toString('base64'),
    };

    var config = await getConfigForFile(filename);

    const request = {
      config: config,
      audio: audio
    };

    await getTranscriptForFile(request, filename);

  }

  async function getConfigForFile (filename) {

    var config = {
      languageCode: languageCode,
      encoding: encoding,
      sampleRateHertz: sampleRateHertz,
      audioChannelCount: audioChannelCount,
      enableSeparateRecognitionPerChannel: true
    };

    try {

      const fileInfo = await ffprobe(directoryPath + filename, { path: ffprobeStatic.path })

      if (fileInfo.streams[0].codec_name!='pcm_s16le') {
        config.encoding = fileInfo.streams[0].codec_name;
      }

      config.sampleRateHertz = parseInt(fileInfo.streams[0].sample_rate);
      config.audioChannelCount = parseInt(fileInfo.streams[0].channels);

      return config;

    } catch (err) {

        console.error('\nFFPROBE ERROR (' + filename + '): ' + err + ' - attempting to process with default config');
        return config;

    }
  }
  async function getTranscriptForFile(request, filename){

    console.log("\nTranscript requested for " + filename);

    try {

      const [response] = await client.recognize(request);
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      console.log('\n' + filename + ' transcription:\n' + transcription);

    } catch (error) {

      console.error('SPEECH API ERROR (' + filename + '): ' + error.message);

    }
  }
}

require(`yargs`) // eslint-disable-line
  .demand(1)
  .command(
    `batch <directoryPath>`,
    `Detects speech in mono audio files stored in a local directory. API automatically detects encoding and sample rate, but throws an error for raw files (headerless) and multichannel files.`,
    {},
    opts =>
      batchTranscribe(
        opts.directoryPath,
        opts.languageCode,
        opts.encoding,
        opts.sampleRateHertz,
        opts.audioChannelCount
      )
  )
  .command(
    `batchGCS <gcsUri>`,
    `Detects speech in audio files located in a Google Cloud Storage bucket. API automatically detects encoding and sample rate, but throws an error for raw files (headerless) and multichannel files.`,
    {},
    opts =>
      batchTranscribeGCS(
        opts.gcsUri,
        opts.languageCode,
        opts.encoding,
        opts.sampleRateHertz,
        opts.audioChannelCount
      )
  )
  .command(
    `ffprobeBatch <directoryPath>`,
    `Detects speech in mono audio files stored in a local directory. ffprobe and ffprobe-static work together to detect audiofile encoding, samplerate, and channels before making API request.`,
    {},
    opts =>
      ffprobeBatchTranscribe(
        opts.directoryPath,
        opts.languageCode,
        opts.encoding,
        opts.sampleRateHertz,
        opts.audioChannelCount
      )
  )

  .options({
    encoding: {
      alias: 'e',
      default: 'LINEAR16',
      global: true,
      requiresArg: true,
      type: 'string',
    },
    sampleRateHertz: {
      alias: 'r',
      default: 16000,
      global: true,
      requiresArg: true,
      type: 'number',
    },
    audioChannelCount: {
      alias: 'c',
      default: 1,
      global: true,
      requiresArg: true,
      type: 'number',
    },
    languageCode: {
      alias: 'l',
      default: 'en-US',
      global: true,
      requiresArg: true,
      type: 'string',
    }
  })
  .example(`node $0 batch ./resources/`)
  //.example(`node $0 batch-gcs gs://gcs-test-data/ -e FLAC -r 16000`)
  .example(`node $0 batchGCS gs://speech-samples-galvink.appspot.com/`)
  .example(`node $0 ffprobeBatch ./resources/`)
  .wrap(120)
  .recommendCommands()
  .epilogue(`For more information, see https://cloud.google.com/speech/docs`)
  .help()
  .strict().argv;
