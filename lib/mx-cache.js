import { resolveMx } from 'dns'
import { promisify } from 'util'
import LRU from 'lru-cache'

const resolveMxAsync = promisify(resolveMx)

const cache = new LRU({
  max: 1000,
  maxAge: 1000 * 60 * 60 // 1 hour
})

export default function getMxEntries(hostname) {
  const cached = cache.get(hostname)

  if (cached)
    return Promise.resolve(cached)

  return resolveMxAsync(hostname)
    .then(result => {
      const sorted = result.sort((a, b) => {
        return a.priority - b.priority
      })

      cache.set(hostname, sorted)

      return sorted;
    })
}
