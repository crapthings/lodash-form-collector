import _ from 'lodash'

const form2obj = (form, options) => {
  const { elements } = form

  const allProperties = _.chain(elements)
    .map('name')
    .compact()
    .uniq()
    .value()

  const _elements = _.pick(elements, allProperties)

  const test = {}

  _.each(_elements, (node, propName) => {
    if (_.isArrayLikeObject(node)) {
      _.each(node, (element, idx) => setValue(element, idx))
    } else {
      setValue(node)
    }
  })

  console.log(test)

  function setValue(element, elementIdx) {

    const { name, type, value, checked } = element

    const fieldName = elementIdx ? `${name}[${elementIdx}]` : name

    if (_.includes(['text'], type)) {
      value && _.set(test, fieldName, value)
    }

    if (_.includes(['number'], type)) {
      value && _.set(test, fieldName, parseInt(value))
    }

    if (_.includes(['radio'], type) && checked) {
      value && _.set(test, name, value)
    }

  }

  return test

}

export default form2obj
