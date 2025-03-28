const userRoute = require('./user.router')
const adsRoute = require('./ads.router')

module.exports = (app) => {
    const api = '/api'
    app.use(api + '/admin', userRoute);
    app.use(api + '/ads', adsRoute);
}