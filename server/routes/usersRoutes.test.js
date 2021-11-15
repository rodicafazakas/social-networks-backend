require("dotenv").config();
const supertest = require("supertest");
const debug = require("debug")("file:usersRoutes");
const chalk = require("chalk");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { app, initializeServer } = require("..");
const connectDB = require("../../database");
const User = require("../../database/models/User");

const request = supertest(app);

let server;
let token;

beforeAll( async () => {
  await connectDB(process.env.MONGODB_TEST_STRING);
  server = await initializeServer(8000);
});

beforeEach( async () => {
  await User.deleteMany();
  await User.create({
    name: "testuser",
    username: "testuser",
    password: await bcrypt.hash("holalapa", 10),
    friends: [],
    enemies: [],
    photo: "",
    bio: "jjj",
  });
  const {body} = await request
    .post("/users/login")
    .send({username: "testuser", password: "holalapa"})
    .expect(200)
  token = body.token;
});

afterAll( (done) => {
  server.close( async () => {
    await mongoose.connection.close();
    done();
  });
});

describe("Given a /users router", () => {

  describe("When a GET request arrives without a token", () => {
    test("Then it should respond with a 401 error", async () => {
      await request.get("/users").expect(401);
    })
  });

  
  describe("When it gets a GET request with token", () => {
    test("Then it should send a response with users and code 200", async () => {
        const {body} = await request
          .get("/users")
          .set("Authorization", "Bearer "+token)
          .expect(200);
        
        expect(body).toHaveLength(1);  //one document in the collection
     })
  });


});
