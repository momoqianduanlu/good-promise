/**
 * promise.then链式调用的的几种场景
 */

const promise = new Promise((resolve, reject) => {
  resolve('resolve')
})

// 1. 通过return传递结果
promise
  .then(res => {
    return res
  })
  .then(res => {
    console.log('1.', res)
  })

// 2. 通过return一个promise来resolve结果
promise
  .then(res => {
    return res
  })
  .then(res => {
    return new Promise((resolve, reject) => {
      resolve(res)
    })
  })
  .then(res => {
    console.log('2.', res)
  })

// 3. 通过return一个promise来reject错误
promise
  .then(res => {
    return res
  })
  .then(res => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('ERROR')
      }, 3000)
    })
  })
  .then(
    res => {
      console.log('3.', res)
    },
    err => {
      console.log('3.', err) // rejected ERROR
    }
  )

// 4. then走了失败的回调函数以后再继续执行then函数，最后一个then会执行成功的回调，
promise
  .then(res => {
    return res
  })
  .then(res => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('ERROR')
      }, 3000)
    })
  })
  .then(
    res => {
      console.log('4.', res)
    },
    err => {
      console.log('4.', err) // rejected ERROR
      // 默认返回undefined
      // return 1
    }
  )
  .then(
    res => {
      console.log(res)
      console.log('4. fullfilled', res)
    },
    err => {
      console.log('4. rejected', err) // rejected undefined
    }
  )

// 5. then函数中throw一个error
promise
  .then(res => {
    return res
  })
  .then(res => {
    return new Promise((resolve, reject) => {
      resolve(res)
    })
  })
  .then(res => {
    throw new Error('Error')
  })
  .then(
    res => {
      console.log('5. ', res)
    },
    err => {
      console.log('5. ', err)
    }
  )

// 6. 用catch捕获异常
promise
  .then(res => {
    return res
  })
  .then(res => {
    return new Promise((resolve, reject) => {
      resolve(res)
    })
  })
  .then(res => {
    throw new Error('new Error') // 会走error回调
  })
  .then(
    res => {
      console.log('6. ', res)
    },
    err => {
      // 如果我们写了错误的回调就会优先执行是标的回调
      console.log('6. reject', err)
    }
  )
  .catch(err => {
    console.log('6. catch', err)
  })

// 7. catch以后再执行then
promise
  .then(res => {
    return res
  })
  .then(res => {
    return new Promise((resolve, reject) => {
      resolve(res)
    })
  })
  .then(res => {
    throw new Error('new Error') // 会走error回调
  })
  .then(
    res => {
      console.log('7. ', res)
    }
    // err => {
    //   // 如果我们写了错误的回调就会优先执行rejected的回调
    //   console.log('6. reject', err)
    // }
  )
  .catch(err => {
    console.log('7. catch', err)
    return 'what love?'
  })
  .then(res => {
    console.log('7. ', res)
  })

/**
 * catch在promise源码层面他就是一个then，所以他也遵循then的运行原则，
 * 成功的条件：
 *  then -> return一个普通的javascript value
 *  then -> return一个新的promise resolve(value)
 * 失败的条件：
 *  then -> return一个新的promise reject(error)
 *  then -> throw new Error()
 */
