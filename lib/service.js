import express from 'express'

import { apiKeyHandlerFactory } from './api-key-handler.js'
import validate from './request-schema-validator.js'
import sendEmail from './send-email.js'

export const service = express()

service.use(express.json({
  limit: process.env.JSON_BODY_MAX_LENGTH || '100kb'
}))

service.use(apiKeyHandlerFactory({
  apiKeys: process.env.API_KEYS ? process.env.API_KEYS.split(',') : []
}))

service.post('*', async function requestHandler(req, res) {
  if (!validate(req.body))
    return res.status(400).json(validate.errors)

  sendEmail(req.body)
    .then(info => {
      res.status(200).json({ messageId: info.messageId })
    })
    .catch(error => res.status(400).json({ message: error.message }))
})
