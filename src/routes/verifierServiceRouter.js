import express from 'express'

import pkg from 'express-validator';
const { check, body, validationResult } = pkg;
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
        check('applicationAddress', 'Client address not sent').exists(),
        check('applicationId', 'Client address not sent').exists(),
        check('datetimeRequested', 'Client address not sent').exists(),
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

                // TODO implement logic in verifier
                const response = await Verifier.registerApp(
                    req.body.applicationAddress,
                    req.body.applicationId,
                    req.body.datetimeRequested
                )
                 req.body.agent
                
                const { txId } = response.result

                res.status(200).json({
                    success: true,
                    applicationAddress: req.body.clientAddress,
                    applicationId: req.body.applicationId,
                    // TODO datetimeApproved: ,
                    // TODO how to name these Msig parameters?
                    Msig0Address: "",
                    Msig1Address: "",
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
