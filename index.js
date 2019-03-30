var express = require('express');
var router = express.Router()
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// var compression = require('compression');
var cors = require('cors');
var path = require('path');
// Dependencies
const fs = require('fs');
const http = require('http');
// const https = require('https');

class Www {
    constructor(config={}) {
        // Object.assign(this, {
        // }, args);

        if (typeof(Hook) == 'undefined') global.Hook = require('@knesk/hook')()

        const _config = require('./config')
        this.config = Object.assign({}, _config, config||{});
        this._config = _config
        
        this.router = express.Router()
        let app = express();
        
        app.set('views', this.config.dirView);
        app.set('view engine', this.config.templateEngine);

        
        app.use(morgan('dev'));
        app.use(bodyParser.json({limit: '10mb', extended: true}));
        app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
        app.use(cookieParser());
        app.use(cors())

        app.use(async (req, res, next) => {
            await Hook.Filter.apply('Www/GlobalMiddleware', req, res, next)

            await Hook.Action.do('Www/GlobalMiddleware', req, res, next)
            if(!res.headersSent) {
                next()
            }
        })

        app.get('/ping', (req, res) => res.send('ok'))
        
        // app.use('/', express.static(this.config.dirPublic));
        // app.use('/uploads', express.static(this.config.dirUploadsPublic));


        if(this.config.enableCompression) {
		    var compression = require('compression')
		    app.use(compression())
		}

		if(this.config.enableHelmet) {
		    var helmet = require('helmet')
		    app.use(helmet())    
		}

		if(this.config.enableCsp) {
		    var csp = require('helmet-csp')
		    app.use(csp(this.config.csp || {}))
        }
    
        this.app = app
    }

    async init() {
        // Don't Init any routes in this Action this is only to add Top Level Middlewares
        await Hook.Action.do('Www/InitMiddleware')

        await Hook.Action.do('Www/Init')
        await this.start()
        console.debug('WWW Init')
    }

    start() {
    	this.app.listen(this.config.port || 80, (err) => {
            if (err) {
                console.error(err)
                return
            }
            console.log(`HTTP - Express Server is now running on localhost:${this.config.port || 80}`)
        })

                 
        if(this.config.enableHttps) {
            // Certificate
            const privateKey = fs.readFileSync(this.config.privateKey, 'utf8');
            const certificate = fs.readFileSync(this.config.certificate, 'utf8');
            const ca = fs.readFileSync(this.config.ca, 'utf8');
            
            const credentials = {
            	key: privateKey,
            	cert: certificate,
            	ca: ca
            };


            const httpsServer = https.createServer(credentials, this.app);
            
            httpsServer.listen(this.config.portHttps || 443, () => {
            	console.log(`HTTPS - Express Server is now running on localhost:${this.config.portHttps || 443}`)
            });

            this.app.get('*', function(req, res) {  
		        res.redirect('https://' + req.headers.host + req.url);
		    })
            
        }
    }


    listRoutes() {
        function print(path, layer) {
            if (layer.route) {
                layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))))
            } else if (layer.name === 'router' && layer.handle.stack) {
                layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))))
            } else if (layer.method) {
                console.log('%s /%s',
                    layer.method.toUpperCase(),
                    path.concat(split(layer.regexp)).filter(Boolean).join('/'))
            }
        }
        
        function split(thing) {
            if (typeof thing === 'string') {
                return thing.split('/')
            } else if (thing.fast_slash) {
                return ''
            } else {
                var match = thing.toString()
                    .replace('\\/?', '')
                    .replace('(?=\\/|$)', '$')
                    .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
                return match ?
                    match[1].replace(/\\(.)/g, '$1').split('/') :
                    '<complex:' + thing.toString() + '>'
            }
        }
        
        this.app._router.stack.forEach(print.bind(null, []))
    }

    listRoutes1() {
        var route, routes = [];
        this.app._router.stack.forEach(function(middleware){
            if(middleware.route){ // routes registered directly on the app
                routes.push(middleware.route);
            } else if(middleware.name === 'router'){ // router middleware 
                middleware.handle.stack.forEach(function(handler){
                    route = handler.route;
                    route && routes.push(route);
                });
            }
        });

        console.log(routes);
    }


}

// module.exports = WWW

module.exports = (config) => new Www(config)