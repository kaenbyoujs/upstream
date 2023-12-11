import { Context } from 'cordis'
import { defineProperty } from 'cosmokit'
import { Database, Driver } from '@minatojs/core'

export * from '@minatojs/core'

export interface Tables {}

declare module 'cordis' {
  interface Context {
    database: Database<Tables>
  }
}

export function createDriver(ctx: Context, Driver: Driver.Constructor, config: any) {
  const name = 'database'
  ctx.provide(name)

  const database = new Database()
  const driver = new Driver(database, config)

  database['name'] = name
  defineProperty(database, Context.current, ctx)
  defineProperty(database, Context.filter, function (ctx: Context) {
    return ctx[Context.shadow][this.name] === this.ctx[Context.shadow][this.name]
  })

  ctx.on('ready', async () => {
    await driver.start()
    database.drivers['default'] = driver
    database.refresh()
    ctx.database = database
  })

  ctx.on('dispose', async () => {
    ctx.database = null
    await driver.stop()
  })

  return Context.associate(Context.associate(database, 'service'), name)
}
