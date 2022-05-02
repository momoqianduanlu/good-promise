/**
 * promise内部实现
 */

const PENDING = 'pending'
const FULLFILLED = 'fullfilled'
const REJECT = 'reject'

class MyPromise {
  // 1. executor是一个函数
  constructor (executor) {
    this.status = PENDING
    this.value = undefined
    this.error = undefined
    /**
     * 2. 为什么 resolve，reject函数不声明在构造函数外面，
     * 站在es6的角度上来讲，我们将这个两个函数定义在构造函数的外面实际上是定义在了MyPromise的原型上面了，
     * 这样我们每一个MyPromise都是继承的一个resolve，但是每一个MyPromise里面的 executor 执行器里面都应该有自己的 resolve和reject。
     */
    const resolve = value => {
      if (this.status === PENDING) {
        this.status = FULLFILLED
        this.value = value
      }
    }
    const reject = error => {
      if (this.status === PENDING) {
        this.status = REJECT
        this.error = error
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
    if (this.status === FULLFILLED) {
      onFullFilled(this.value)
    }
    if (this.status === REJECT) {
      onRejected(this.error)
    }
  }
}

module.exports = MyPromise
