import { Hono } from "hono";
import * as z from 'zod';
import { zValidator as zv } from "@hono/zod-validator";


const productmodules = new Hono();

const profrom = z.object({
    proID : z.int('Need product ID!').refine((i) => i.toString().length >= 5 , 'mustbeatleast 5 charactor'),
    proname : z.string('Need product name!').min(5 , 'product name must be atleast 5 charactor'),
    sellprice : z.float64('please enter price'),
    productprice : z.float64('please enter price'),
    Pdesciption : z.string().optional()
})


productmodules.post('/createproduct' , zv('json' , profrom) , async(c) => {
  const from = await c.req.json()
  return c.json({ status : "Created!"  , ProductData : from})
})


export default productmodules;