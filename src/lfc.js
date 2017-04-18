import _ from 'lodash'

const lfc = (form, options) => {

  const { elements } = form

  const allProperties = _.chain(elements)
    .map('name')
    .compact()
    .uniq()
    .value()

  const _elements = _.pick(elements, allProperties)

  const data = {}

  _.each(_elements, (node, propName) => {
    if (_.isArrayLikeObject(node)) {
      _.each(node, (element, idx) => setData(element, idx + 1))
    } else {
      setData(node)
    }
  })

  function setData(element, elementIdx) {

    // console.dir(element)

    const {
      name,
      type,
      value,
      checked,
      disabled,
      multiple,
      step,
      dataset,
      tagName,
      parentNode,
    } = element

    const {
      number,
    } = dataset

    const parentNodeAllowMultiple = parentNode.multiple

    if (disabled) return

    const fieldName = elementIdx ? `${name}[${elementIdx - 1}]` : name

    if (_.includes([
      'text',
      'password',
      'textarea',
      'email',
      'url',
      'tel',
      'hidden',
      'color',
      'month',
      'week',
      'time',
    ], type)) {
      value && _.set(data, fieldName, _.trim(value))
    }

    if (_.includes(['number', 'range'], type)) {
      const { step } = element
      const decimal = step ? step.split('.')[1].length : 0
      value && _.set(data, fieldName, step
        ? _.round(value, decimal)
        : parseInt(value)
      )
    }

    if (_.includes(['radio'], type) && checked) {
      value && _.set(data, name, value)
    }

    if (_.includes(['checkbox'], type) && !elementIdx) {
      _.get(dataset, 'boolean')
        ? _.set(data, name, checked ? true : false)
        : (checked && _.set(data, name, value))
    }

    if (_.includes(['checkbox'], type) && elementIdx) {
      const existValues = _.get(data, name)
      if (_.get(dataset, 'boolean')) {
        _.set(data, name, checked
          ? (existValues ? _.concat(existValues, true) : [true])
          : (existValues ? _.concat(existValues, false) : [false])
        )
      } else {
        checked && _.set(data, name, existValues
          ? _.concat(existValues, value)
          : [value]
        )
      }
    }

    if (_.includes(['date', 'datetime-local'], type)) {
      const { string } = dataset
      value && _.set(data, fieldName, string
        ? new Date(value).toISOString()
        : new Date(value)
      )
    }

    if ((tagName === 'OPTION' && parentNode.tagName === 'SELECT') && !parentNodeAllowMultiple) {
      const to = parentNode.dataset.type
      const _name = parentNode.name
      const _value = parentNode.value
      _value && _.set(data, _name, to ? convert({ to, value }) : _.trim(value))
    }

    if ((tagName === 'OPTION' && parentNode.tagName === 'SELECT') && parentNodeAllowMultiple) {
      const _value = []

      _.each(parentNode.selectedOptions, option => {
        _value.push(convert({ to: parentNode.dataset.type, value: option.value }))
      })

      _.set(data, parentNode.name, _value)
    }

  }

  return data

}

function convert({ to, value, decimal, separator = ',' }) {

  const type = {
    number() { return _.round(value, decimal) },
    string() { return _.trim(value) },
    array() { return value.join(separator) }
  }

  return type[to](value)
}

export default lfc
