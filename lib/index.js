import { service } from './service.js'

const PORT = Number.parseInt(process.env.PORT || '3000', 10)

const server = service.listen(PORT, () => {
  const address = server.address()
  console.info(`HTTP => SMTP server listening on http://${address.address}:${address.port}`)
})
