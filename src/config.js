
const testVerifierSeedphrase = "exit mystery juice city argue breeze film learn orange dynamic marine diary antenna road couple surge marine assume loop thought leader liquid rotate believe"
const testTokenSecret = '5fe21ae743ad7cafabf1f5003d898da760db0a615ad08036cbbeb73d03096ff6cddf0263e746b4272a5d0b79bc5b27dee244dc089ad0e47a52a2c6c81e839b73'

export default {
    env: process.env.NODE_ENV || 'development',  // development, Nerpanet, Mainnet
    name: process.env.NAME || "Filecoin Verify App Service",
    version: 0.2,
    rootPath:  process.env.ROOT_PATH || "",
    server: {
        port: process.env.SERVER_PORT || 3001,
        host: process.env.SERVER_HOST || '127.0.0.1',
        nodeToken: process.env.NODE_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIiwiYWRtaW4iXX0.q9O3FVNyhln_nLN62Mflc9n_Kfh7w0unQdY0qLGqHoE',
        tokenSecret: process.env.TOKEN_SECRET || testTokenSecret,
        nodeUrl: process.env.NODE_URL || 'ws://localhost:1234/rpc/v0'
    },
    runAppService: process.env.RUN_APP_SERVICE || "true",
    runService: process.env.RUN_SERVICE || "true",
    verifierMsigAddress: process.env.VERIFIER_MSIG_ADDRESS || "t01009",
    verifierAddress: process.env.VERIFIER_ADDRESS || 't1gechnbsldgbqan4q2dwjsicbh25n5xvvdzhqd3y',
    verifierPrivateKey: process.env.VERIFIER_PRIVATE_KEY,
    appMsigAddress: process.env.APP_MSIG_ADDRESS || "t01010",
    appPrivateKey: process.env.APP_PRIVATE_KEY,
    appDatacapAllocation:  process.env.APP_DATACAP_ALLOCATION || 1n, // default 1 GB
    testing: {
        verifierSeedphrase: process.env.VERIFIER_SEED_PHRASE || testVerifierSeedphrase,
        verifierIndexAccount: process.env.VERIFIER_ACCOUNT_INDEX || "3",
        appIndexAccount: process.env.VERIFIER_ACCOUNT_INDEX || "4",
        path: "m/44'/1'/0/0"
    }

}
