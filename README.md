# lodash-form-collector

[![NPM](https://nodei.co/npm/lodash-form-collector.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/lodash-form-collector/)

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

> Sets the value at path of object. If a portion of path doesn't exist, it's created.
> Arrays are created for missing index properties while objects are created for all other missing properties.

#### html

```html
<form id="form">
  <input type="text" name="something" value="anything" />
  <input type="text" name="profile.displayName" value="crapthings" />
  <input type="number" name="profile.age" value="32" />
  <input type="radio" name="profile.gender" value="male" checked />
  <input type="radio" name="profile.gender" value="female" />
  <input type="text" name="array[0]" value="string1" />
  <input type="text" name="array[1]" value="string2" />
  <input type="text" name="sameName" value="text with same name" />
  <input type="text" name="sameName" value="will be collect as array" />
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
  },
  array: ['string1', 'string2'],
  sameName: ['text with same name', 'will be collect as array']
}
```

### single checkbox
------

#### html

```html
<form id="form">
  <input type="checkbox" name="useValue" value="check me" checked />
  <input type="checkbox" name="bypassUnchecked" value="will not collect me" />
  <input type="checkbox" name="unchecked" data-boolean />
  <input type="checkbox" name="deep.checked" data-boolean checked />
  <input type="submit" />
</form>
```

#### result

```js
{
  useValue: 'check me',
  unchecked: false,
  deep: {
    checked: true
  }
}
```

## FAQ

## alternative

[form2js](https://github.com/maxatwork/form2js)

## might be useful

[dot-object](https://github.com/rhalff/dot-object)

[object-path](https://github.com/mariocasciaro/object-path)
