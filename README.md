node-webkit-experiment
======================

An experimental project for an *University seminary* inside **HKBU/UniPG Internship 2014**.  

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

**Note**: packages have been created using **node-webkit v0.10.0-rc2**.

## Client

The client is a Web App that uses HTML 5, CSS 3 and javascript. You can try it
simply opening the *index.html* file, or you can use the packages tha you find in
the server folder. Otherwise you can create your own package following the
instructions on the main [website](https://github.com/rogerwang/node-webkit/wiki/How-to-package-and-distribute-your-apps).

**Note**: remember that as default the server url is *http://node-webkit-seminar.herokuapp.com*,
so you must change this url depending on where you hosted the sever.
