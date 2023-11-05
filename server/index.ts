/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
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

app.get('/user', async (req: any, res: any) => {
  let data
  const arrUsers = []

  if (req.query.email && req.query.name) {
    const { data: selectData, error } = await supabase
      .from('users')
      .select('id, name, email, image, typeOfLogin')
      .eq('name', req.query.name)
      .eq('email', req.query.email)

    if (error !== null) {
      return res.send({
        error
      })
    }

    data = selectData
  } else {
    const { data: selectData, error } = await supabase
      .from('users')
      .select('id, name, email, image')

    if (error !== null) {
      return res.send({
        error
      })
    }

    data = selectData
  }

  for (let i = 0; i < data.length; i++) {
    const { data: walletsData } = await supabase
      .from('wallets')
      .select('id, address, kind, userId')
      .eq('userId', data[i].id)

    arrUsers?.push({
      ...data[i],
      wallets: walletsData
    })
  }

  return res.send(arrUsers)
})

app.post('/user', async (req: any, res: any) => {
  console.log(req.body)

  // Check if iuser is in db, then do not add
  const { data } = await supabase
    .from('users')
    .select('id, name, email, image, typeOfLogin')
    .eq('name', req.body.name)
    .eq('email', req.body.email)

  if (data !== null && data?.length > 0) {
    const { data: selectWalletsData } = await supabase
      .from('wallets')
      .select('id, address, kind, userId')
      .eq('userId', data![0].id)

    return res.send({
      ...data![0],
      wallets: selectWalletsData
    })
  }

  const { error } = await supabase
    .from('users')
    .insert({
      name: req.body.name,
      email: req.body.email,
      typeOfLogin: req.body.typeOfLogin,
      image: req.body.image
    })

  const { data: selectData } = await supabase
    .from('users')
    .select('id, name, email, image, typeOfLogin')
    .eq('email', req.body.email)

  console.log('selectData', selectData)

  const { error: inserError } = await supabase
    .from('wallets')
    .insert({
      address: req.body.wallets[0].address,
      kind: req.body.wallets[0].kind,
      userId: selectData![0].id
    })

  if (inserError != null) {
    return res.status(500).send({
      error: inserError
    })
  }

  const { data: selectWalletsData } = await supabase
    .from('wallets')
    .select('id, address, kind, userId')
    .eq('userId', selectData![0].id)

  if (error != null) {
    return res.status(500).send({
      error
    })
  }

  res.send({
    ...selectData![0],
    wallets: selectWalletsData
  })
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
    .eq('id', req.params.id)

  console.log(data, req.params.id, error)

  if (data !== null && data?.length === 0 && error === null) {
    return res.status(400).send({
      error: 'User do not exist in DB. Aborting.'
    })
  }

  const { data: selectWalletsData } = await supabase
    .from('wallets')
    .select('id, address, kind, userId')
    .eq('address', req.body.address)
    .eq('kind', req.body.kind)

  // If already in the list - return ALL wallets
  if (selectWalletsData!.length > 0) {
    console.log('selectWalletsData', { selectWalletsData })
    const { data: selectData } = await supabase
      .from('wallets')
      .select('id, address, kind, userId')
      .eq('userId', req.params.id)

    return res.send(selectData)
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

  const { data: selectData } = await supabase
    .from('wallets')
    .select('id, address, kind, userId')
    .eq('userId', req.params.id)

  return res.send(selectData)
})

app.post('/message', async (req: any, res: any) => {
  console.log(req.body)

  const { data } = await supabase
    .from('messages')
    .insert({
      ...req.body
    })

  return res.send('OK')
})

app.get('/message/:address', async (req: any, res: any) => {
  console.log(req.params.address)

  const { data } = await supabase
    .from('messages')
    .select('id, address, msg, date, isMy')
    .eq('address', req.params.address)

  console.log(data)
  return res.send(data)
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
