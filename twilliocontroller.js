const authToken = 'AC55780947fbe52709d410111e64671587'
const accountSid = '6d1553d935f09f4acd3fa4430a6449a1'
const client = require('twilio')(accountSid, authToken);

let otp=Math.ceil(Math.random()*1000000)
console.log(otp)

client.messages.create({ to: +9816635578, from: +12525855097,body: 'Verify First: Your code is ' + otp})