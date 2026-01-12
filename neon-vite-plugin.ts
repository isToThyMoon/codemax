import postgresPlugin from 'vite-plugin-db'

export const neon = postgresPlugin({
  seed: {
    type: 'sql-script',
    path: 'db/init.sql',
  },
  referrer: 'create-tanstack',
  dotEnvKey: 'VITE_DATABASE_URL',
})

export default neon
