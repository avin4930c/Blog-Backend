const createError = require('http-errors');
const express = require('express');
const session = require('express-session'); 
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const blogRouter = require('./routes/blog');

mongoose.set("strictQuery", false);
const mongoDB = "mongodb+srv://avinash4930c:epA86x2T9FCX7UdJ@cluster0.wsag4uw.mongodb.net/blog-api?retryWrites=true&w=majority&appName=Cluster0";

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
  console.log("Connected to MongoDB");
}

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression());

app.use(cors());

app.use(session({
  secret: 'luffy',
  resave: false,
  saveUninitialized: true,
}));

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 100 requests per windowMs
});

app.use(limiter);



app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/blog', blogRouter)

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
