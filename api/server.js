const express = require('express');
const cors = require('cors');
const { expressjwt: jwt } = require('express-jwt');
const jwks = require('jwks-rsa');
const axios = require('axios');

const app = express();

app.use(cors());

const verifyJwt = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://dev-p6widq8c.us.auth0.com/.well-known/jwks.json'
  }),
  audience: 'this is unique identifier',
  issuer: 'https://dev-p6widq8c.us.auth0.com/',
  algorithms: ['RS256']
}).unless({ path: ['/']})


app.use(verifyJwt);

app.get('/', (req, res) => {
  res.send('Hello from index route')
  
})

app.get('/protected', async (req, res) => {
  try{
    const [_, accessToken] = req.headers.authorization.split(' ');
    const { data: userInfo } = await axios.get('https://dev-p6widq8c.us.auth0.com/userinfo', {
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    })

    console.log(userInfo)
    res.send(userInfo);
  } catch(err){
    res.send(err.message);
  }
})

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error)
})

app.use((error, req, res, next) => {
  const status = error.status || 500
  const message = error.message || "Internal server error"
  res.status(status).send(message)
})

app.listen(4000, () => console.log('server on port 400'))