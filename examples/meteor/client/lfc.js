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
      _.each(node, (element, elementIdx) => setData(element, elementIdx + 1))
    } else {
      setData(node)
    }
  })

  function setData(element, elementIdx) {

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
    } = dataset

    const {
      name: parentName,
      value: parentValue,
      multiple: allowMultiple,
      tagName: parentTagName,
      dataset: parentDataset,
      selectedOptions,
    } = parentNode

    const propName = elementIdx ? `${name || parentName}[${elementIdx - 1}]` : name

    const elementTypeIsSelect = (tagName === 'OPTION' && parentTagName === 'SELECT')

    if (
      elementIdx
      && !_.get(data, name || parentName)
      && elementType !== 'radio'
      && parentTagName !== 'SELECT'
    ) {
      _.set(data, name || parentName, [])
    }

    if ((elementIdx && value === '') || disabled) {
      return
    }

    if (_.includes([
      'text',
      'textarea',
      'search',
      'hidden',
    ], elementType)) {
      const _separator = {
        text: separator || ',',
        textarea: separator || '\n',
      }

      let _value = dataType
        ? convert({ to: dataType, value, separator: _.get(_separator, elementType) })
        : value

      if (unique) {
        _value = _.uniq(_value)
      }

      elementIdx
        ? data[name || parentName] = _.concat(data[name || parentName], _value)
        : _.set(data, propName, _value)
    }

    if (_.includes([
      'password',
      'email',
      'url',
      'tel',
      'color',
      'month',
      'week',
      'time',
    ], elementType)) {
      _.set(data, propName, value)
    }

    if (_.includes(['number', 'range'], elementType)) {
      _.set(data, propName, step
        ? _.round(value, _.chain(step).split('.').last().size())
        : _.toNumber(value)
      )
    }

    if (_.includes(['radio'], elementType) && checked) {
      _.eq(dataType, 'boolean')
        ? _.set(data, name, value === "true" ? true : false)
        : (checked && _.set(data, name, value))
    }

    if (_.includes(['checkbox'], elementType) && !elementIdx) {
      _.eq(dataType, 'boolean')
        ? _.set(data, name, checked ? true : false)
        : (checked && _.set(data, name, value))
    }

    if (_.includes(['checkbox'], elementType) && elementIdx) {
      const existValues = _.get(data, name, [])
      if (_.eq(dataType, 'boolean')) {
        _.set(data, name, _.concat(existValues, checked ? true : false))
      } else {
        checked && _.set(data, name, _.concat(existValues, value))
      }
    }

    if (_.includes(['date', 'datetime-local'], elementType)) {
      _.set(data, propName, _.eq(dataType, 'string')
        ? new Date(value).toISOString()
        : new Date(value)
      )
    }

    if (elementTypeIsSelect && parentValue && !allowMultiple) {
      const _type = dataType || parentDataset.type
      _.set(data, parentName, _type
        ? convert({ to: _type, value: parentValue })
        : parentValue
      )
    }

    if (elementTypeIsSelect && allowMultiple) {
      let _value = []

      _.each(selectedOptions, option => {
        _value.push(convert({ to: parentDataset.type, value: option.value }))
      })

      if (parentDataset.flatten) {
        _value = _.flatten(_value)
      }

      if (parentDataset.unique) {
        _value = _.chain(_value).flatten().uniq().value()
      }

      _.set(data, parentNode.name, _value)
    }

  }

  return data

}

function trimValue(element) {
  element.value = _.trim(element.value)
}

function convert({ to, value, decimal, separator = ',' }) {

  const dataType = {
    string() { return value },

    number() { return _.round(value, decimal) },

    array() {
      return _.chain(value)
        .split(separator)
        .compact()
        .map(_.trim)
        .value()
    },

    "[number]"() {
      return _.chain(value)
        .split(separator)
        .map(item => _.round(item, decimal))
        .value()
    }
  }

  return dataType[to](value)
}

export default lfc
