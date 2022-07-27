const Respository = require('./repository');

class ProductsRepository extends Respository {}

module.exports = new ProductsRepository('products.json');
