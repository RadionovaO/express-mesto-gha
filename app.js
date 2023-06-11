const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
//const routerUsers = require('./routes/users');
//const routerCards = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
    req.user = {
      _id: '6480f4b7029d8ddcea12ca21' 
    };
  
    next();
  }); 

app.use(routes);
//app.use(routerUsers);
//app.use(routerCards);

app.listen(PORT, () => {
    console.log(`App listening on ${PORT} port`)
});