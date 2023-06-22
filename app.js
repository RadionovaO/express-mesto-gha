const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const routes = require('./routes');
const { auth } = require('./middlewares/auth');
const { errorsHandler } = require('./middlewares/errorsHandler');
const {
  createUser,
  login,
} = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(cookieParser());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

/* app.use((req, res, next) => {
  req.user = {
    _id: '6480f4b7029d8ddcea12ca21',
  };

  next();
}); */

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use(routes);

app.use(errors());
app.use(errorsHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on ${PORT} port`);
});
