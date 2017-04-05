require('babel-core/register');
require('should');

var jsdom = require('jsdom');
global.document = jsdom.jsdom('<html><body></body></html>');
global.window = global.document.defaultView;
global.navigator = global.window.navigator;
