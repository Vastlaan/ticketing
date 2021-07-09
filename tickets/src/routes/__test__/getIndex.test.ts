import request from 'supertest'
import {app} from '../../app'
import {signup} from '../../test/setup'

it("gets empty array if there are no tickets", async ()=>{
  const response = await request(app)
    .get('/api/tickets')
    expect(200)

  expect(Array.isArray(response.body.tickets)).toBe(true)

  
})

it('retrieve existing tickets array', async()=>{
  
  const cookie = signup()
  
  await request(app)
    .post('/api/tickets')
    .set("Cookie", cookie)
    .send({
      title: "This is from test get Index",
      price: 211
    })

    const response = await request(app)
    .get('/api/tickets')
    expect(200)

  expect(Array.isArray(response.body.tickets)).toBe(true)
  expect(response.body.tickets.length).toBeGreaterThan(0)
  
})