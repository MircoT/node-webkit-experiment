node-webkit-experiment
======================

An experimental project for an University seminary inside HKBU Internship 2014.  

## Server

The server side is written in javascript using [express.js](http://expressjs.com/).

In that folder you will find also the packages for Windows and Mac OS X and the
plain app for the others, like Linux (naturally you need node-webkit already installed for the plain web app).

The server is ready to be hosted to a PaaS like [Heroku](https://www.heroku.com/).

You can also test it locally installing the dependencies and running it with:

```bash
npm install
node server.js
```

**Notes**: packages have been created using *node-webkit v0.10.0-rc2*.

## Client

The client is a Web App that uses HTML 5, CSS 3 and javascript. You can try it
simply opening the index.html file, or you can use the packages tha you find in
the server folder. Otherwise you can create your own package following the
instructions on the main [website](https://github.com/rogerwang/node-webkit/wiki/How-to-package-and-distribute-your-apps).

## License

The MIT License (MIT)

Copyright (c) 2014 Mirco

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
