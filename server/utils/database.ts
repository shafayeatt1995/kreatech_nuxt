function getRequiredEnv(name: string): string {
  const value = process.env[name]

  if (!value) {
    throw new Error(`${name} is not set`)
  }

  return value
}

export function getDatabasePoolConfig() {
  return {
    host: getRequiredEnv('DB_HOST'),
    port: Number(getRequiredEnv('DB_PORT')),
    user: getRequiredEnv('DB_USER'),
    password: getRequiredEnv('DB_PASSWORD'),
    database: getRequiredEnv('DB_NAME'),
    connectionLimit: 5,
    connectTimeout: 15_000,
    acquireTimeout: 15_000,
  }
}

export function getDatabaseUrl() {
  const { host, port, user, password, database } = getDatabasePoolConfig()

  return `mysql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}`
}
