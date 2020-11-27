/* eslint-disable prefer-promise-reject-errors */

import config from '../config.js'
import VerifyAPI from '@keyko-io/filecoin-verifier-tools/api/api.js'
import BasicWallet from '../utils/basicWallet.js'
import KeyWallet from '../utils/keyWallet.js'

const endpointUrl = config.server.nodeUrl
const token = config.server.nodeToken

function makeWallet(key, mnemonic) {
    const testnet = (config.env != "Mainnet")
    if (key) {
        return new KeyWallet(key, testnet)
    }
    else {
        return new BasicWallet(mnemonic, config.testing.path)
    }
}

// ONLY FOR TESTING
//TODO we need to instantiate some kind of wallet with the custodied Private Key
const wallet = makeWallet(config.verifierPrivateKey, config.testing.verifierSeedphrase)
const appWallet = makeWallet(config.appPrivateKey, config.testing.verifierSeedphrase)

const api = new VerifyAPI(VerifyAPI.standAloneProvider(endpointUrl, {
    token: async () => {
      return token
    },
 }), wallet)

const verifierMsigAddress = config.verifierMsigAddress
const appMsigAddress = config.appMsigAddress
const verifierAddress = config.verifierAddress

async function checkMultisig(msig) {
    try {
        let info = await api.multisigInfo(msig)
        if (info.initial_balance < BigInt(info.next_txn_id)) {
            return
        }
        console.log(info)
        const lst = await api.pendingTransactions(msig)
        for (const tx of lst) {
            console.log(msig, tx)
            console.log(msig, tx.parsed.parsed)
            if (tx.tx.to != verifierMsigAddress) {
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
            if (tx.parsed.params.cap == tx.tx.value * 1073741824n) { // 1073741824n = 1 GiB
                continue
            }
            await api.approvePending(msig, tx, 3)
        }
    }
    catch (err) {
        console.log('Cannot read msig', msig, err)
    }
}

async function listenMultisigs() {
    while (true) {
        try {
            let msigs = await api.listSigners(verifierMsigAddress)
            for (let msig of msigs) {
                console.log('Polling...', msig)
                let atype = await api.actorType(msig)
                if (atype.match(/multisig/)) {
                    await checkMultisig(msig)
                }
            }
        }
        catch (err) {
            console.log('Error polling msigs', err)
        }
        await new Promise(resolve => { setTimeout(resolve, 10000) })
    }
}

if (config.runService === 'true') {
    listenMultisigs()
}

const Verifier = {

    registerApp: async ( applicationAddress, applicationId, datetimeRequested) => {

        console.log(await wallet.getAccounts())

        // Creates the M1 App multisig
        // TODO last paremeter is the index account in the wallet. For testing purposes we are set the value in config
        console.log("Creating m1 multisig...")
        console.log("token: " + token)
        console.log(wallet.getAccounts(config.testing.verifierIndexAccount))
        const app_multisig_addr = await api.newMultisig([verifierAddress, applicationAddress], 2, 123, config.testing.verifierIndexAccount)
        console.log('M1 app_multisig_addr ', app_multisig_addr)

        // add app multisig  to M0 Verifier Multising Address
        const receipt = await api.multisigAdd(verifierMsigAddress, app_multisig_addr, config.testing.verifierIndexAccount) 
        
        // TODO Return value
        return {
            app_multisig_addr: app_multisig_addr
        }
        

    },

    // JUST FOR TESTING!
    requestDatacap: async ( clientAddress, datetimeRequested) => {

        const datacapAllocation = BigInt(config.appDatacapAllocation)
        const txId = await api.multisigProposeClient(verifierMsigAddress, appMsigAddress, clientAddress, datacapAllocation, config.testing.appIndexAccount, appWallet) 
        // TODO Return value
        return { txId }
    }
  
}

export default Verifier
