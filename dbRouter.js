const express = require('express')
const router = express.Router()
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
let globalPhoneCodePromise;
let clientStartPromise;
function generatePromise() {
    let resolve, reject;
    let promise = new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    })
    return { resolve, reject, promise };
}

router.post('/setup', async (req, res) => {
    console.log("Calling setup")
    const setupStep = req.body.setupStep;
    const phoneNumber = req.body.phoneNumber;
    const password = req.body.password;
    const obtainedCode = req.body.code; // Convert apiId to number
    console.log(setupStep, phoneNumber)
    credentials = {
        "apiId": 26725205,
        "apiHash": "a4bc88912823d011308b761a34dcc831"
    }

    if(setupStep == 1){
        client = new TelegramClient(new StringSession(""), credentials.apiId, credentials.apiHash, {
            connectionRetries: 5,
        });
        
        globalPhoneCodePromise = generatePromise()
        clientStartPromise = client.start({
            phoneNumber: phoneNumber,
            password: async () => {return password},
            phoneCode: async () => {
                let code = await globalPhoneCodePromise.promise;
                globalPhoneCodePromise = generatePromise();
                return code;
            },
            onError: (err) => {
                console.log(err)
                res.json({
                    "status": "error",
                    "setupStep": 9,
                    "message": err
                })
            },
        });
        
        res.json({
            "status": "ok",
            "setupStep": 1
        })
    } else if(setupStep == 2){
        globalPhoneCodePromise.resolve(obtainedCode);

        clientStartPromise.then(async () => {
            console.log(client.session.save());
            console.log("You should now be connected.");
            credentials = {
                "apiId": apiId,
                "apiHash": apiHash,
                "stringSession": client.session.save()
            }

            res.json({
                "status": "ok",
                "setupStep": 2
            })

        }).catch(err => {
            res.json({
                "status": "error",
                "setupStep": 2,
                "message": err
            })
        })
    }
})

module.exports = router