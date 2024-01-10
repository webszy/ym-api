const fs = require("fs");
const router = require('express').Router();
const randomUseragent = require('random-useragent')
const HttpsProxyAgent = require("https-proxy-agent");
const errorPng = require('path').resolve(__dirname, '../public/error.png')
const sendErrorImage = (res) => {
    //请求失败时，强制不缓存
    return fs.createReadStream(errorPng).pipe(
        res.status(202)
            .setHeader('cache-control', 'no-cache, no-store, must-revalidate')
            .type('png')
    )
}
const isProduction = process.env.NODE_ENV === 'production'

const maxAge = 30 * 24 * 60 * 60 // 30Days
router.get('/', function (req, res, next) {
    const download = require('download')
    const imgUrl = decodeURIComponent(req.query.url).trim()
    // 判断来源，兼容tiktok
    //TODO: tiktok跨域貌似需要cookie
    let originStr = ''
    switch (req.query.origin || 'instagram') {
        case 'tiktok': {
            originStr = 'https://www.tiktok.com/'
            break
        }
        default: {
            originStr = 'https://www.instagram.com/'
            break
        }
    }
    const config = {
        headers: {
            'User-Agent': randomUseragent.getRandom(),
            'Referer': originStr,
            'Origin': originStr
        }
    }
    // 本地环境使用代理
    if (!isProduction) {
        const HttpsProxyAgent = require("https-proxy-agent");
        const agent = new HttpsProxyAgent('http://127.0.0.1:7890')
        Object.assign(config, {agent: {https: agent, http: agent}})
    }

    const isVideo = imgUrl.split('?')[0].toLowerCase().endsWith('mp4')
    const type = isVideo ? 'mp4' : 'png'

    res.setTimeout(24 * 1000, () => {
        sendErrorImage(res)
    })

    download(imgUrl, config)
        .then((e) => {
            // 只在成功的时候缓存资源
            res.setHeader('cache-control', `public, max-age=${maxAge}`)
                .status(200)
                .type(type)
                .send(e)
        })
        .catch((e) => {
            console.log(e)
            sendErrorImage(res)
        })
});

module.exports = router;
