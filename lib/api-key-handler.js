export function apiKeyHandlerFactory({ apiKeys }) {
  if (!Array.isArray(apiKeys))
    throw new Error('"apiKeys" must be an array')

  return function apiKeyHandler(req, res, next) {
    if (apiKeys.length === 0)
      return next()

    const apiKey = req.get('X-API-Key')

    if (!apiKey)
      return res.status(401).json({ message: 'X-API-Key header is missing!' })

    if (!apiKeys.includes(apiKey))
      return res.status(403).json({ message: 'Invalid API Key!' })

    next()
  }
}
