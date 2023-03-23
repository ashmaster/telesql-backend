const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input"); 
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

const apiId = 26725205;
const apiHash = "a4bc88912823d011308b761a34dcc831";
const stringSession = new StringSession("");
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

(async () => {
  console.log("Loading interactive example...");
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });
  await client.start({
    phoneNumber: async () => await input.text("Please enter your number: "),
    password: async () => await input.text("Please enter your password: "),
    phoneCode: async () =>
      await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });
  console.log("You should now be connected.");
  localStorage.setItem('dbkey', client.session.save())
  await client.sendMessage("me", { message: "Hello!" });
})();