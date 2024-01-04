// HTTP layer for the user resource.
// router modules handle incoming HTTP requests related to the user resource.
// the HTTP layer is responsible for:
// parsing the request body
// validating the request body
// calling the appropriate service layer function
// returning the appropriate HTTP status code
import express from 'express';
import log from '@ajar/marker';
import * as user_controller from "./user.controller.mjs";
import bcrypt from "bcrypt";
/* 
  if there is an error thrown in the DB, asyncMiddleware
  will pass it to next() and express will handle the error */
import raw from "../../middleware/route.async.wrapper.mjs";



log.magenta(`user.router loaded...`);

const router = express.Router();

// parse json req.body on post routes
router.use(express.json())

// log.magenta('verifyAuth',req.url)
// log.obj(req.session,'req.session:')
router.post("/login",raw(async (req, res) => {
  const { user:username, password } = req.body;


  const user = await user_controller.getOneByUser(username);
  if (!user) return res.status(403).json({ status: "username or possword is wrong!." });
  //console.log("the username is ?",user);
  //console.log("the password is ?",password);
  
  const password_is_valid = await bcrypt.compare(password, user.password)
  if (!password_is_valid) return res.status(403).json({ status: "username or possword is wrong!." });


  req.isAuthenticated = true;
  res.status(200).json(user);
  // Assuming '/chat' is a frontend route, send a response indicating success.
 // res.redirect(200, '/chat'); redirection not so needed ,i can make 2 fetches in fron server
})
);

const verifyAuth = (req,res,next)=>{
  if(req.session.user){
      next()
  }else{
      res.status(403).json({status:'unauthorized',payload:'You are unauthorized to access this route'})
  }
}
//dont forget to make button for this
router.get('/logout',(req,res)=>{
  req.isAuthenticated = false;
  res.status(200).json({status:'You are logged out'})
})

router.get('/protected',verifyAuth,(req,res)=>{ //i need to redirect it to chat
  res.status(200).json({status:'OK',payload:'some sensitive data'})
})
// CREATES A NEW USER
// router.post("/", async (req, res,next) => {
//    try{
//     const user = await user_controller.create(req.body);
//     res.status(200).json(user);
//    }catch(err){
//       next(err)
//    }
// });
// CREATES A NEW USER
router.post("/register", raw( async (req, res) => {
  // TODO - validate req.body
  const user = await user_controller.create(req.body);
  res.status(200).json(user);
}) );

// // CREATES A NEW USER
// router.post("/", raw( async (req, res) => {
//     // TODO - validate req.body
//     const user = await user_controller.create(req.body);
//     res.status(200).json(user);
// }) );
// GETS A SINGLE by user and password
//if this work fetch in fronted /chat
// app.post('/api/login', (req,res)=> {
//     log.obj(req.body,'body')
//     const {email,password} = req.body;
    
//     if(email === testUser.email && password === testUser.password){
//         req.session.user = testUser;
//         log.obj(req.session,'set req.session:')
//         const payload = {...testUser};
//         delete payload.password;
//         res.status(200).json({status:'you are authenticated', user:payload})
//     }else{
//         res.status(403).json({status:'wrong email or password'})
//     }
// });




// GET ALL USERS
router.get( "/",raw(async ( req , res) => {
    const {page,limit} = req.query;
    // Convert query parameters to integers (if they're strings)
    //const pageNumber = parseInt(page) || 1;
    //const limitNumber = parseInt(limit) || 20;
    log.red(`page is = ${page} and limit is = ${limit}`);
  
    log.yellow(`at user.router and type of page is =  ${typeof page}`);
     // Convert query parameters to integers (if they're strings)
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 20;
    const users = await user_controller.getAll(pageNumber,limitNumber);
    res.status(200).json(users);
  })  
);


// GETS A SINGLE USER
router.get("/:id",raw(async (req, res) => {
    const user = await user_controller.getOne(req.params.id)
    if (!user) return res.status(404).json({ status: "No user found." });
    res.status(200).json(user);
  })
);

// UPDATES A SINGLE USER
router.put("/:id",raw(async (req, res) => {
    const user = await user_controller.updateOne(req.params.id,req.body);
    res.status(200).json(user);
  })
);


// DELETES A USER
router.delete("/:id",raw(async (req, res) => {
    const user = await user_controller.deleteOne(req.params.id);
    if (!user) return res.status(404).json({ status: "No user found." });
    res.status(200).json(user);
  })
);

export default router;
