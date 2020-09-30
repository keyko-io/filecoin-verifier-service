export default {
    env: process.env.NODE_ENV || 'development',
    server: {
        port: process.env.SERVER_PORT || 3001,
        nodeToken: process.env.NODE_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIiwiYWRtaW4iXX0.q9O3FVNyhln_nLN62Mflc9n_Kfh7w0unQdY0qLGqHoE',
        nodeUrl: process.env.NODE_URL || 'ws://localhost:1234/rpc/v0'
    },
    verifierMsigAddress: "t01008",
    verifierAddress: process.env.VERIFIER_ADDRESS || 't1gechnbsldgbqan4q2dwjsicbh25n5xvvdzhqd3y',
    testing: {
        verifierSeedphrase: "exit mystery juice city argue breeze film learn orange dynamic marine diary antenna road couple surge marine assume loop thought leader liquid rotate believe",
        verifierIndexAccount: "3",
        rkhSeedphrase: "robot matrix ribbon husband feature attitude noise imitate matrix shaft resist cliff lab now gold menu grocery truth deliver camp about stand consider number",
        rkhIndexAccount: "2",
        path: "m/44'/1'/1/0"
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
