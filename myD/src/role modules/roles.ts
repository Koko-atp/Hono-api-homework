import {Hono  } from 'hono'

const roles_rounts = new Hono();


    let a : any = (0)
    let boolean_a : boolean = Boolean(a)
const UserList = [1 , 2 ,3 ,4 ,5]

type everynumber = Number
type dict = {}
type productdict = {
  "id" : number,
  'name' : string
}
type minpro = Omit<productdict,"name">
type whatpro = Partial<productdict>


let b :everynumber = 2344
let c : minpro = {"id" : 232}
let d : whatpro = {
  'id' : 12
}

roles_rounts.get('/api/products', (c) => c.text('GET all products in here ') )
roles_rounts.get('/api/products/:num' , (c) => c.text('GET product NUMBER = ' + c.req.param('num')) )
roles_rounts.post('/api/products' , async (c) => {
    const newprod = await c.req.json();
    return c.json (newprod)
})

roles_rounts.put('/api/products/:num' , (c) => c.text('put product that id = ' + c.req.param('num')) )
roles_rounts.delete('/api/products/:num' , (c) => {
  return c.json({
      "productNumber": c.req.param('num'),
      "productname": d
    })
})


export default roles_rounts;