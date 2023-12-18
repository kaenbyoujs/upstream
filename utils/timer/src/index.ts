import { Context, Service } from 'cordis'

declare module 'cordis' {
  interface Context {
    timer: TimerService
    setInterval: TimerService['setInterval']
    setTimeout: TimerService['setTimeout']
    createQueue: TimerService['createQueue']
  }
}

export default class TimerService extends Service {
  constructor(ctx: Context) {
    super(ctx, 'timer')
    ctx.mixin('timer', ['setInterval', 'setTimeout', 'createQueue'])
  }

  setInterval(callback: (...args: any[]) => void, ms: number, ...args: any[]) {
    const id = setInterval(callback, ms, ...args)

    const caller: Context = this.ctx[Context.current]
    return caller.collect('interval', () => clearInterval(id))
  }
  
  setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]) {
    const id = setTimeout(callback, ms, ...args)

    const caller: Context = this.ctx[Context.current]
    return caller.collect('timeout', () => clearTimeout(id))
  }

  createQueue<T = never>(handler: (task: T) => Promise<void> | void, interval: number) {
    let process = false
    return new Proxy<T[]>([], {
      set(target, property, value) {
        const result = Reflect.set(target, property, value)
        if (!process && property === 'length' && value > 0) {
          const callback = async () => {
            process = true
            if (!target.length) {
              process = false
              return
            }
            await handler(target.shift())
            setTimeout(callback, interval)
          }
          callback()
        }
        return result
      }
    })
  }
}
