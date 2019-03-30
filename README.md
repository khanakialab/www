# Knesk Www &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/jeoga/option/blob/master/LICENSE)

#### A Extended Http Server Node.js Module based on Express.js
Can be used as with any Node.js Framework or as standalone.

#### Examples
Check examples/ directory and simply run any example using **node example.js**

### How to Install
  ```javascript
npm install @knesk/www
or
yarn add @knesk/www
```

#### How to USE
```javascript
const Www = require('@knesk/www')({
    port: 9001
})
Www.start();
// output - the-product
```
**Note:** For all the available config parameters please check config.js file