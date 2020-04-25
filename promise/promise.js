// promise的优点
// 1.可以链式调用，解决回调地狱的问题，异常处理更加的方便
// 2.回调函数的指定更灵活，之前是必须在执行异步操作之前指定回调
// Promise: 启动异步任务 => 返回promise对象 => 给promise对象绑定回调函数



(function (window) {
    const PENDING = 'pending';
    const RESOLVED = 'resolved';
    const REJECTED = 'rejected';

    function Promise(excutor) {
        const self = this
        this.status = PENDING
        this.data = undefined
        this.callbacks = []

        function resolve(value) {
            if(self.status !== PENDING) return
            self.status = RESOLVED
            self.data = value
            if(self.callbacks.length > 0) {
                // 放入队列中执行所有成功的回调
                setTimeout(()=>{
                    self.callbacks.forEach(callbacksObj => {
                        callbacksObj.onResolved(value)
                    })
                })
            }
        }

        function reject(reason) {
            if(self.status !== PENDING) return
            self.status = REJECTED
            self.data = reason
            if(self.callbacks.length > 0) {
                // 放入队列中执行所有成功的回调
                setTimeout(()=>{
                    self.callbacks.forEach(callbacksObj => {
                        callbacksObj.onRejected(reason)
                    })
                })
            }
        }
        // 立即同步执行excutor
        try {
            excutor(resolve, reject)
        } catch(e) {
            reject(e)
        }
    }

    Promise.prototype.then = function(onResolved, onRejected) {
        const self = this
        
        // 返回一个新的promise对象
        return new Promise((resolve, reject) => {
            if(self.status === PENDING) {
                // 将回调函数保存起来
                self.callbacks.push({onResolved, onRejected})
            } else if(self.status === RESOLVED) {
                setTimeout(() => {
                    // 如果抛出异常，return的promise会失败，reason是error
                    // 如果回调函数执行返回 非promise， return的promise会成功，value是返回的值
                    // 如果返回的函数是promise，return的promise的结果就是这个promise
                    try {
                        const result = onResolved(self.data)
                        if(result instanceof Promise) {
                            result.then(
                                value => resolve(value),
                                reason => reject(reason)
                            )
                        } else {
                            resolve(result)
                        }
                    } catch (e){
                        reject(e)
                    }
                    
                })
            } else if(self.status === REJECTED) {
                setTimeout(() => {
                    onRejected(self.data)
                })
            }
        })
    }

    Promise.prototype.catch = function(onRejected) {

    }

    Promise.all = function(promises) {

    }

    Promise.race = function(promises) {

    }

    Promise.resolve = function(value) {

    }

    Promise.reject = function(reason) {

    }

    window.Promise = Promise
})(window)

