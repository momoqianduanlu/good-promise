const MyPromise = require('./promise3')

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

/**
 * feature1 处理promise引用同一个引用
 */
// let promise1 = new Promise((resolve, reject) => {
//   resolve('promise1')
// })
// let promise2 = promise1.then(
//   res => {
//     return promise2
//   },
//   err => {
//     return err
//   }
// )
// promise2.then(
//   res => {
//     console.log(res)
//   },
//   err => {
//     console.log(err)
//   }
// )

/**
 * feature4 处理promise多层嵌套
 */
// let promise1 = new MyPromise((resolve, reject) => {
//   resolve('promise1')
// })
// let promise2 = promise1.then(
//   res => {
//     return new MyPromise((resolve, reject) => {
//       // resolve('promise1')
//       setTimeout(() => {
//         // resolve('promise1')
//         resolve(
//           new MyPromise((resolve, reject) => {
//             resolve('promise1')
//           })
//         )
//       }, 2000)
//     })
//   },
//   err => {
//     return err
//   }
// )
// promise2.then(
//   res => {
//     console.log(res)
//   },
//   err => {
//     console.log(err)
//   }
// )

/**
 * feature5 处理promise.then()不传递任何参数
 */
// let promise1 = new MyPromise((resolve, reject) => {
//   resolve('promise1')
// })
// let promise2 = promise1.then(
//   res => {
//     return new MyPromise((resolve, reject) => {
//       setTimeout(() => {
//         resolve(
//           new MyPromise((resolve, reject) => {
//             resolve('promise1')
//           })
//         )
//       }, 2000)
//     })
//   },
//   err => {
//     return err
//   }
// )
// promise2
//   .then()
//   .then()
//   .then(
//     res => {
//       console.log(res)
//     },
//     err => {
//       console.log(err)
//     }
//   )

/**
 * feature6 处理promise.catch()
 */
let promise1 = new MyPromise((resolve, reject) => {
  resolve('promise1')
})
let promise2 = promise1.then(
  res => {
    return new MyPromise((resolve, reject) => {
      setTimeout(() => {
        resolve(
          new MyPromise((resolve, reject) => {
            resolve('promise1')
          })
        )
      }, 2000)
    })
  },
  err => {
    return err
  }
)
promise2
  .then()
  .then()
  .then(
    res => {
      throw new Error('aaaaaaa')
    },
    err => {
      console.log(err)
    }
  )
  .catch(err => {
    console.log(err)
  })
