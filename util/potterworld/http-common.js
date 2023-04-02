const axios = require('axios');

const instance = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
});

module.exports = instance;