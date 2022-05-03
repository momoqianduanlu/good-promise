/**
 * promise内部实现
 */

const PENDING = 'pending'
const FULLFILLED = 'fullfilled'
const REJECT = 'reject'

const resolvePromise = (promise2, x, resolve, reject) => {
  console.log('promise2, x', promise2, x)
}

class MyPromise {
  // 1. executor是一个函数
  constructor (executor) {
    this.status = PENDING
    this.value = undefined
    this.error = undefined
    this.onFullFilledStacks = []
    this.onRejectedStacks = []
    /**
     * 2. 为什么 resolve，reject函数不声明在构造函数外面？
     * 站在es6的角度上来讲，我们将这个两个函数定义在构造函数的外面实际上是定义在了MyPromise的原型上面了，
     * 这样我们每一个MyPromise都是继承的一个resolve，但是每一个MyPromise里面的executor执行器里面都应该有自己的resolve和reject。
     */
    const resolve = value => {
      if (this.status === PENDING) {
        this.status = FULLFILLED
        this.value = value
        this.onFullFilledStacks.forEach(fn => fn())
      }
    }
    const reject = error => {
      if (this.status === PENDING) {
        this.status = REJECT
        this.error = error
        this.onRejectedStacks.forEach(fn => fn())
      }
    }
    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }
  // promise.then()
  then (onFullFilled, onRejected) {
    /**
     * 4. then函数必须返回一个promise (https://promisesaplus.com/)
     * onFullFilled和onRejected函数会返回一个值x，这个值可能是普通值/也可能是一个promise/还有可能是throw的一个error，
     * 通过try catch 可以捕获error，然而对于返回值x，我们要通过一个函数来进行处理。
     * resolvePromise函数的执行时机需要注注意，因为在同步代码执行过程中promise2有可能没执行完，x的值可能也没返回。
     */
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.status === FULLFILLED) {
        try {
          const x = onFullFilled(this.value)
          // promise源码中用的是micro-task
          setTimeout(() => {
            resolvePromise(promise2, x, resolve, reject)
          }, 0)
        } catch (error) {
          console.log('error', error)
          reject(error)
        }
      }
      if (this.status === REJECT) {
        try {
          const x = onRejected(this.error)
          setTimeout(() => {
            resolvePromise(promise2, x, resolve, reject)
          }, 0)
        } catch (error) {
          reject(error)
        }
      }
      /**
       * 3. 处理异步调用的promise
       * 同步调用promise的时候会顺序执行promise.then()函数。
       * 但当异步调用promise的时候，此时promise还处于pending状态，onFullFilled, onRejected并不知道先去执行哪一个，
       * 通过promise.then先去订阅onFullFilled, onRejected函数，将他们push到一个执行栈里面，
       * 不管是不是异步调用promise，最终都要执行resolve和reject，所以在这两个函数执行的时候再去发布订阅的函数。
       */
      if (this.status === PENDING) {
        this.onFullFilledStacks.push(() => {
          try {
            const x = onFullFilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
        this.onRejectedStacks.push(() => {
          try {
            const x = onRejected(this.error)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      }
    })
    return promise2
  }
}

module.exports = MyPromise
