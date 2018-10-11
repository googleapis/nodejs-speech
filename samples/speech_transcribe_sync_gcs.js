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

function main() {
  // [START speech_transcribe_sync_gcs]
  // Imports the Google Cloud Speech API client library.
  const {SpeechClient} = require('@google-cloud/speech');

  // Creates a client.
  const speechClient = new SpeechClient();

  async function transcribeSyncGcs() {
    const request = {
      audio: {
        uri: 'gs://cloud-samples-data/speech/brooklyn_bridge.raw',
      },
      config: {
        // Encoding of the audio file, e.g. 'LINEAR16'.
        encoding: 'LINEAR16',
        // Sample rate in Hertz of the audio data sent.
        sampleRateHertz: 16000,
        // BCP-47 language code, e.g. 'en-US'.
        languageCode: 'en-US',
      },
    };

    // Detects speech in the audio file.
    const [response] = await speechClient.recognize(request);
    const transcriptions = response.results;
    console.log(`Transcriptions: ${transcriptions.length}`);
    for (const transcription of transcriptions) {
      console.log(transcription.alternatives[0].transcript);
    }
  }

  transcribeSyncGcs();
  // [END speech_transcribe_sync_gcs]
}

main();
