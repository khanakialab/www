var path = require('path');

module.exports = {
    port: 5001,
    portHttps: 443, 
    enableHttps: false,
    privateKey: '/etc/letsencrypt/live/app.mobilegoo.in/privkey.pem',
    certificate: '/etc/letsencrypt/live/app.mobilegoo.in/cert.pem',
    ca: '/etc/letsencrypt/live/app.mobilegoo.in/chain.pem',
    dirView: path.join(__dirname, '../../../../views'),
    dirUploads: path.join(__dirname, '../../../uploads'),
    dirUploadsPublic: path.join(__dirname, '../../../../../uploads/public'),
    dirPublic: path.join(__dirname, '../../../../../public'),
    templateEngine: 'ejs',
    enableCompression: false,
    enableHelmet: false,
    enableCsp: false,
    csp: {
      // Specify directives as normal.
      directives: {
        frameSrc: ["*"],
        defaultSrc: ["'self'", 'tx.theuxm.com api.theuxm.com'],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://www.googletagmanager.com https://www.googleadservices.com https://googleads.g.doubleclick.net"],
        styleSrc: ["'unsafe-inline'"],
        fontSrc: ['*'],
        imgSrc: ['*', 'data:'],
        // sandbox: ['allow-forms', 'allow-scripts'],
        // reportUri: '/report-violation',
        objectSrc: ["'none'"],
        baseUri: ["'none'"],
        formAction:["'self'"],
        frameAncestors: ["'self'"],
        objectSrc: ["'self'"],
        upgradeInsecureRequests: true,
        workerSrc: false  // This is not set.
      },
    
      // This module will detect common mistakes in your directives and throw errors
      // if it finds any. To disable this, enable "loose mode".
      loose: false,
    
      // Set to true if you only want browsers to report errors, not block them.
      // You may also set this to a function(req, res) in order to decide dynamically
      // whether to use reportOnly mode, e.g., to allow for a dynamic kill switch.
      reportOnly: false,
    
      // Set to true if you want to blindly set all headers: Content-Security-Policy,
      // X-WebKit-CSP, and X-Content-Security-Policy.
      setAllHeaders: false,
    
      // Set to true if you want to disable CSP on Android where it can be buggy.
      disableAndroid: false,
    
      // Set to false if you want to completely disable any user-agent sniffing.
      // This may make the headers less compatible but it will be much faster.
      // This defaults to `true`.
      browserSniff: true
    }
}