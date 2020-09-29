/* eslint-disable prefer-promise-reject-errors */

import BigNumber from 'bignumber.js'
import moment from 'moment'
import config from '../config.js'
import client from '../server.js'
import logger from '../utils/logger.js'
import VerifyAPI from '@keyko-io/filecoin-verifier-tools/api/api.js'

const endpointUrl = config.server.nodeUrl
const token = config.server.token

const api = new VerifyAPI(VerifyAPI.standAloneProvider(endpointUrl, {
    token: async () => {
      return token
    },
})) 
 //   }), wallet) TODO we need to instantiate some kind of wallet

 const verifierMsigAddress = config.verifierMsigAddress
 const verifierAddress = config.verifierAddress


const Verifier = {

    registerApp: async ( applicationAddress, applicationId, datetimeRequested) => {

        // TODO Implement stuff

        // Creates the M1 App multisig
        // TODO last paremeters (3), is the index account in the wallet
        const app_multisig_addr = await api.newMultisig([verifierAddress, applicationAddress], 2, 3)
        console.log('M1 app_multisig_addr ', app_multisig_addr)

        // add app multisig  to M0 Verifier Multising Address
        const receipt3 = await api.multisigAdd(verifierMsigAddress, app_multisig_addr, 3) 
        
        // TODO Return value

    }
  
}

export default Verifier
