import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: 'require',
  connect_timeout: 15,
  idle_timeout: 15,
  max: 10,
  connection: {
    application_name: "nextjs_dashboard"
  }
})

export { sql }
