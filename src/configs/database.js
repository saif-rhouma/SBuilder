module.exports = {
  production: {
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE,
  },
  development: {
    dialect: 'sqlite',
    storage: process.env.DB_DEV_STORAGE,
  },
  test: {
    dialect: 'sqlite',
    storage: process.env.DB_TEST_STORAGE,
  },
};
