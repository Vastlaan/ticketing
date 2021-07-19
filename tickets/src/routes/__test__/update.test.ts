import request from 'supertest'
import {app} from '../../app'
import mongoose from 'mongoose'
import {signup} from '../../test/setup'

jest.mock('../../nats-client')


it("returns 404 if the ticket with given id doesn't exist", async()=>{
  // create a fake ObjectId
  const id = new mongoose.Types.ObjectId().toHexString()

  const cookie = signup()

  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", cookie)
    .send({
      title: 'Valid title',
      price: 22
    })
    expect(404)
})

it("returns 401 if user not logged in", async()=>{
  
  // create a fake ObjectId
  const id = new mongoose.Types.ObjectId().toHexString()
  
  await request(app)
  .put(`/api/tickets/${id}`)
  .send({
    title: 'Valid title',
    price: 22
  })
  expect(401)
})

it("returns 401 if user not an creator of the ticket", async()=>{
  
  // create fake ticket
  const responseCreate = await request(app)
  .post('/api/tickets')
  .set("Cookie", signup())
  .send({
    title: "This is again a valid ticket",
    price: 22
  })
  const {id} = responseCreate.body.ticket
  
  console.log("ID: ", id)
  
  const response = await request(app)
  .put(`/api/tickets/${id}`)
  .set("Cookie", signup())
  .send({
    title: 'Hakuna matata',
    price: 333
  })
  expect(401)
})

it("update tickets when user is a creator and provides valid inputs", async()=>{
  
  const cookie = signup()
  // create fake ticket
  const responseCreate = await request(app)
  .post('/api/tickets')
  .set("Cookie", cookie)
  .send({
    title: "This is again a valid ticket",
    price: 22
  })
  const {id} = responseCreate.body.ticket
  
  const response = await request(app)
  .put(`/api/tickets/${id}`)
  .set("Cookie", cookie)
  .send({
    title: 'Hakuna matata',
    price: 333
  })
  expect(200)
  
  expect(response.body.ticket.title).toEqual('Hakuna matata')
})

it("returns 400 if the inputs are invalid", async()=>{
  const cookie = signup()
  // create fake ticket
  const responseCreate = await request(app)
  .post('/api/tickets')
  .set("Cookie", cookie)
  .send({
    title: "This is again a valid ticket",
    price: 22
  })
  const {id} = responseCreate.body.ticket
  
  const response = await request(app)
  .put(`/api/tickets/${id}`)
  .set("Cookie", cookie)
  .send({
    title: '',
    price: 'ldk'
  })
  expect(400)
})