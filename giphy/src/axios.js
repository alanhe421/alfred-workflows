const axios = require('axios').default;
module.exports = {
  createHttpClient: () => {
    return axios.create({
      baseURL: `https://api.giphy.com`
    });
  }
};
