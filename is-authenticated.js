module.exports = async (request, response) => {
    if (request.url.startsWith('/login.html')) {
        return
    }

    const authorization = request.headers.authorization ?? ''
    const [,token] = authorization.match(/Bearer (.*)/) || []




    response.writeHead(302, {
        location: `/login.html?${encodeURIComponent(request.url.substring(1))}`
    })
    response.end()
}