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
      _.each(node, (element, idx) => setValue(element, idx + 1))
    } else {
      setValue(node)
    }
  })

  console.log(JSON.stringify(test, null, 4))

  function setValue(element, elementIdx) {

    const { name, type, value, checked } = element

    const fieldName = elementIdx ? `${name}[${elementIdx - 1}]` : name

    console.log(fieldName)

    if (_.includes(['text', 'textarea', 'email', 'url', 'search', 'hidden'], type)) {
      value && _.set(test, fieldName, _.trim(value))
    }

    if (_.includes(['number'], type)) {
      value && _.set(test, fieldName, parseInt(value))
    }

    if (_.includes(['radio'], type) && checked) {
      value && _.set(test, name, value)
    }

    if (_.includes(['checkbox'], type)) {
      if (checked) {
        const existValues = _.defaultTo(_.get(test, name), [])
        value && _.set(test, name, _.concat(existValues, value))
      }
    }

  }

  return test

}

export default form2obj
