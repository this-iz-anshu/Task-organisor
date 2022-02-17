const sendGrid = require('@sendgrid/mail');

const sendGridApi = process.env.SENDGRID_API_KEY

sendGrid.setApiKey(sendGridApi);



const welcomeMessage = (name,mail) => {
    sendGrid.send({
        to: mail,
        from: 'sharmaanshu2441@gmail.com',
        subject: 'welcome',
        text:`Hello ${name}  Thanks fo creating account `
    })
}

const login = (mail ) => {
    
}

module.exports = {
    welMsg: welcomeMessage,
    
}