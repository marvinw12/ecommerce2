const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
const adminProductsRouter = require('./routes/admin/products');
const productsRouter = require('./routes/products');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ['eirufnefiun23edn'],
  })
);
app.use(authRouter);
app.use(adminProductsRouter);
app.use(productsRouter);

app.listen(3000, () => {
  console.log('Listening');
});
