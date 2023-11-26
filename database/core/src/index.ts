import { Context } from 'cordis'
import { Driver } from '@minatojs/core'

export * from '@minatojs/core'

declare module 'cordis' {
  interface Context {
    database: Driver
  }
}
