import request from 'supertest'
import {app} from '../../app'
import {signup} from '../../test/setup'
import {Ticket} from '../../models/ticket'

it('returns status 404 if the ticket is not found', async()=>{

  const response = await request(app)
    .get('/api/tickets/41224d776a326fb40f000001')
    .expect(404)
})

it('returns a ticket if the ticket is found', async()=>{

  const cookie = signup()

  const res = await request(app)
    .post('/api/tickets')
    .set("Cookie", cookie)
    .send({
      title: "This is from test again",
      price: 22
    })
    .expect(201)

  const id = res.body.ticket.id

  const response = await request(app)
    .get(`/api/tickets/${id}`)

  expect(response.body.ticket.title).toEqual("This is from test again")
})