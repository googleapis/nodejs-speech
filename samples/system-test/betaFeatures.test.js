// /**
//  * Copyright 2016, Google, LLC.
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *    http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  */

/* eslint-disable */

'use strict';

const path = require(`path`);
const test = require(`ava`);

const {runAsync} = require(`@google-cloud/nodejs-repo-tools`);

const cmd = `node betaFeatures.js`;
const cwd = path.join(__dirname, `..`);

test(`should run speech diarization`, async t => {
  const output = await runAsync(`${cmd} Diarization`, cwd);
  t.true(
    output.includes(`"speakerTag": 1`) && output.includes(`"speakerTag": 2`)
  );
});

test(`should run speech diarization on a GCS file`, async t => {
  const output = await runAsync(`${cmd} DiarizationGCS`, cwd);
  t.true(
    output.includes(`"speakerTag": 1`) && output.includes(`"speakerTag": 2`)
  );
});

test(`should run multi channel transcription on a local file`, async t => {
  const output = await runAsync(`${cmd} multiChannelTranscribe`, cwd);
  t.true(output.includes(`Channel Tag: 2`));
});

test(`should transcribe multi-language on a local file`, async t => {
  const output = await runAsync(`${cmd} multiLanguageTranscribe`, cwd);
  t.true(output.includes(`Transcription: how are you doing estoy bien e tu`));
});

test(`should transcribe multi-language on a GCS bucket`, async t => {
  const output = await runAsync(`${cmd} multiLanguageTranscribeGCS`, cwd);
  t.true(output.includes(`Transcription: how are you doing estoy bien e tu`));
});

test(`should run word Level Confience on a file`, async t => {
  const output = await runAsync(`${cmd} wordLevelConfidence`);
  t.true(
    output.includes(`"transcript": "how old is the Brooklyn Bridge",`) &&
      output.includes(`"confidence": 0.9836039543151855`)
  );
});

test(`should run word level confidence on a GCS bucket`, async t => {
  const output = await runAsync(`${cmd} wordLevelConfidenceGCS`, cwd);
  t.true(
    output.includes(`"transcript": "how old is the Brooklyn Bridge",`) &&
      output.includes(`"confidence": 0.9836039543151855`)
  );
});
