# lodash-form-collector

## installation

> npm i -S lodash-form-collector

#### import

```js
import lfc from 'lodash-form-collector'
const lfc = require('lodash-form-collector')
```

## usage

```js
const form = document.getElementById('form')
const data = lfc(form)
console.log(data)
```

### basic collecting
------

#### html

```html
<form id="form">
  <input type="text" name="username" value='crapthings' />
  <input type="password" name="password" value='secret' />
  <input type="submit" />
</form>
```

#### result

```js
{
  username: 'crapthings',
  password: 'secret'
}
```

### collect nested field
------

#### html

```html
<form id="form">
  <input type="text" name="something" value="anything" />
  <input type="text" name="profile.displayName" value="crapthings" />
  <input type="number" name="profile.age" value="32" />
  <input type="radio" name="profile.gender" value="male" checked />
  <input type="radio" name="profile.gender" value="female" />
  <input type="submit" />
</form>
```

#### result

```js
{
  something: 'anything',
  profile: {
    displayName: 'crapthings',
    age: 32,
    gender: 'male'
  }
}
