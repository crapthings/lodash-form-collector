# lodash-form-collector

[![NPM](https://nodei.co/npm/lodash-form-collector.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/lodash-form-collector/)

[demo](https://meteor-njccsympez.now.sh/)

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

## changelog

#### 0.0.4

> if you don't specify 'data-type' on input[type='checkbox'], the default data-type is set to 'boolean'. this change allow you to collect value as 'true' or 'false' as default.

[HTML: Checkbox default value ](https://stackoverflow.com/questions/12911787/html-checkbox-default-value)

```
### >= 0.0.4
<input type='checkbox' name='isEnabled' checked />
{ isEnable: true }
<input type='checkbox' name='isEnabled' />
{ isEnable: false }

### < 0.0.4
<input type='checkbox' name='isEnabled' checked />
{ isEnable: 'on' }
<input type='checkbox' name='isEnabled' />
{}
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
  <input type="text" name="profile.address.city" value="harbin" />
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
    address: {
      city: 'harbin'
    },
    age: 32,
    gender: 'male'
  },
  array: ['string1', 'string2'],
  sameName: ['text with same name', 'will be collect as array']
}
```

### single checkbox with unique name
------

> if there's a single checkbox that you want to use String as value, just write your input as normal.
when it has checked, the value will present at the form result, when unchecked it won't present at result.

> if there's a single checkbox that you want to use as Boolean, give your input an data attr data-type="boolean",
checked = true, unchecked will collect as false.

#### html

```html
<form id="form">
  <input type="checkbox" name="useValue" value="check me" checked />
  <input type="checkbox" name="bypassUnchecked" value="will not collect me" />
  <input type="checkbox" name="unchecked" data-type="boolean" />
  <input type="checkbox" name="deep.checked" data-type="boolean" checked />
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

### multiple form controls with same name
------

> if there're multiple inputs like text that have same name.
it will be collecting as array, when no values are given, it gives an empty array [].

> if there're multiple checkboxes that you want to use String as value. just write your input as normal.
when it has checked, the value will present at the form result.
when all inputs unchecked it will be an empty array [].

#### html

```html
<form id="form">
  <input type="text" name="emptyArray" />
  <input type="text" name="emptyArray" />
  <input type="email" name="emails" value="crapthings@gmail.com" />
  <input type="email" name="emails" value="crapthings@163.com" />
  <input type="checkbox" name="checkbox" value="a" checked />
  <input type="checkbox" name="checkbox" value="b" checked />
  <input type="checkbox" name="checkbox" value="c" />
  <input type="submit" />
</form>
```

#### result

```js
{
  emptyArray: [],
  emails: ['crapthings@gmail.com', 'crapthings@163.com'],
  checkbox: ['a', 'b'],
}
```

### data type conversion
------

> you can turn string to number or array by using data-type="number || array || [number]".
text, textarea, search, hidden, select are supported.

> [string separator]: text. search, hidden, options of select is ',' and textarea is '\n' by default,
you can use optional by data-separator="separator".

#### html

```html
<form id="form">
  <input type="text" name="textString" value="100" />
  <input type="text" name="textStringToNumber" value="100" data-type="number" />
  <input type="text" name="textStringToArray" value="100, 200, 300, 400, 500" data-type="array" />
  <input type="text" name="textStringItemOfArrayToNumber" value="100, 200, 300, 400, 500" data-type="[number]" />
  <input type="text" name="textStringItemOfArrayToNumberBySpace" value="100 200 300 400 500" data-type="[number]" data-separator=" " />
  <input type="hidden" name="hiddenString" value="100" />
  <input type="hidden" name="hiddenStringToNumber" value="100" data-type="number" />
  <input type="hidden" name="hiddenStringToArray" value="100, 200, 300, 400, 500" data-type="array" />
  <input type="hidden" name="hiddenStringItemOfArrayToNumber" value="100, 200, 300, 400, 500" data-type="[number]" />
  <input type="submit" />
</form>
```

#### result

```js
{
  "textString": "100",
  "textStringToNumber": 100,
  "textStringToArray": ["100", "200", "300", "400", "500" ],
  "textStringItemOfArrayToNumber": [100, 200, 300, 400, 500],
  "textStringItemOfArrayToNumberBySpace": [100, 200, 300, 400, 500],
  "hiddenString": "100",
  "hiddenStringToNumber": 100,
  "hiddenStringToArray": ["100", "200", "300", "400", "500"],
  "hiddenStringItemOfArrayToNumber": [100, 200, 300, 400, 500]
}
```

## TODOS

- [ ] add feature data-type='object || [object]' ?
- [ ] file to base64

## FAQ

## alternative

[form2js](https://github.com/maxatwork/form2js)

[jQuery Serialize Object](https://github.com/macek/jquery-serialize-object)

## might be useful

[dot-object](https://github.com/rhalff/dot-object)

[object-path](https://github.com/mariocasciaro/object-path)
