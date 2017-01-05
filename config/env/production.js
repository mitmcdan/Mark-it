var port = process.env.PORT;
var url = process.env.MONGOLAB_URI;

module.exports = {
    port: port,
    db: url,
    facebook: {
        clientID: '331931160476236',
        clientSecret: 'cc2bb7a83fec07a6929d4a4b0554e0dd',
        callbackURL: 'http://localhost:'+ port +'/oauth/facebook/callback'
    }
};