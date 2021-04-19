# Copyright 2018 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""This script is used to synthesize generated parts of this library."""

import synthtool as s
import synthtool.gcp as gcp
import synthtool.languages.node as node
import logging
import pathlib


def patch(library: pathlib.Path):
    # Manual helper methods override the streaming API so that it
    # accepts streamingConfig when calling streamingRecognize.
    # Rename the generated methods to avoid confusion.
    s.replace('src/v*/speech_client.ts', r'( +)streamingRecognize\(', '\\1_streamingRecognize(')
    s.replace('test/gapic_speech_*.ts', r'client\.streamingRecognize\(', 'client._streamingRecognize(')
    s.replace('src/v*/speech_client.ts', r'\Z',
        '\n' +
        "import {ImprovedStreamingClient} from '../helpers';\n" +
        '// eslint-disable-next-line @typescript-eslint/no-empty-interface\n' +
        'export interface SpeechClient extends ImprovedStreamingClient {}\n'
    )


node.owlbot_main(
    staging_excludes=['package.json', 'src/index.ts',],
    templates_excludes=['src/index.ts'],
    patch_staging=patch
)