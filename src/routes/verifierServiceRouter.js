import express from 'express'
import fs from 'fs'
import pkg from 'express-validator'
import jwt from 'jsonwebtoken'
const { check, body, validationResult } = pkg
//import { check, body, validationResult } from 'express-validator'

import Verifier from '../controllers/verifier.js'
import config from '../config.js'
//import pkg from '../../package.json'

const { nodeUrl } = config.server


//const { name, version } = pkg
const name = "Verify App Service"
const version = "0.1.0"

const serviceRoutes = express.Router()

const network = nodeUrl.includes('localhost')
    ? 'Localhost'
    : nodeUrl.includes('nerpa')
    ? 'Nerpa'
    : nodeUrl.includes('testnet')
    ? 'Testnet'
    : nodeUrl.includes('mainnet')
    ? 'Mainnet'
    : 'Unknown'

function generateAccessToken() {
    const token = jwt.sign({ username: 'app' }, config.server.tokenSecret, { expiresIn: '1800000s' })
    fs.writeFileSync('token', token)
}

generateAccessToken()

function authenticateToken(req, res, next) {
    // Gather the jwt access token from the request header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401) // if there isn't any token
  
    jwt.verify(token, config.server.tokenSecret, (err, user) => {
      console.log(err, user)
      if (err) return res.sendStatus(403)
      req.user = user
      next() // pass the execution off to whatever request the client intended
    })
}
  

serviceRoutes.get('/', (req, res) => {
    if (req.get('Accept') === 'application/json') {
        res.json({
            software: name,
            version,
            network
        })
    } else {
        res.send(
            `<strong><code>
            Verify App Service v${version}<br />
            <a href="https://github.com/keyko-io/filecoin-verifier-service">github.com/keyko-io/filecoin-verifier-service</a><br />
            <span>Running against ${network}</span>
        </code></strong>`
        )
    }
})

/*

{
  "applicationAddress": "t01032",
  "applicationId": "LIKE_SLATE_ID",
  "datetimeRequested": "2020-02-08T08:13:49Z"
}

*/
serviceRoutes.post(
    '/verifier/app/register',
    // TODO check PSK in HTTP Authorization Header
    [
        authenticateToken,
        check('applicationAddress', 'Client address not sent').exists(),
        check('applicationId', 'Application ID not sent').exists(),
        check('datetimeRequested', 'Date not sent').exists(),
        body('applicationAddress').custom((value) => {
            /* TODO Add Validations to check Filecoin Address
            if (!Eth.isAddress(value)) {
                return Promise.reject(new Error('Invalid Ethereum address'))
            } else {
                return Promise.resolve()
            }*/
            return Promise.resolve()
        })
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({
                success: false,
                message: 'Bad Request',
                errors: errors.array()
            })
        } else {
            try {

                const response = await Verifier.registerApp(
                    req.body.applicationAddress,
                    req.body.applicationId,
                    req.body.datetimeRequested
                )
                
                 console.log("response:", response) 
                 const { app_multisig_addr } = response

                res.status(200).json({
                    success: true,
                    applicationAddress: req.body.clientAddress,
                    applicationId: req.body.applicationId,
                    // TODO datetimeApproved: ,
                    verifierMsigAddress: config.verifierMsigAddress, //M0
                    appMsigAddress: app_multisig_addr, //M1
                    // TODO datacap limit for app??
                    datacapAllocated: 123_000_000_000    
                })
            } catch (error) {
                res.status(500).json({ success: false, message: error.message })
            }
        }
    }
)

// JUST FOR TESTING E2E
// simulates an "app" endpoint that  allows clients to request datacap
serviceRoutes.post(
    '/verifier/client/datacap',
    // TODO check PSK in HTTP Authorization Header

    [
        authenticateToken,
        check('clientAddress', 'Client address not sent').exists(),
        check('datetimeRequested', 'Client address not sent').exists(),
        body('clientAddress').custom((value) => {
            return Promise.resolve()
        })
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({
                success: false,
                message: 'Bad Request',
                errors: errors.array()
            })
        } else {
            try {
                
                const response = await Verifier.requestDatacap(
                    req.body.clientAddress,
                    req.body.datetimeRequested
                )

                console.log("response:", response)
                const { txId } = response

                res.status(200).json({
                    success: true,
                    clientAddress: req.body.clientAddress,
                    txId,
                    // TODO datetimeApproved: ,
                    // TODO datacap??
                    datacapAllocated: 1000000000000    
                })
            } catch (error) {
                res.status(500).json({ success: false, message: error.message })
            }
        }
    }
)

export default serviceRoutes
