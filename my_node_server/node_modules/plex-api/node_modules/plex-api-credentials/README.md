# plex-api-credentials [![Build Status](https://api.travis-ci.org/phillipj/node-plex-api-credentials.png)](http://travis-ci.org/phillipj/node-plex-api-credentials)

[plex-api](https://www.npmjs.com/package/plex-api) authenticator module which provides PlexHome credentials authentication.

## Usage

```js
var PlexAPI = require('plex-api');
var credentials = require('plex-api-credentials');

var userAndPass = credentials({
    username: 'foo',
    password: 'bar'
});

var client = new PlexAPI({
    hostname: '192.168.0.1',
    authenticator: userAndPass
});

// use PlexAPI client as usual
client.find('/library/sections', ...);
```

## Events

### `token`

Emitted whenever a token has been retrieved from plex.tv.

### Usage

```js
userAndPass.on('token', function(token){
    // possibly cache retrieved token here?
});
```

## Contributing

Contributions are more than welcome! Create an issue describing what you want to do.
If that feature is seen to fit this project, send a pull request with the changes accompanied by tests.

## Changelog

### v2.0.0

- Use plex-api-headers for generating X-Plex headers
- Changed .authenticate(apiOptions) -> .authenticate(plexApi)

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