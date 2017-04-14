import React from 'react'
import { render } from 'react-dom'

import form2obj from './form2obj'

import jsonpatch from 'fast-json-patch'

let template = {}

const onSubmit = evt => {
  evt.preventDefault()
  const data = form2obj(evt.currentTarget)
  console.log(JSON.stringify(data, null, 2))
  // const test = jsonpatch.compare(template, data)
  // template = data
  // console.log(JSON.stringify(data, null, 2))
  // console.log(JSON.stringify(test, null, 2))
  // console.log(+Date.now(), test.length)
}

const Form = () => <form id="form" onSubmit={onSubmit}>
  <div>
    <label htmlFor="">
    <div>text: String</div>
      <textarea name="text" id="" cols="30" rows="10"></textarea>
    </label>
  </div>

  <div>
    <label htmlFor="">
    <div>name: String</div>
      <input type="text" name='name'  />
    </label>
  </div>

  <div>
    <label htmlFor="">
      <div>age: Number</div>
      <input type="number" name='age' />
    </label>
  </div>

  <div>
    <label htmlFor="">
      <div>deep.deep.testNumber: Number</div>
      <input type="number" name='deep.deep.testNumber' />
    </label>
  </div>

  <div>
    <label htmlFor="">
      <div>deep.deep.testString: String</div>
      <input type="text" name='deep.deep.testString' />
    </label>
  </div>

  <div>
    <label htmlFor="">
      <div>profile.gender: String</div>
      <input type="text" name='profile.gender' />
    </label>
  </div>

  <div>
    <label htmlFor="">
      <span>true: Boolean</span>
      <input type="checkbox" name='profile.booleanBox' value={'c'} data-boolean />
    </label>

    <label htmlFor="">
      <span>false: Boolean</span>
      <input type="checkbox" name='profile.booleanBox' value={'a'} data-boolean />
    </label>
  </div>

  <div>
    <label htmlFor="">
      <span>a: Boolean</span>
      <input type="checkbox" name='profile.stringBox' value={'a'} />
    </label>

    <label htmlFor="">
      <span>b: Boolean</span>
      <input type="checkbox" name='profile.stringBox' value={'b'} />
    </label>

    <label htmlFor="">
      <span>c: Boolean</span>
      <input type="checkbox" name='profile.stringBox' value={'c'} />
    </label>
  </div>

  <div>
    <label htmlFor="">
      <span>a: String</span>
      <input type="radio" name='profile.stringRadio' value={'a'} />
    </label>

    <label htmlFor="">
      <span>b: String</span>
      <input type="radio" name='profile.stringRadio' value={'b'} />
    </label>

    <label htmlFor="">
      <span>c: String</span>
      <input type="radio" name='profile.stringRadio' value={'c'} />
    </label>
  </div>

  <div>
    <input type="hidden" name='secret' value='hide value' />
  </div>

  <div>
    <input type="submit" />
    <input type="reset" onClick={() => template = {}} />
  </div>
</form>

Meteor.startup(function () {
  const App = document.createElement('div')
  render(<Form />, App)
  document.body.appendChild(App)
})
