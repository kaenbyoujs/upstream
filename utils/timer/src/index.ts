import { Context, Service } from 'cordis'

declare module 'cordis' {
  interface Context {
    timer: TimerService
    setInterval: TimerService['setInterval']
    setTimeout: TimerService['setTimeout']
  }
}

export default class TimerService extends Service {
  constructor(ctx: Context) {
    super(ctx, 'timer')
    ctx.mixin('timer', ['setInterval', 'setTimeout'])
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
}
