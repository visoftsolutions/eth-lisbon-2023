/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-var-requires */
import { createClient } from '@supabase/supabase-js'
import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = 'https://plefbsfdzamabzqflbip.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY ?? ''

const supabase = createClient(supabaseUrl, supabaseKey)

const app = express()
app.use(express.json())
const port = process.env.PORT ?? 3001

app.post('/user', async (req: any, res: any) => {
  console.log(req.body)

  // Check if iuser is in db, then do not add
  const { data } = await supabase
    .from('users')
    .select('name, email')
    // .eq('name', req.body.name)
    .eq('email', req.body.email)

  if (data !== null && data?.length > 0) {
    return res.status(409).send({
      error: 'User already in DB. Aborting.'
    })
  }

  const { error } = await supabase
    .from('users')
    .insert(req.body)

  if (error != null) {
    return res.status(500).send({
      error
    })
  }

  res.send('OK')
})

app.get('/user/:id', async (req: any, res: any) => {
  console.log(req.params)

  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, image, typeOfLogin')
    .eq('id', req.params.id)

  const { data: walletsData, error: walletsError } = await supabase
    .from('wallets')
    .select('id, address, kind, userId')
    .eq('userId', req.params.id)

  if (error !== null || walletsError !== null) {
    res.send({
      error
    })
  } else {
    res.send({
      ...data[0],
      wallets: walletsData
    })
  }
})

app.post('/user/:id/wallet', async (req: any, res: any) => {
  console.log(req.params)

  // Get DB user - check if exists
  const { data, error } = await supabase
    .from('users')
    .select('id')
    // .eq('name', req.body.name)
    .eq('id', req.params.id)

  console.log(data, req.params.id, error)

  if (data !== null && data?.length === 0 && error === null) {
    return res.status(400).send({
      error: 'User do not exist in DB. Aborting.'
    })
  }

  const { error: inserError } = await supabase
    .from('wallets')
    .insert({
      ...req.body,
      userId: req.params.id
    })

  if (inserError != null) {
    return res.status(500).send({
      error: inserError
    })
  }

  res.send('OK')
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
