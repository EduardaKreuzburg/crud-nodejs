const { User } = require('../models');

module.exports =  {
  register: async (userData) => {
    try {
      await User.create({
        name: userData.name,
        email: userData.email,
        password: userData.password,
      });
    } catch (error) {
      throw Error('ERROR: ' + error);
    }
  }
}