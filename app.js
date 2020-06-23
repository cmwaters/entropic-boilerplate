let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let app = express();
let router = express.Router();
app.set("view engine", "pug");

router.get('/', function(req, res, next) {
    res.render('instructions');
});

router.get('/instructions', function(req, res, next) {
    res.render('instructions');
});

router.get('/game', function(req, res, next) {
    res.render('game');
});

router.get('/end', function(req, res, next) {
    res.render('end');
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/', router);

module.exports = app;
