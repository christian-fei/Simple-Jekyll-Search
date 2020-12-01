const test = require('ava')

const OptionsValidator = require('../src/OptionsValidator.js')

test('can be instanciated with options', t => {
  const requiredOptions = ['foo', 'bar']
  const optionsValidator = new OptionsValidator({
    required: requiredOptions
  })

  t.deepEqual(optionsValidator.getRequiredOptions(), requiredOptions)
})

test('returns empty errors array for valid options', t => {
  const requiredOptions = ['foo', 'bar']
  const optionsValidator = new OptionsValidator({
    required: requiredOptions
  })

  const errors = optionsValidator.validate({
    foo: '',
    bar: ''
  })

  t.is(errors.length, 0)
})
test('returns array with errors for invalid options', t => {
  const requiredOptions = ['foo', 'bar']
  const optionsValidator = new OptionsValidator({
    required: requiredOptions
  })

  const errors = optionsValidator.validate({
    foo: ''
  })

  t.is(errors.length, 1)
})
