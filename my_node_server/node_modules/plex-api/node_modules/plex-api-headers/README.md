# plex-api-headers [![Build Status](https://api.travis-ci.org/phillipj/node-plex-api-headers.png)](http://travis-ci.org/phillipj/node-plex-api-headers)

Helper module providing HTTP headers used by [plex-api](https://www.npmjs.com/package/plex-api) and related modules.

Returns an object of headers to be used when requesting Plex related services.

## Usage

```js
var PlexAPI = require('plex-api');
var headers = require('plex-api-headers');

var client = new PlexAPI('localhost');

var httpHeaders = headers(client);
// -> { 'X-Plex-Device-Name': 'Node.js App', ... }

// additional headers might be provided
var jsonHeaders = headers(client, { 'Accept': 'application/json' });
```

## Contributing

Contributions are more than welcome! Create an issue describing what you want to do.
If that feature is seen to fit this project, send a pull request with the changes accompanied by tests.

## Changelog

### v1.1.0

- Only add additional headers which has string as their value.

### v1.0.0

Initial release. Pretty much extracted as was when the code once existed in the plex-api module itself.

## License
(The MIT License)

Copyright (c) 2015 Phillip Johnsen &lt;johphi@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.