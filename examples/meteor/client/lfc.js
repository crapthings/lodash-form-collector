import _ from 'lodash'

const lfc = (form, options) => {

  const { elements } = form

  const properties = _.chain(elements)
    .map('name')
    .compact()
    .uniq()
    .value()

  const nodes = _.pick(elements, properties)

  const data = {}

  _.each(nodes, node => {
    _.isArrayLikeObject(node)
      ? _.each(node, (element, elementIdx) => setData(element, elementIdx + 1))
      : setData(node)
  })

  function setData(element, elementIdx) {

    const {
      type: elementType,
      name,
      value,
      checked,
      multiple,
      step,
      dataset,
      disabled,
      parentNode,
      tagName,
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
    ], elementType)) {
      value && _.set(data, fieldName, _.trim(value))
    }

    if (_.includes(['number', 'range'], elementType)) {
      const { step } = element
      const decimal = step ? step.split('.')[1].length : 0
      value && _.set(data, fieldName, step
        ? _.round(value, decimal)
        : parseInt(value)
      )
    }

    if (_.includes(['radio'], elementType) && checked) {
      value && _.set(data, name, value)
    }

    if (_.includes(['checkbox'], elementType) && !elementIdx) {
      _.get(dataset, 'boolean')
        ? _.set(data, name, checked ? true : false)
        : (checked && _.set(data, name, value))
    }

    if (_.includes(['checkbox'], elementType) && elementIdx) {
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

    if (_.includes(['date', 'datetime-local'], elementType)) {
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

  const dataType = {
    number() { return _.round(value, decimal) },
    string() { return _.trim(value) },
    array() { return value.join(separator) }
  }

  return dataType[to](value)
}

export default lfc
