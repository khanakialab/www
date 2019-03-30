const Www = require('./index.js')({
    port: 9001
})

Hook.Action.add('Www/GlobalMiddleware', function(req, res, next) {
    console.log('Middleware')
    next()
})
Www.start();