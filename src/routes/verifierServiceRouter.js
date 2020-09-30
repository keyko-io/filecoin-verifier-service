import express from 'express'

import pkg from 'express-validator';
const { check, body, validationResult } = pkg;
//import { check, body, validationResult } from 'express-validator'

import Verifier from '../controllers/verifier.js'
import config from '../config.js'
//import pkg from '../../package.json'

import VerifyAPI from '@keyko-io/filecoin-verifier-tools/api/api.js'
import Wallet from '../utils/wallet.js'

const wallet = new Wallet()
wallet.loadWallet(0)
wallet.importSeed('robot matrix ribbon husband feature attitude noise imitate matrix shaft resist cliff lab now gold menu grocery truth deliver camp about stand consider number')

const api = wallet.api

const { nodeUrl } = config.server
//const { name, version } = pkg
const name = "Verify App Service"
const version = "0.1.0"

const m0 = 't01009'

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

async function checkMultisig(msig) {
    try {
        const lst = await api.pendingTransactions(msig)
        for (const tx of lst) {
            console.log(msig, tx)
            console.log(msig, tx.parsed.parsed)
            if (tx.tx.to != 't01009') {
                continue
            }
            if (tx.parsed.name != 'propose') {
                continue
            }
            if (tx.parsed.params.to != 't06') {
                continue
            }
            if (tx.parsed.parsed.name != 'addVerifiedClient') {
                continue
            }
            if (tx.parsed.params.cap > 12340000000000n) {
                continue
            }
            await api.approvePending(msig, tx, 3)
        }
    }
    catch (err) {
        console.log('cannot read msig', msig)
    }
}

async function listenMultisigs() {
    let msigs = await api.listSigners(m0)

    while (true) {
        for (let msig of msigs) {
            if (await api.actorType(msig) == 'fil/1/multisig') {
                await checkMultisig(msig)
            }
        }
        await new Promise(resolve => { setTimeout(resolve, 10000) })
    }
}

listenMultisigs()

serviceRoutes.get('/', async (req, res) => {
    const accounts = await wallet.getAccounts()
    console.log(accounts)
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
            <span>Account ${accounts[3]}</span>
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
        // check('applicationId', 'Client address not sent').exists(),
        // check('datetimeRequested', 'Client address not sent').exists(),
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
                /*
                const response = await Verifier.registerApp(
                    req.body.applicationAddress,
                    req.body.applicationId,
                    req.body.datetimeRequested
                )
                */

                const accounts = await wallet.getAccounts()
                let response = await api.newMultisig([accounts[3], req.body.applicationAddress], 2, 3)
                let response2 = await api.multisigAdd('t01009', response, 3)

                res.status(200).json({
                    success: true,
                    applicationAddress: req.body.clientAddress,
                    applicationId: req.body.applicationId,
                    // TODO datetimeApproved: ,
                    // TODO how to name these Msig parameters?
                    Msig0Address: "t01009",
                    Msig1Address: response,
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
