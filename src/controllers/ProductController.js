const { Product } = require('../models');

module.exports = {
  register: async (productData) => {
    try {
      await Product.create({

        name: productData.name,

        description: productData.description,
        quantity: productData.quantity,
        price: productData.price,
        filename: productData.filename,
      });
    } catch (error) {
      throw Error('ERROR: ' + error);
    }
  },

  getById: async (id) => {
    try {
      const product = await Product.findByPk(id);

      return product;
    } catch (error) {
      throw Error('ERROR: ' + error);
    }
  },

  get: async () => {
    try {
      return Product.findAll();
    } catch (error) {
      throw Error('ERROR: ' + error);
    }
  },

  delete: async (id) => {
    try {
      return Product.destroy({ where: { id } })
    } catch (error) {
      throw Error('ERROR: ' + error);
    }
  },

  edit: async (id, productData) => {
    try {
      const { name, description, quantity, price, filename } = productData;
      return Product.update({ name, description, quantity, price, filename }, { where: { id } });
    } catch (error) {
      throw Error('ERROR: ' + error);
    }
  },
}