import { Context } from 'cordis'
import { createDriver } from '@kaenbyoujs/database-core'
import { MemoryDriver } from '@minatojs/driver-memory'

export interface Config {}

export function apply(ctx: Context, config: Config) {
  createDriver(ctx, MemoryDriver, config)
}
