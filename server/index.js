const express = require('express')
const consola = require('consola')
const session = require('express-session')
const { Nuxt, Builder } = require('nuxt')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  session({
    secret: 'super-secret-cat',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 * 3 } // 30 * 3日
  })
)

// Import and et Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

const router = require('./routes')
app.use(router)

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
