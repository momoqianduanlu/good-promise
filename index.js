const MyPromise = require('./promise2')

// const promise = new MyPromise((resolve, reject) => {
//   // resolve('success')
//   // throw new Error('Exception: Error')

//   setTimeout(() => {
//     resolve('success')
//   }, 3000)
// })

// promise.then(
//   res => {
//     console.log('res1', res)
//   },
//   err => {
//     console.log('err1', err)
//   }
// )

// promise.then(
//   res => {
//     console.log('res2', res)
//   },
//   err => {
//     console.log('err2', err)
//   }
// )

let promise1 = new MyPromise((resolve, reject) => {
  resolve('promise1')
})

let promise2 = promise1
  .then(res => {
    return res + '...😶😶😶'
  })
  .then(res => {
    console.log(res)
  })
