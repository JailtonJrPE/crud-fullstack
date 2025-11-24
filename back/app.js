var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors")
require('dotenv').config()

var app = express();
// Permite qualquer origem (útil para desenvolvimento)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

// IMPORTANDO ROTAS
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var alunosRouter = require('./routes/alunos');
var petsRouter = require('./routes/pets');
var authRouter = require('./routes/auth')
var tutorsRouter = require('./routes/tutors')

// USANDO ROTAS
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/alunos', alunosRouter);
app.use('/pets', petsRouter);
app.use('/tutors', tutorsRouter);
app.use('/auth', authRouter)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
