import express, {Express, Request, Response} from "express"
import mongoose, { connection } from "mongoose";
import session, { SessionData } from "express-session";
import cors from "cors";
import passport from "passport"
import crypto from "crypto"
import MongoStore from "connect-mongo";
import {router} from "./routes/index";
interface CustomSession extends session.Session{
    views?: number;
};

declare module "express-session" {
    interface SessionData{
        views? :number;
    }
}

const app = express();

app.use(cors())


require("dotenv").config();

const PORT = process.env.PORT || 4500
const MONGODB = process.env.MONGODB
const SESSIONSECRET = process.env.SESSIONSECRET

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const store = new MongoStore({
    mongoUrl: MONGODB,
    collectionName:"sessions"
});

app.use(session({
    secret:SESSIONSECRET as string,
    resave:false,
    saveUninitialized:true,
    store: store,
    cookie:{
        maxAge: 1000 * 60 * 60 *24
    },
    
}));

require("./config/passport")

app.use(router);


app.get("/", (req :Request<{session: SessionData}>,res:Response)=>{
    if(!req.session!.views){
        req.session!.views = req.session!.views as number + 1
    } else{
        req.session!.views += 1;
    };

res.send(`You visited ${req.session!.views} times`);
});

app.get("/justy", (req:Request, res:Response)=>{
    res.send("I am the next big thing ");
});

app.listen(PORT , ()=>{
    console.log(`port listening at port ${PORT}`);
});