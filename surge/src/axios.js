const axios = require('axios').default;
module.exports = {
  createHttpClient: (HTTP_API) => {
    const [xkey, baseURL] = HTTP_API.split('@');
    return axios.create({
      baseURL: `http://${baseURL}`,
      headers: { 'X-Key': xkey }
    });
  }
};
