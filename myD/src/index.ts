import { serve } from '@hono/node-server'
import { Hono } from 'hono';

import user_index from './user modules/userindex.js';
import roles_rounts from './role modules/roles.js';
import productmodules from './product modules/productsmod.js';
import espres from './esp32/apitest.js';

const app = new Hono()
app.route('/api/user' , user_index)
app.route('/api/roles' , roles_rounts)
app.route('/api/products' , productmodules)


app.route('/esp32/api' , espres)


serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
