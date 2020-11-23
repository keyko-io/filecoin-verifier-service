import 'core-js/stable/index.js'
import 'regenerator-runtime/runtime.js'
import express from 'express'
import compression from 'compression'
import cors from 'cors'
import bodyParser from 'body-parser'
import boxen from 'boxen'
import config from './config.js'
import logger from './utils/logger.js'
import serviceRoutes from './routes/verifierServiceRouter.js'

logger.info('Filecoin Verifier App Service...')

const app = express()

app.use(cors()) 
app.use(compression())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(config.rootPath + '/v1', serviceRoutes)

const server = app.listen(config.server.port, config.server.host, (error) => {
    if (error) {
        logger.error('Error starting server:')
        logger.error(error)
        process.exit(1)
    }
    logger.info(
        boxen(
            `Filecoin Verifier Service\n   running on port ${config.server.port}`,
            {
                padding: 2
            }
        )
    )
})

export default server
