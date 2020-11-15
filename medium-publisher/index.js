const axios = require('axios');
const TOKEN = '2ecfd1899bd5bc26042690614ba57786e6dd9782bd0e847ecc1f5f4e2d3357368';

async function createPost() {

    try {
        const res = await axios.post('https://api.medium.com/v1/users/alanhg/posts', {
                "title": "Liverpool FC",
                "contentFormat": "html",
                "content": "<h1>Liverpool FC</h1><p>You’ll never walk alone.</p>",
                "canonicalUrl": "http://jamietalbot.com/posts/liverpool-fc",
                "tags": ["football", "sport", "Liverpool"],
                "publishStatus": "public"
            },
            {
                headers: {
                    'Authorization': `Bearer ${TOKEN}`
                }
            })
        console.log(res);
    } catch (e) {
        console.error(e);
    }
}

createPost();
