# lodash-form-collector

## installation

> npm i -S lodash-form-collector

#### import

```js
import lfc from 'lodash-form-collector'
const lfc = require('lodash-form-collector')
```

## usage

### basic collecting

#### html

```html
<form id="form">
  <input type="text" name="username" />
  <input type="password" name="password" />
  <input type="submit" />
</form>
```

#### js

```js
const form = document.getElementById('form')
const data = lfc(form)
console.log(data)
```
