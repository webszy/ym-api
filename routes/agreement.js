const path = require("path");
const router = require('express').Router();
const fs = require('fs-extra')
const viewPath = path.resolve(__dirname, '../views/agreements')
router.get('/content/:viewName', (req, res) => {
    const fileName = req.params.viewName
    const appname = req.query.name
    const appemail = req.query.email
    res.charset = 'utf8'
    const obj = { appname: appname, appemail: appemail }
    try {
        fs.accessSync(path.join(viewPath, fileName + '.ejs'), fs.constants.R_OK)
        res.render('./agreements/'+fileName, obj)
    } catch (err) {
        res.sendStatus(404)
    }

})
router.get('/list', (req, res) => {
    const nameToLabel = {
        aiTagIos: 'AI Tag(IOS)',
        aiTagAndroid: 'AI Tag(Android)',
        FacialPrivacyPolicy: 'Facial Privacy Policy',
        newPrivacy: '隐私协议2',
        privacy: 'Privacy Policy',
        privacy3: '隐私协议3',
        qrcodeAndroid: 'QR Code(Android)',
        termofuse: '使用协议',
        termofuse2: '使用协议2',
        privacy4: 'A57-Privacy',
        privacy5: 'A58-Privacy',
        privacy6: '隐私协议4',
        privacy7: '隐私协议5',
        privacy8: '隐私协议6',
        privacy9: '隐私协议7',
        privacy10: 'Look Alike'
    }
    try {
        const fileList = fs.readdirSync(viewPath)
            .map(item => {
                const name = item.replace('.ejs', '')
                return {
                    label: name,
                    title: nameToLabel[name]
                }
            })
        res.json({
            code: 200,
            data: fileList
        })
    } catch (error) {
        res.json({
            code: 500,
            msg: error
        })
    }
})
module.exports = router;
