// Copyright 2017, Google LLC All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const assert = require('assert');
const through2 = require('through2');

const speechModule = require('../src');

var FAKE_STATUS_CODE = 1;
var error = new Error();
error.code = FAKE_STATUS_CODE;

describe('SpeechClient', () => {
  describe('recognize', () => {
    it('invokes recognize without error', done => {
      var client = new speechModule.v1.SpeechClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var encoding = 'FLAC';
      var sampleRateHertz = 44100;
      var languageCode = 'en-US';
      var config = {
        encoding: encoding,
        sampleRateHertz: sampleRateHertz,
        languageCode: languageCode,
      };
      var uri = 'gs://bucket_name/file_name.flac';
      var audio = {
        uri: uri,
      };
      var request = {
        config: config,
        audio: audio,
      };

      // Mock response
      var expectedResponse = {};

      // Mock Grpc layer
      client._innerApiCalls.recognize = mockSimpleGrpcMethod(
        request,
        expectedResponse
      );

      client.recognize(request, (err, response) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });

    it('invokes recognize with error', done => {
      var client = new speechModule.v1.SpeechClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var encoding = 'FLAC';
      var sampleRateHertz = 44100;
      var languageCode = 'en-US';
      var config = {
        encoding: encoding,
        sampleRateHertz: sampleRateHertz,
        languageCode: languageCode,
      };
      var uri = 'gs://bucket_name/file_name.flac';
      var audio = {
        uri: uri,
      };
      var request = {
        config: config,
        audio: audio,
      };

      // Mock Grpc layer
      client._innerApiCalls.recognize = mockSimpleGrpcMethod(
        request,
        null,
        error
      );

      client.recognize(request, (err, response) => {
        assert(err instanceof Error);
        assert.equal(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('longRunningRecognize', function() {
    it('invokes longRunningRecognize without error', done => {
      var client = new speechModule.v1.SpeechClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var encoding = 'FLAC';
      var sampleRateHertz = 44100;
      var languageCode = 'en-US';
      var config = {
        encoding: encoding,
        sampleRateHertz: sampleRateHertz,
        languageCode: languageCode,
      };
      var uri = 'gs://bucket_name/file_name.flac';
      var audio = {
        uri: uri,
      };
      var request = {
        config: config,
        audio: audio,
      };

      // Mock response
      var expectedResponse = {};

      // Mock Grpc layer
      client._innerApiCalls.longRunningRecognize = mockLongRunningGrpcMethod(
        request,
        expectedResponse
      );

      client
        .longRunningRecognize(request)
        .then(responses => {
          var operation = responses[0];
          return operation.promise();
        })
        .then(responses => {
          assert.deepStrictEqual(responses[0], expectedResponse);
          done();
        })
        .catch(err => {
          done(err);
        });
    });

    it('invokes longRunningRecognize with error', done => {
      var client = new speechModule.v1.SpeechClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      var encoding = 'FLAC';
      var sampleRateHertz = 44100;
      var languageCode = 'en-US';
      var config = {
        encoding: encoding,
        sampleRateHertz: sampleRateHertz,
        languageCode: languageCode,
      };
      var uri = 'gs://bucket_name/file_name.flac';
      var audio = {
        uri: uri,
      };
      var request = {
        config: config,
        audio: audio,
      };

      // Mock Grpc layer
      client._innerApiCalls.longRunningRecognize = mockLongRunningGrpcMethod(
        request,
        null,
        error
      );

      client
        .longRunningRecognize(request)
        .then(responses => {
          var operation = responses[0];
          return operation.promise();
        })
        .then(() => {
          assert.fail();
        })
        .catch(err => {
          assert(err instanceof Error);
          assert.equal(err.code, FAKE_STATUS_CODE);
          done();
        });
    });

    it('has longrunning decoder functions', () => {
      var client = new speechModule.v1.SpeechClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      assert(
        client._descriptors.longrunning.longRunningRecognize
          .responseDecoder instanceof Function
      );
      assert(
        client._descriptors.longrunning.longRunningRecognize
          .metadataDecoder instanceof Function
      );
    });
  });

  describe('streamingRecognize', () => {
    it('invokes streamingRecognize without error', done => {
      var client = new speechModule.v1.SpeechClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock initial request
      var initialRequest = {
        streamingConfig: undefined,
      };

      // Mock request
      var request = {
        audioContent: 'test',
      };

      // Mock response
      var expectedResponse = {};

      // Mock Grpc layer
      client._innerApiCalls.streamingRecognize = mockBidiStreamingGrpcMethod(
        initialRequest,
        request,
        expectedResponse
      );

      var stream = client
        .streamingRecognize()
        .on('data', response => {
          if (response !== undefined) {
            assert.deepStrictEqual(response, expectedResponse);
            done();
          }
        })
        .on('error', err => {
          done(err);
        });

      stream.write('test');
    });

    it('invokes streamingRecognize with error', done => {
      var client = new speechModule.v1.SpeechClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock initial request
      var initialRequest = {
        streamingConfig: undefined,
      };

      // Mock request
      var request = {
        audioContent: 'test',
      };

      // Mock Grpc layer
      client._innerApiCalls.streamingRecognize = mockBidiStreamingGrpcMethod(
        initialRequest,
        request,
        null,
        error
      );

      var stream = client
        .streamingRecognize()
        .on('data', () => {
          assert.fail();
        })
        .on('error', err => {
          assert(err instanceof Error);
          assert.equal(err.code, FAKE_STATUS_CODE);
          done();
        });

      stream.write('test');
    });
  });
});

function mockSimpleGrpcMethod(expectedRequest, response, error) {
  return function(actualRequest, options, callback) {
    assert.deepStrictEqual(actualRequest, expectedRequest);
    if (error) {
      callback(error);
    } else if (response) {
      callback(null, response);
    } else {
      callback(null);
    }
  };
}

function mockBidiStreamingGrpcMethod(
  expectedInitialRequest,
  expectedRequest,
  response,
  error
) {
  var requestNum = 1;
  return () => {
    var mockStream = through2.obj((chunk, enc, callback) => {
      if (requestNum === 1) {
        assert.deepStrictEqual(chunk, expectedInitialRequest);
      } else {
        assert.deepStrictEqual(chunk, expectedRequest);
      }
      requestNum++;
      if (error) {
        callback(error);
      } else if (requestNum > 2) {
        callback(null, response);
      } else {
        callback(null);
      }
    });
    return mockStream;
  };
}

function mockLongRunningGrpcMethod(expectedRequest, response, error) {
  return request => {
    assert.deepStrictEqual(request, expectedRequest);
    var mockOperation = {
      promise: function() {
        return new Promise((resolve, reject) => {
          if (error) {
            reject(error);
          } else {
            resolve([response]);
          }
        });
      },
    };
    return Promise.resolve([mockOperation]);
  };
}
