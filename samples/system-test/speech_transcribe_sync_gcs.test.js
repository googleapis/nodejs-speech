/**
 * Copyright 2019, Google, Inc.
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
const test = require(`ava`);
const {runAsync} = require(`@google-cloud/nodejs-repo-tools`);

const REGION_TAG = 'speech_transcribe_sync_gcs';

test(REGION_TAG, async t => {
  const output = await runAsync(
    `node ${REGION_TAG}.js`,
    path.join(__dirname, `..`)
  );
  t.true(output.includes(`Transcriptions: 1`));
  t.true(output.includes(`how old is the Brooklyn Bridge`));
});
