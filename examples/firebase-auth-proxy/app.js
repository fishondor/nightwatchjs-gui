const express = require("express");
const admin = require("firebase-admin");
const cookieParser = require("cookie-parser");
const https = require('https');
const fs = require('fs');
const httpProxy = require('http-proxy');
const cors = require('cors');

const apiProxy = httpProxy.createProxyServer();
const endpoint = 'http://localhost:8080';
const port = 3000;
const serviceAccount = require('[PATH TO SERVICE ACCOUNT FILE]')

const app = express();
app.use(cookieParser());
app.use(cors());

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),

});

app.get('/login', (req,res)=>{

    res.sendFile(__dirname +'/login.html');  //You can use render in case of ejs 
});

app.get('/logout',(req,res)=>{
    res.clearCookie('__session');
    res.sendFile(__dirname +'/login.html');
});

app.get('/savecookie',(req,res)=>{
    const Idtoken=req.query.idToken;
    savecookie(Idtoken,res);
});

app.get('/*', checkCookie, function(req, res) { //GET API
    apiProxy.web(req, res, {target: endpoint});
});

app.put('/*', checkCookie, function(req, res) { //PUT API
    apiProxy.web(req, res, {target: endpoint});
});

app.post('/*', checkCookie, function(req, res) { //POST API
    apiProxy.web(req, res, {target: endpoint});
});

app.delete('/*', checkCookie, function(req, res) { //DELETE API
    apiProxy.web(req, res, {target: endpoint});
});

function savecookie(idtoken,res){

    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    admin.auth().createSessionCookie(idtoken,{expiresIn})
    .then((sessionCookie)=>{
        const options = {maxAge: expiresIn, httpOnly: true, secure: true};
        res.cookie('__session', sessionCookie, options);
	
        admin.auth().verifyIdToken(idtoken).then(function(decodedClaims){
            res.redirect('/');
        });

    },error=>{
        console.log(error);
        res.status(401).send("UnAuthorised Request");

    });
}


function checkCookie(req,res,next){
	const sessionCookie = req.cookies.__session || '';
	admin.auth().verifySessionCookie(
		sessionCookie, true).then((decodedClaims) => {
			req.decodedClaims = decodedClaims;
			next();
		})
		.catch(error => {
			res.redirect('/login');
		});
}

https.createServer({
    key: fs.readFileSync(`[PATH TO CERTIFICATE KEY]`),
    cert: fs.readFileSync(`[PATH TO CERTIFICATE]`)
}, app)
.listen(port, function () {
    console.log(`Firebase auth proxy is listening on port ${port} with target: ${endpoint}`);
});