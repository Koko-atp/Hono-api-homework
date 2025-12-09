import { Hono } from "hono";
import dayjs    from "dayjs";
import { cors } from "hono/cors";
import { serve } from '@hono/node-server';
import { ReadableStream } from "node:stream/web";
import { stat } from "node:fs";



const espres = new Hono()
espres.use('*' , cors({
    origin: 'http://localhost:5173',
  allowMethods: ['GET' ,'POST']

}))

espres.get('/esp' , (c) => {
  
  const origin = c.req.header('origin');
  const data = {
    stat : 0, 
    pin : 10 
  }
  console.log(  
    "\n=========================",
    "\nrequest from : " , origin
    , "\nsending package : "  , dayjs().format("YYYY-MM-DD HH:mm:ss") 
    , "\ncontent : " , data
    , "\n========================="
    
  )
  return c.json(data)
})
espres.get('/testget' , (c) => {
    const origin = c.req.header('origin'); 
    const data =  { content : [ {'rogerthat' : 1234} , {'rogerthat' : "w82us"},]}
    console.log( 
        "\n=========================",
        "\nrequest from : " , origin
        , "\nsending package : "  , dayjs().format("YYYY-MM-DD HH:mm:ss") 
        , "\ncontent : " , data
        , "\n========================="

    )
    return c.json(data) 
})
export default espres ; 