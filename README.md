<h1 align="center">Welcome to jot 👋</h1>

<p>
  <a href="https://www.npmjs.com/package/jot" target="_blank">
    <img alt="Version" src="https://forthebadge.com/images/badges/built-with-science.svg">
  </a>
  <a href="https://www.npmjs.com/package/jot" target="_blank">
    <img alt="Version" src="https://forthebadge.com/images/badges/powered-by-electricity.svg">
  </a>
</p>
<p>
  <a href="https://www.npmjs.com/package/jot" target="_blank">
    <img alt="Version" src="https://img.shields.io/badge/contributions-welcome-orange.svg?style=flat-square">
  </a>
  <a href="https://github.com/55Cancri/jotsy#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=flat-square" />
  </a>
  <a href="https://github.com/55Cancri/jotsy/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=flat-square" />
  </a>
</p>

> Print cleaner, colorful logs to console.

### 🏠 [Homepage](https://github.com/55Cancri/jotsy#readme)

## Description

Clean, simple, logging utility. Jot adds color and minimalism to your logs and errors.

## Install

### NPM

```sh
npm i jotsy
```

### Yarn

```sh
yarn add jotsy
```

## Usage

Jot works out of the box.

```javascript
jot.log('Life is just an 80 or so year interruption from the void. --Nuziburt')
```

<div align="center">
  <img alt="Default Loggers" src="media/default.png" width="65%">
</div>

Change the text color.

```javascript
jot.log(
  'High self-awareness means that when you look in the mirror, you see yourself as you are—a flawed thinker with endless potential to learn. --Tim Urban',
  { textColor: 'springgreen' }
)
```

<div align="center">
  <img alt="Default Loggers" src="media/text-color.png" width="65%">
</div>

Or the timestamp color.

```javascript
jot.log(
  "Stay determined——not impatient nor discouraged——and with repeated trial and error, you're bound to reach a splendid outcome eventually. --Koro Sensei",
  { timestampColor: 'dodgerblue' }
)
```

<div align="center">
  <img alt="Default Loggers" src="media/time-color.png" width="65%">
</div>

Or no timestamp at all!

```javascript
jot.log(
  'I always knew that looking back on the tears would make me laugh. But I never knew looking back on the laughs would make me cry.  --The Office',
  { showTimestamp: false }
)
```

<div align="center">
  <img alt="Default Loggers" src="media/no-time.png" width="65%">
</div>

## Author

👤 **Eric Morrison**

- Github: [@55Cancri](https://github.com/55Cancri)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/55Cancri/jotsy/issues). You can also take a look at the [contributing guide](https://github.com/55Cancri/jotsy/blob/master/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2020 [Eric Morrison](https://github.com/55Cancri).<br />
This project is [MIT](https://github.com/55Cancri/jotsy/blob/master/LICENSE) licensed.

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
