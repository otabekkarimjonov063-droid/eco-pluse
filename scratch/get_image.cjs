const https = require('https');

https.get('https://elitebike.ua/v-centre-vnimaniya-populyarnyj-eko-transport-seev-citycoco', (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => {
    const images = data.match(/<img[^>]+src=["'](.*?)["']/g);
    console.log(images.join('\n'));
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
