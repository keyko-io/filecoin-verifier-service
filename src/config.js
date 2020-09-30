export default {
    env: process.env.NODE_ENV || 'development',
    server: {
        port: process.env.SERVER_PORT || 3001,
        nodeToken: process.env.NODE_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIiwiYWRtaW4iXX0.TdGBarZKRTI5nRkQE9V_ScWj5hGlMPldskmE8oGnfos',
        nodeUrl: process.env.NODE_URL || 'ws://localhost:1234/rpc/v0'
    },
    verifierMsigAddress: "t1xxxxx",
    verifierAddress: process.env.VERIFIER_ADDRESS ||  't01003',
    testing: {
        verifierSeedphrase: "exit mystery juice city argue breeze film learn orange dynamic marine diary antenna road couple surge marine assume loop thought leader liquid rotate believe",
        verifierIndexAccount: "2",
        rkhSeedphrase: "robot matrix ribbon husband feature attitude noise imitate matrix shaft resist cliff lab now gold menu grocery truth deliver camp about stand consider number",
        rkhIndexAccount: "2"
        // path = "m/44'/1'/0/0"
    }
    /*,
    database: {
        uri: process.env.ELASTIC_URL || 'http://localhost:9200',
        user: process.env.ELASTIC_USER || 'elastic',
        password: process.env.ELASTIC_PASSWORD || 'changeme',
        index: process.env.ELASTIC_INDEX || 'faucetdb'
    }
    */
}
