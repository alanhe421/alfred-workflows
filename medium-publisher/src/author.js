const axios = require('axios');
const [, , TOKEN] = process.argv;

function main() {
  getUserInfo();
}

/**
 * @description
 * UserID不会变
 */
function getUserInfo() {
  axios
    .get(`https://api.medium.com/v1/me`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    })
    .then(({ data: res }) => {
      console.log(res.data.id);
    })
    .catch((err) => {
      console.error(err);
    });
}

main();
