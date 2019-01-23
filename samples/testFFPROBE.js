var ffprobe = require('ffprobe'),
    ffprobeStatic = require('ffprobe-static');

ffprobe('./file.mp4', { path: ffprobeStatic.path })
  .then(function (info) {
    console.log(info);
    /***
    {
        "streams": [
            {
                "index": 0,
                "codec_name": "h264",
                "codec_long_name": "H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10",
                "profile": "High",

                ...
                }
            }
        ]
    }
     **/
  })
  .catch(function (err) {
    console.error(err);
  })
