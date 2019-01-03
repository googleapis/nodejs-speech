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

'use strict';
//customize for each project name
//const projectID = 'speech-samples-galvink';

function deidentify(
  projectID,
  filename,
  encoding,
  sampleRateHertz,
  languageCode
) {
  // Imports the Google Cloud client library and the Google Cloud Data Loss Prevention Library
  const speech = require('@google-cloud/speech');
  const DLP = require('@google-cloud/dlp');

  const fs = require('fs');

  async function transcribeSpeech() {
    // Creates a client
    const speechClient = new speech.SpeechClient();

    /**
    * TODO(developer): Uncomment the following lines before running the sample.
    */
    //const filename = './resources/sallybrown.flac';
    //const encoding = 'FLAC';
    //const sampleRateHertz = 16000;
    //const languageCode = 'en-US';

    // Reads a local audio file and converts it to base64
    const file = fs.readFileSync(filename);
    const audioBytes = file.toString('base64');

    const audio = {
      content: audioBytes,
    };
    const config = {
      encoding: encoding,
      sampleRateHertz: sampleRateHertz,
      languageCode: languageCode,
      enableAutomaticPunctuation: true,
    };
    const speechRequest = {
      audio: audio,
      config: config,
    };

    // Detects speech in the audio file
    const [speechResponse] = await speechClient.recognize(speechRequest);
    const transcription = speechResponse.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log(`Original transcript: ${transcription}`);
    // Check transcription for email address, since speech-to-text returns " at " instead of "@"
    // Format manually before sending to DLP api
    // Currently social security numbers and credit card numbers are interpreted as phone numbers
    const updatedTranscription = updateEmail(transcription);
    deidentifyText(updatedTranscription);
  }

  function updateEmail(transcription) {
    //regex string replacement for catching *some* email addresses using " at " instead of "@", and then formatting them for the DLP API
    const emailRegex = /([A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*)(\sat\s+)((?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9]))/g;
    transcription = transcription.replace(emailRegex, '$1@$3');
    console.log(`Email addresses reformatted: ${transcription}`);
    return transcription;
  }

  async function deidentifyText(transcription) {
    // Creates a DLP Service Client
    const dlpClient = new DLP.DlpServiceClient();

    // Construct DLP request
    const item = {value: transcription};

    const infoTypes = [
      {name: 'PHONE_NUMBER'},
      {name: 'EMAIL_ADDRESS'},
      {name: 'CREDIT_CARD_NUMBER'},
      {name: 'US_SOCIAL_SECURITY_NUMBER'},
    ];

    const primitiveTransformation = {
      replaceWithInfoTypeConfig:{
      }
    };

    const transformations = [
      {
        infoTypes: infoTypes,
        primitiveTransformation: primitiveTransformation,
      },
    ];

    const infoTypeTransformations = {transformations: transformations};

    const dlpConfig = {infoTypeTransformations: infoTypeTransformations};

    const inspectConfig = {infoTypes: infoTypes};

    const dlpRequest = {
      parent: dlpClient.projectPath(projectID),
      deidentifyConfig: dlpConfig,
      inspectConfig: inspectConfig,
      item: item,
    };

    try {
      const [response] = await dlpClient.deidentifyContent(dlpRequest);
      const deidentifiedItem = response.item;
      console.log(
        `Final Result with sensitive content redacted: ${deidentifiedItem.value}`
      );
    } catch (err) {
      console.log(`Error in deidentifyWithMask: ${err.message || err}`);
    }
  }

  transcribeSpeech().catch(console.error);
  // [END speech-to-text-to-dlp sample]
}

require(`yargs`) // eslint-disable-line
  .demand(1)
  .command(
    `deidentify <projectID> <filename>`,
    `Replaces sensitive information detected in local audio file. Replaces with asterisks.`,
    {},
    opts =>
      deidentify(
        opts.projectID,
        opts.filename,
        opts.encoding,
        opts.sampleRateHertz,
        opts.languageCode
      )
  )
  .options({
    encoding: {
      alias: 'e',
      default: 'FLAC',
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
    languageCode: {
      alias: 'l',
      default: 'en-US',
      global: true,
      requiresArg: true,
      type: 'string',
    },
  })
  .example(`node $0 deidentify <ProjectID> ./resources/sallybrown.flac`)
  .wrap(120)
  .recommendCommands()
  .epilogue(`For more information, see https://cloud.google.com/speech/docs`)
  .help()
  .strict().argv;
