// Copyright 2022 Google LLC
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
//
// ** This file is automatically generated by gapic-generator-typescript. **
// ** https://github.com/googleapis/gapic-generator-typescript **
// ** All changes to this file may be overwritten. **



'use strict';

function main(parent, phraseSetId, phraseSet) {
  // [START speech_v1p1beta1_generated_Adaptation_CreatePhraseSet_async]
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  /**
   *  Required. The parent resource where this phrase set will be created. Format:
   *  `projects/{project}/locations/{location}/phraseSets`
   *  Speech-to-Text supports three locations: `global`, `us` (US North America),
   *  and `eu` (Europe). If you are calling the `speech.googleapis.com`
   *  endpoint, use the `global` location. To specify a region, use a
   *  regional endpoint (https://cloud.google.com/speech-to-text/docs/endpoints)
   *  with matching `us` or `eu` location value.
   */
  // const parent = 'abc123'
  /**
   *  Required. The ID to use for the phrase set, which will become the final
   *  component of the phrase set's resource name.
   *  This value should restrict to letters, numbers, and hyphens, with the first
   *  character a letter, the last a letter or a number, and be 4-63 characters.
   */
  // const phraseSetId = 'abc123'
  /**
   *  Required. The phrase set to create.
   */
  // const phraseSet = {}

  // Imports the Speech library
  const {AdaptationClient} = require('@google-cloud/speech').v1p1beta1;

  // Instantiates a client
  const speechClient = new AdaptationClient();

  async function callCreatePhraseSet() {
    // Construct request
    const request = {
      parent,
      phraseSetId,
      phraseSet,
    };

    // Run request
    const response = await speechClient.createPhraseSet(request);
    console.log(response);
  }

  callCreatePhraseSet();
  // [END speech_v1p1beta1_generated_Adaptation_CreatePhraseSet_async]
}

process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});
main(...process.argv.slice(2));
