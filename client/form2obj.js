import _ from 'lodash'

import { object } from 'dot-object'

const form2obj = (form, options) => {
  const { elements } = form

  const allProperties = _.chain(elements)
    .map('name')
    .compact()
    .uniq()
    .value()

  const _elements = _.pick(elements, allProperties)

  const test = {}

  _.each(_elements, (element, propName) => {
    if (_.isArrayLikeObject(element)) {
      _.each(element, ({ value }, idx) => value && _.set(test, `${propName}[${idx}]`, value))
    } else {
      const { name, type, value } = element

      if (_.includes(['text'], type)) {
        element.value && _.set(test, `${propName}`, element.value)
      }

      if (_.includes(['number'], type)) {
        element.value && _.set(test, `${propName}`, parseInt(element.value))
      }
    }
  })

  console.log(test)

}

function checkElementType(element) {

}

export default form2obj
