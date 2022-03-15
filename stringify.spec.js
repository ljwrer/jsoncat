import { stringify } from './stringify.js'

const test = (val) => {
  expect(stringify(val)).toBe(JSON.stringify(val))
}

it('should support undefined', () => {
  test(undefined)
})

it('should support boolean', () => {
  test(true)
  test(false)
})

it('should support number', () => {
  test(0)
  test(-10)
  test(10)
})

it('should support string', () => {
  test('')
  test('hello')
  test('   x   ')
})

it('should support array', () => {
  test([])
  test([1, '2', true])
})

it('should support object', () => {
  test({})
  test({
    a: 1,
    b: true,
    c: 'hello',
    foo: {
      bar: {
        x: 1
      },
      y: 'world'
    }
  })
})

it('should support deep', () => {
  test({
    a: 1,
    b: true,
    c: 'hello',
    foo: {
      bar: {
        x: ['a', 'hello', 'msg']
      },
      y: 'world'
    }
  })
  test([
    {a:1},
    {
      a: 1,
      b: true,
      c: 'hello',
      foo: {
        bar: {
          x: ['a', 'hello', 'msg']
        },
        y: 'world'
      }
    },
    true
  ])
})

it('should support toJSON', () => {
  test({
    time: new Date()
  })
  test(new Date())
  class A{
    toJSON(){
      return 0
    }
  }
  test(new A())
  class B {
    toJSON(){
      return {
        a:1,
        b: [3,"4",true]
      }
    }
  }
  test(new B())
})
