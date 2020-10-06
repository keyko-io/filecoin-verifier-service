import signer from '@zondax/filecoin-signing-tools/js'

export default class KeyWallet {
  constructor(key, testnet) {
    this.privatekey = key
    this.testnet = testnet
  }

  async getAccounts(nStart = 0, nEnd = 5) {
    const accounts = []
    for (let i = nStart; i < nEnd; i += 1) {
      accounts.push(
        signer.keyRecover(this.privatekey, this.testnet).address,
      )
    }
    return accounts
  }

  async sign(filecoinMessage, indexAccount) {
    console.log('signing with private key')
    return signer.transactionSignLotus(
      filecoinMessage,
      this.privatekey,
    )
  }
}

