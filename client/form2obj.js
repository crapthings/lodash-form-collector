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

  function setValue(element, elementIdx) {

    const { name, type, value, checked, dataset } = element

    const fieldName = elementIdx ? `${name}[${elementIdx - 1}]` : name

    if (_.includes(['text', 'textarea', 'email', 'url', 'search', 'hidden'], type)) {
      value && _.set(test, fieldName, _.trim(value))
    }

    if (_.includes(['number'], type)) {
      value && _.set(test, fieldName, parseInt(value))
    }

    if (_.includes(['radio'], type) && checked) {
      value && _.set(test, name, value)
    }

    if (_.includes(['checkbox'], type) && !elementIdx) {
      _.get(dataset, 'boolean')
        ? _.set(test, name, checked ? true : false)
        : (checked && _.set(test, name, value))
    }

    if (_.includes(['checkbox'], type) && elementIdx) {
      const existValues = _.get(test, name)
      if (_.get(dataset, 'boolean')) {
        _.set(test, name, checked
          ? (existValues ? _.concat(existValues, true) : [true])
          : (existValues ? _.concat(existValues, false) : [false])
        )
      } else {
        checked && _.set(test, name, existValues
          ? _.concat(existValues, value)
          : [value]
        )
      }
    }

  }

  return test

}

export default form2obj
