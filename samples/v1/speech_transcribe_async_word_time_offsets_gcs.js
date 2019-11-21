// Copyright 2019 Google LLC
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

// DO NOT EDIT! This is a generated sample ("LongRunningPromiseAwait",  "speech_transcribe_async_word_time_offsets_gcs")

// sample-metadata:
//   title: Getting word timestamps (Cloud Storage) (LRO)
//   description: Print start and end time of each word spoken in audio file from Cloud Storage
//   usage: node samples/v1/speech_transcribe_async_word_time_offsets_gcs.js [--storage_uri "gs://cloud-samples-data/speech/brooklyn_bridge.flac"]

'use strict';

function main(
  storageUri = 'gs://cloud-samples-data/speech/brooklyn_bridge.flac'
) {
  // [START speech_transcribe_async_word_time_offsets_gcs]
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  // const storageUri = 'gs://cloud-samples-data/speech/brooklyn_bridge.flac';

  // Imports the client library
  const {SpeechClient} = require('@google-cloud/speech').v1;

  // Instantiates a client
  const speechClient = new SpeechClient();

  async function sampleLongRunningRecognize() {
    // When enabled, the first result returned by the API will include a list
    // of words and the start and end time offsets (timestamps) for those words.
    const enableWordTimeOffsets = true;

    // The language of the supplied audio
    const languageCode = 'en-US';
    const config = {
      enableWordTimeOffsets: enableWordTimeOffsets,
      languageCode: languageCode,
    };
    const audio = {
      uri: storageUri,
    };

    // Construct request
    const request = {
      config: config,
      audio: audio,
    };

    // Start long-running operation. You can wait for now or get results later.
    const [operation] = await speechClient.longRunningRecognize(request);

    // Wait for operation to complete.
    const [response] = await operation.promise();

    // The first result includes start and end time word offsets
    const result = response.results[0];
    // First alternative is the most probable result
    const alternative = result.alternatives[0];
    console.log(`Transcript: ${alternative.transcript}`);
    // Print the start and end time of each word
    for (const word of alternative.words) {
      console.log(`Word: ${word.word}`);
      console.log(
        `Start time: ${word.startTime.seconds} seconds ${word.startTime.nanos} nanos`
      );
      console.log(
        `End time: ${word.endTime.seconds} seconds ${word.endTime.nanos} nanos`
      );
    }
  }
  sampleLongRunningRecognize();
  // [END speech_transcribe_async_word_time_offsets_gcs]
}

const argv = require(`yargs`).option('storage_uri', {
  default: 'gs://cloud-samples-data/speech/brooklyn_bridge.flac',
  string: true,
}).argv;

main(argv.storage_uri);
