const { google } = require('googleapis')
const express = require('express');
const router = express.Router();
const axios = require('axios')
const googleConfig = {
    clientId: '16491659698-1aptk9c1a33fpnisu1lqij009jt2jivb.apps.googleusercontent.com', // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
    clientSecret: 'u42W1mVNpuWsyIbsbEhryWWC', // e.g. _ASDFA%DFASDFASDFASD#FAD-
    redirect: 'http://localhost:4500/home' // this must match your google api settings
};
const defaultScope = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
];
/**
 * Create the google auth object which gives us access to talk to google's apis.
 */
router.post('/api/google/auth', (req, res) => {
    function createConnection() {
        return new google.auth.OAuth2(
            googleConfig.clientId,
            googleConfig.clientSecret,
            googleConfig.redirect
        );
    }

    function getConnectionUrl(auth) {
        return auth.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: defaultScope
        });
    }



    function urlGoogle() {
        const auth = createConnection(); // this is from previous step
        const url_g = getConnectionUrl(auth);
        res.send({ url_g: url_g });
    }
    urlGoogle();

});
router.post('/api/google/getUserInfo', (req, res) => {
    var code = req.body.code;
    getGoogleAccountFromCode(code)

    function createConnection() {
        return new google.auth.OAuth2(
            googleConfig.clientId,
            googleConfig.clientSecret,
            googleConfig.redirect
        );
    }
    async function getGoogleAccountFromCode(code) {
        const auth = createConnection();
        const data = await auth.getToken(code);
        const tokens = data.tokens;
        auth.setCredentials(tokens);
        getGoogleUserInfo(tokens.access_token)
    }
    async function getGoogleUserInfo(access_token) {
        const { data } = await axios({
            url: 'https://www.googleapis.com/oauth2/v2/userinfo',
            method: 'get',
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        console.log(data); // { id, email, given_name, family_name }
        res.send({ data: data })
    };

})
module.exports = router;