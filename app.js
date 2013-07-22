var express = require('express');
var Facebook = require('facebook-node-sdk');
var config  = require('./config');
var controllers = require('./controllers');
var app = express();

app.use(express.logger());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: 'foo bar' }));
app.use(Facebook.middleware({ appId: config.facebook.app.id, secret: config.facebook.app.secret }));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

app.post('/', Facebook.loginRequired(config.facebook.app.params), controllers.app.home);

app.listen(process.env.VCAP_APP_PORT || 3000);