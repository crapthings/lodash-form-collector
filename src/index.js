import _ from 'lodash'

const lfc = (form, options) => {

  const { elements, tagName: FORM } = form

  if (FORM !== 'FORM')
    throw new Error('first argument should be a form element')

  const properties = _.chain(elements)
    .map('name')
    .compact()
    .uniq()
    .value()

  const nodes = _.pick(elements, properties)

  const data = _.stubObject()

  _.each(nodes, node => {
    _.isArrayLikeObject(node)
      ? _.each(node, trimValue)
      : trimValue(node)
  })

  _.each(nodes, (node, nodeName) => {
    if (_.isArrayLikeObject(node)) {
      _.each(node, setValue)
    } else {
      setValue(node)
    }
  })

  function setValue(element, elementIdx) {

    const hasMany = elementIdx >= 0

    const {
      type: elementType,
      name,
      value,
      checked,
      multiple,
      disabled,
      step,
      dataset,
      parentNode,
      tagName,
    } = element

    const {
      type: dataType,
      separator,
      unique,
      skip,
    } = dataset

    const {
      name: parentName,
      value: parentValue,
      multiple: allowMultiple,
      tagName: parentTagName,
      dataset: parentDataset,
      selectedOptions,
    } = parentNode

    const elementTypeIsSelect = (tagName === 'OPTION' && parentTagName === 'SELECT')

    if (
      hasMany
      && !_.get(data, name || parentName)
      && elementType !== 'radio'
      && parentTagName !== 'SELECT'
    ) {
      _.set(data, name || parentName, [])
    }

    if ((hasMany && value === "") || disabled || skip) {
      return
    }

    if (_.includes([
      'hidden',
      'text',
      'search',
      'textarea',
    ], elementType)) {
      let _value = dataType
        ? convert({ to: dataType, value, elementType })
        : value

      if (unique) {
        _value = _.uniq(_value)
      }

      hasMany
        ? _.set(data, name, _.concat(_.get(data, name, []), _value))
        : _value && _.set(data, name, _value)
    }

    if (_.includes([
      'tel',
      'url',
      'email',
      'password',
      'time',
      'color',

      'month',
      'week',
    ], elementType)) {
      hasMany
        ? _.set(data, name, _.concat(_.get(data, name, []), value))
        : value && _.set(data, name, value)
    }

    if (_.includes(['number', 'range'], elementType)) {
      _.set(data, name, step
        ? _.round(value, _.chain(step).split('.').last().size())
        : _.toNumber(value)
      )
    }

    if (_.includes(['radio'], elementType) && checked) {
      _.eq(dataType, 'boolean')
        ? _.set(data, name, value === 'true' ? true : false)
        : _.set(data, name, dataType
            ? convert({ to: dataType, value})
            : value
          )
    }

    if (_.includes(['checkbox'], elementType) && !hasMany) {
      _.eq(dataType, 'boolean')
        ? _.set(data, name, checked ? true : false)
        : (checked && _.set(data, name, dataType
            ? convert({ to: dataType, value})
            : value)
          )
    }

    if (_.includes(['checkbox'], elementType) && hasMany) {
      const existValues = _.get(data, name, [])
      _.eq(dataType, 'boolean')
        ? _.set(data, name, _.concat(existValues, checked ? true : false))
        : checked && _.set(data, name, _.concat(existValues, dataType
            ? convert({ to: dataType, value})
            : value
          ))
    }

    if (_.includes(['date', 'datetime-local'], elementType)) {
      _.set(data, name, _.eq(dataType, 'string')
        ? new Date(value).toISOString()
        : new Date(value)
      )
    }

    if (
      elementTypeIsSelect
      && parentValue
      && !allowMultiple
    ) {
      const _type = dataType || parentDataset.type
      _.set(data, parentName, _type
        ? convert({ to: _type, value: parentValue, elementType: 'text' })
        : parentValue
      )
    }

    if (
      elementTypeIsSelect
      && allowMultiple
    ) {
      let _values = []

      _.each(selectedOptions, option => {
        _values.push(convert({ to: parentDataset.type, value: option.value, elementType: 'text' }))
      })

      if (parentDataset.flatten) {
        _values = _.flatten(_values)
      }

      if (parentDataset.unique) {
        _values = _.chain(_values).flatten().uniq().value()
      }

      _.set(data, parentNode.name, _values)
    }

  }

  return data

}

function trimValue(element) {
  element.value = _.trim(element.value)
}

function convert({
  to,
  value,
  decimal,
  separator,
  elementType,
}) {

  const _separator = {
    text: ',',
    textarea: '\n',
  }

  const dataType = {
    string() { return value },

    number() { return _.round(value, decimal) },

    array() {
      return _.chain(value)
        .split(separator || _separator[elementType])
        .compact()
        .map(_.trim)
        .value()
    },

    "[number]"() {
      return _.chain(value)
        .split(separator || _separator[elementType])
        .map(item => _.round(item, decimal))
        .value()
    }
  }

  return dataType[to](value)

}

export default lfc
