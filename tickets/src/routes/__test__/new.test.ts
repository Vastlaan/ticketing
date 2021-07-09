import { validationResult } from 'express-validator'
import request from 'supertest'
import {app} from '../../app'
import {signup} from '../../test/setup'
import {Ticket} from '../../models/ticket'

it('has a route handler to /api/tickets for post request', async()=>{
  const response = await request(app)
    .post('/api/tickets')
    .send({})

  expect(response.status).not.toEqual(404)
})

it('returns status 401 when user is not authenticated', async()=>{

  const response = await request(app)
    .post('/api/tickets')
    .send({})
    
  expect(response.status).toEqual(401)

})

it('returns status not equal to 401 or 500 when user is authenticated', async ()=>{

  const cookie = signup()
  
  const validResponse = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({})
  
  expect(validResponse.status).not.toEqual(401)
  expect(validResponse.status).not.toEqual(500)

})

it('returns error when invalid title is provided', async()=>{

  const cookie = signup()

  await request(app)
    .post('/api/tickets')
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 100
    })
    .expect(400)

  await request(app)
  .post('/api/tickets')
  .set("Cookie", cookie)
  .send({
    price: 100
  })
  .expect(400)
})

it('returns error when invalid price is provided', async()=>{

  const cookie = signup()

  await request(app)
    .post('/api/tickets')
    .set("Cookie", cookie)
    .send({
      title: "dsafdfa",
      price: -100
    })
    .expect(400)

  await request(app)
  .post('/api/tickets')
  .set("Cookie", cookie)
  .send({
    title: "fjkodsjkjo"
  })
  .expect(400)

})

it('creates a ticket with valid inputs', async()=>{

  const cookie = signup()

  let collectionItems = await Ticket.countDocuments({})

  expect(collectionItems).toEqual(0)

  const response = await request(app)
    .post('/api/tickets')
    .set("Cookie", cookie)
    .send({
      title: "This is from test",
      price: 21
    })

    collectionItems = await Ticket.countDocuments({})

    expect(collectionItems).toBeGreaterThanOrEqual(1)
})
