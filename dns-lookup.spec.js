const dnsLookup = require('./dns-lookup')
const { $site, $hostname, $forward } = require('./symbols')

describe('dns-lookup', () => {
  it('looks for hostname', async () => {
    const site = {
        forward: 'https://www.microsoft.com/test',
        [$hostname]: 'www.microsoft.com'
    }
    await dnsLookup({
        [$site]: site
    })
    expect(site[$forward]).not.toBeUndefined()
  })
})