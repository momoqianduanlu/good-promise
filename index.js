const MyPromise = require('./promise')

const promise = new MyPromise((resolve, reject) => {
  // resolve('success')
  throw new Error('Exception: Error')
})

promise.then(
  res => {
    console.log('res', res)
  },
  err => {
    console.log('err', err)
  }
)
