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
    if (this.status === FULLFILLED) {
      onFullFilled(this.value)
    }
    if (this.status === REJECT) {
      onRejected(this.error)
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
        onFullFilled(this.value)
      })
      this.onRejectedStacks.push(() => {
        onRejected(this.error)
      })
    }
  }
}

module.exports = MyPromise
