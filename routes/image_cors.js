const fs = require("fs");
const router = require('express').Router();
const randomUseragent  = require('random-useragent')
const errorPng = require('path').resolve(__dirname, '../public/error.png')
const sendErrorImage = (res)=> fs.createReadStream(errorPng).pipe(res.status(200).type('png'))
// const HttpsProxyAgent = require("https-proxy-agent");
// const agent = new HttpsProxyAgent('http://127.0.0.1:7890')
router.get('/', function(req, res, next) {
  const download = require('download')
  let imgUrl = decodeURIComponent(req.query.url).trim()
  const headers={
    'User-Agent': randomUseragent.getRandom(),
    'Referer': 'https://www.instagram.com/',
    'Origin': 'https://www.instagram.com'
  }
  // 判断是否时是正确网址
  if(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg|mp4|bmp|webp)$/.test(imgUrl.split('?')[0]) === false){
    return sendErrorImage(res)
  }

  const isVideo = imgUrl.split('?')[0].toLowerCase().endsWith('mp4')
  const type=isVideo ? 'mp4' : 'png'

  res.setTimeout(24 * 1000,() => {
    sendErrorImage(res)
  })

  download(imgUrl,{
    headers,
    // agent: {https: agent, http: agent}
  })
      .then((e)=>{
        res.status(200).type(type).send(e)
      })
      .catch((e)=>{
        console.log(e)
        sendErrorImage(res)
      })
});

module.exports = router;
