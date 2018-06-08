/**
 * Copyright 2016, Google, Inc.
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

const path = require(`path`);
//const storage = require(`@google-cloud/storage`)();
const test = require(`ava`);
//const uuid = require(`uuid`);

const {runAsync} = require(`@google-cloud/nodejs-repo-tools`);

//const bucketName = `nodejs-docs-samples-test-${uuid.v4()}`;
const cmd = `node MicrophoneStream.js`;
const cwd = path.join(__dirname, `..`);
const filename = `ManualTest.wav`;
const filepath = path.join(__dirname, `../resources/${filename}`);
const text = `neewer manual test 10:39 Friday`;

test(`Should run micStreamRecognize`, async t => {
  const output = await runAsync(`${cmd} wavFileToText ${filepath}`, cwd);
  t.true(output.includes(`Transcription;`));
});

test(`Should include example text`, async t => {
  const output = await runAsync(`${cmd} wavFileToText ${filepath}`, cwd);
  t.true(output.includes(text));
});

// test(`Should run wavFileToText`, async t => {
//   const output = await runAsync(`${cmd} wavFileToText ${filepath}`, cwd);
//   t.true(output.includes(`Transcription:  ${text}`));
// });
