/* eslint-disable prefer-promise-reject-errors */

import BigNumber from 'bignumber.js'
import moment from 'moment'
import config from '../config.js'
import client from '../server.js'
import logger from '../utils/logger.js'
import VerifyAPI from '@keyko-io/filecoin-verifier-tools/api/api.js'
import BasicWallet from '../utils/basicWallet.js'

const endpointUrl = config.server.nodeUrl
const token = config.server.token

// ONLY FOR TESTING
const path = "m/44'/1'/1/0"
const wallet = new BasicWallet(config.testing.verifierSeedphrase, path)

const api = new VerifyAPI(VerifyAPI.standAloneProvider(endpointUrl, {
    token: async () => {
      return token
    },
 }), wallet) 
 
 //TODO we need to instantiate some kind of wallet with the custodied Private Key

 const verifierMsigAddress = config.verifierMsigAddress
 const verifierAddress = config.verifierAddress

const Verifier = {

    registerApp: async ( applicationAddress, applicationId, datetimeRequested) => {

        // Creates the M1 App multisig
        // TODO last paremeter is the index account in the wallet. For testing purposes we are set the value in config
        console.log("Creating m1 multisig...")
        console.log(wallet.getAccounts(config.testing.verifierIndexAccount))
        const app_multisig_addr = await api.newMultisig([verifierAddress, applicationAddress], 2, config.testing.verifierIndexAccount)
        console.log('M1 app_multisig_addr ', app_multisig_addr)

        // add app multisig  to M0 Verifier Multising Address
        const receipt = await api.multisigAdd(verifierMsigAddress, app_multisig_addr, config.testing.verifierIndexAccount) 
        
        // TODO Return value
        return {
            app_multisig_addr: app_multisig_addr,
        }
        

    },


    // JUST FOR TESTING !
    requestDatacap: async ( clientAddress, applicationAddress, applicationId, verifierMsigAddress, appMsigAddress, datetimeRequested) => {

        
        // Instance the API with the address of the app

        // Propose  verifreg.addDatacap to the verifierMsigAddress (M0)
        
        // propose the previous tx to the appMsigAddress (M1)


        // 


        
        // TODO Return value
        return {
            txId: "",
        }
        

    }
  
}

export default Verifier
