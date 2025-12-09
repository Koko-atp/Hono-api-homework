import { zValidator as ZV } from '@hono/zod-validator'
import  *  as Z from 'zod'
import { Hono } from 'hono'
import db from '../DB/indexdb.js'
import { error } from 'console'
import type { report } from 'process'
import { parse } from 'path'
import { fail } from 'assert'

const user_index = new Hono()

const userCSchema = Z.object({
    name : Z.string("Enter ur name").min(4 , 'name must be atleast 4 char') , 
    email : Z.email('this isnt email tho'),
    steam : Z.string().optional()
})






user_index.delete('/page/welcome', (c) =>
    c.text('DELETE /')
)


user_index.post('/createuser' , ZV('json' , userCSchema) , async(c) => {
    const form = await c.req.json()
    console.log("recieved" , form)
    return c.json({"Text" : "success" , "User" : form})
})



//////////////////////////////////////////////////////////////////////////////////////////// 
type User  = {
  id : number,
  username : string,
  passwd : string,
  f_name : string,
  lastname : string
}

///////////////////////////getuser

user_index.get('/get_user/:id' , async(c) => {
  const { id } = c.req.param()
  let dbcm = "SELECT * FROM user WHERE id = @id"
  let stmt  = db.prepare<{id : string} , User>(dbcm)
  let user = stmt.all({id : id})

  if (!user) {
    return c.json({ message : `User detail not found`  } , 404);
  }
  return c.json({
    message : `User detail for ID : ${id}` ,
    data : user
  });
})

////////////////////////create new user
const DBaddUserschema = Z.object({
    username : Z.string("please enter your username").min(3 , "User name must be atleast 3 character"),
    password : Z.string ("please set your password").min(8 , "password must be atleast 8 character"),
    firstname : Z.string("please enter your firstname").optional(),
    lastname : Z.string("please enter your lastname")
})

user_index.post('/postuser' , ZV('json' , DBaddUserschema , (result,c) => {
    if(!result.success){
        return c.json({
            message : "created contend failed",
            errors : result.error.issues
        } , 400)
    }
}) , async(c) => {
        const content = await c.req.json()
        let exc =  `INSERT INTO "user"
        (username, passwd, f_name, l_name)
        VALUES(@username , @password , @firstname , @lastname );`
        
        let execute = db.prepare< Omit<User , "id"> >(exc);
        let final = execute.run(content);

        if(final.changes === 0 ){
            return c.json({ message: 'User create failed' } , 500);
        }

        let lastid = final.lastInsertRowid as number;
        let exc2 = `SELECT * FROM user WHERE id = ?`
        let execute2 = db.prepare<[number] , User>(exc2)
        let lastuser = execute2.get(lastid)

        return c.json({ message: 'User created' ,
            report : final,
            data : lastuser} , 201)
})
/////////////////////update user
const userupdateSchema = Z.object({
    username : Z.string("please enter your username").min(3 , "User name must be atleast 3 character").default(''),
    password : Z.string ("please set your password").min(8 , "password must be atleast 8 character").default(''),
    firstname : Z.string("please enter your firstname").default(""),
    lastname : Z.string("please enter your lastname").default('')
})
user_index.post('/user_update/:id', ZV('json' ,  userupdateSchema , (result , c) => {

    if(!result.success){
        return c.json({
            message : "created contend failed",
            errors : result.error.issues
        } , 400) 
}}) ,
    async(c) => {
        const { id } = c.req.param();
        const content =userupdateSchema.parse(await c.req.json());
        let exc = `UPDATE user
        SET 
        username = COALESCE( NULLIF(@username, ''), username),
        passwd = COALESCE( NULLIF(@password , '') , passwd),
        f_name   = COALESCE( NULLIF(@firstname, ''), f_name),
        l_name   = COALESCE( NULLIF(@lastname, ''), l_name)
        WHERE id = @id;`
        let execute = db.prepare<{id: string} , Omit<User, 'id'>>(exc)
        let final = execute.run({id: id , ...content});
        if (final.changes === 0){
            return c.json({message : `User id: ${id} update failed`} , 404)
        }
        return c.json({message : 'user Updated' , new_change : content,  report : final})
})


//////////delete user
user_index.delete('/delete_user/:id' , async(c) =>  {
    const { id } = c.req.param();
    let getbf = `SELECT * FROM user WHERE id = @id`
    let exc = `DELETE FROM "user"
    WHERE id=@id;`
    let getuser = db.prepare<{id : string}>(getbf)
    let thatuser = getuser.get({id : id})

    let execute = db.prepare< {id :string}>(exc);
    let  final = execute.run({id : id})
    if (final.changes === 0){
        return c.json({message : `Delete User ID: ${id} failed`} , 404)
    }
    return c.json({
        message : "Delete User",
        user : thatuser,
        status :final
    })
})




export default user_index;