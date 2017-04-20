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
      const _node = _.chain(node)
        .reject('disabled')
        .reject(({ value }) => _.isEmpty(value))
        .value()

      _.each(_node, (element, elementIdx) => setData(element, elementIdx + 1))
    } else {
      node.value && setData(node)
    }
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
      parentNode,
      tagName,
    } = element

    const {
      type: dataType,
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
      _.set(data, propName, value)
    }

    if (_.includes(['number', 'range'], elementType)) {
      _.set(data, propName, step
        ? _.round(value, _.chain(step).split('.').last().size())
        : _.toNumber(value)
      )
    }

    if (_.includes(['radio'], elementType) && checked) {
      _.set(data, name, value)
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
      _.set(data, parentName, parentDataset.type
        ? convert({ to: parentDataset.type, value: parentValue })
        : parentValue
      )
    }

    if (elementTypeIsSelect && allowMultiple) {
      const _value = []
      _.each(selectedOptions, option => {
        _value.push(convert({ to: parentDataset.type, value: option.value }))
      })
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
    array() { return value.join(separator) },
  }

  return dataType[to](value)
}

export default lfc
