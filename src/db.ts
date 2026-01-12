import { PrismaClient } from './generated/prisma/client.js'

import { PrismaPg } from '@prisma/adapter-pg'
import type { Pool as NeonPool } from '@neondatabase/serverless'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

declare global {
  var __prisma: PrismaClient | undefined
  var __neonPool: NeonPool | undefined
}

export const prisma = globalThis.__prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}

export async function getClient(): Promise<NeonPool | undefined> {
  const connectionString = process.env.DATABASE_URL || process.env.VITE_DATABASE_URL
  if (!connectionString) return undefined

  if (globalThis.__neonPool) return globalThis.__neonPool

  const { Pool, neonConfig } = await import('@neondatabase/serverless')

  // Node 环境下如果没有全局 WebSocket，则使用 ws 作为实现
  if (typeof (globalThis as any).WebSocket === 'undefined') {
    const wsMod = await import('ws')
    neonConfig.webSocketConstructor = ((wsMod as any).default ?? (wsMod as any).WebSocket) as any
  }

  globalThis.__neonPool = new Pool({ connectionString })
  return globalThis.__neonPool
}
