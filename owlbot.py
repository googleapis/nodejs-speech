# Copyright 2021 Google LLC
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

import synthtool
import synthtool.gcp as gcp
import synthtool.languages.node as node
import logging

versions = node.detect_versions()

# Manual helper methods overrides the streaming API so that it
# accepts streamingConfig when calling streamingRecognize. Fix
# the gapic tests to use the overridden method signature.
for version in versions:
    s.replace( f"test/gapic-{version}.js",
        "(mockBidiStreamingGrpcMethod\()request",
        r"\1{ streamingConfig: {} }")

    s.replace(
        f"test/gapic-{version}.js",
        "stream\.write\(request\)",
        "stream.write()")

    s.replace(
        f"test/gapic-{version}.js",
        "// Mock request\n\s*const request = {};",
        "")

# Copy common templates
common_templates = gcp.CommonTemplates()
templates = common_templates.node_library(
    versions=versions
)
synthtool.copy(templates, excludes=[])

# Lint, compile protos, etc.:
node.postprocess_gapic_library_hermetic()
