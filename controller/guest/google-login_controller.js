const { google } = require('googleapis')
const express = require('express');
const router = express.Router();
const axios = require('axios');
var User = require('../../models/User');
var Type = require("../../models/User_type");
// localstorage
var LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');
const googleConfig = {
    clientId: '16491659698-1aptk9c1a33fpnisu1lqij009jt2jivb.apps.googleusercontent.com', // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
    clientSecret: 'u42W1mVNpuWsyIbsbEhryWWC', // e.g. _ASDFA%DFASDFASDFASD#FAD-
    redirect: 'https://projecyundergraduate.herokuapp.com/home' // this must match your google api settings
};
const defaultScope = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
];

function createConnection() {
    return new google.auth.OAuth2(
        googleConfig.clientId,
        googleConfig.clientSecret,
        googleConfig.redirect
    );
}

router.post('/api/google/auth', (req, res) => {

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
    getTokenFromCode(code)

    async function getTokenFromCode(code) {
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
        // console.log(data); // { id, email, given_name, family_name }

        User.find({ "email": data.email })
            .countDocuments()
            .exec(async(err, Data) => {
                if (Data > 0) {
                    User.find({ "email": data.email })
                        .exec((err, DaTa) => {
                            propertyGlobal = [{
                                name: data.name,
                                email: data.email,
                                id: DaTa[0]._id
                            }];
                            var iduser = DaTa[0]._id
                                // tạo 1 localstorage
                            localStorage.setItem('propertyGlobal', JSON.stringify(propertyGlobal));
                            res.send({ data: data, iduser: iduser })
                        })

                } else {
                    var obj_insert = {
                        'name': data.name,
                        'email': data.email,
                        'active': data.verified_email
                    }
                    const user = await User.create(obj_insert,(err,data)=>{
                        Type.updateOne({type:"Member"},{ 
                            "$push": { "UserId": data._id}
                        },function(err, Data) {
                                if (err) throw err;
                                
                            })
                    });
                    propertyGlobal = [{
                        name: data.name,
                        email: data.email,
                        id: user._id
                    }];

                    var iduser = user._id;
                    // tạo 1 localstorage
                    localStorage.setItem('propertyGlobal', JSON.stringify(propertyGlobal));
                    res.send({ data: data, iduser: iduser })
                }
            })


    };

})
module.exports = router;