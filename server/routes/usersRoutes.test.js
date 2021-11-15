require("dotenv").config();
const supertest = require("supertest");
const debug = require("debug")("file:usersRoutes");
const chalk = require("chalk");
const mongoose = require("mongoose");

const { app, initializeServer } = require("..");
const connectDB = require("../../database");

const request = supertest(app);

let server;
let token;

beforeAll( async () => {
  await connectDB(process.env.MONGODB_TEST_STRING);
  server = await initializeServer(8000);
});

beforeEach( async () => {
  const {body} = await request
    .post("/users/login")
    .send({username: "Rodipet", password: "holalapa"})
    .expect(200)
  token = body.token;
  await User.deleteMany();
  await User.create({
    name: "testuser",
    username: "testuser",
    password: "$2b$10$0nPwkVWmq3K/zKLs8PSvfuxuAJebcNuArOiJwEDvKha.X5Th9OyHq",
    friends: [],
    enemies: [],
    photo: "",
    bio: "",
    _id: "61921b98cb148db19ead2e25"
  });
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
      const {body} = await request.get("/users").expect(400);
      const expectedError = { error: "Bad Request!"}; 
      expect(body).toBe(error);  
    })
  });

  
  describe("When it gets a GET request with token", () => {
    test("Then it should send a response with users and code 200", async () => {
        const {body} = await request
          .get("/users")
          .set("Authorization", "Bearer "+token)
          .expect(200);
        
        expect(body).toHaveLength(1);  
     })
  });


});
