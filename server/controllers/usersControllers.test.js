const User = require("../../database/models/User");
const { getUsers, loginUser } = require("./usersControllers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

jest.mock("../../database/models/User");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");


describe("Given a getUsers funcion", ()=>{
  describe("When it receives a response object", ()=> {
    test("Then it should invoke the next function", async () => {
      const users = [
        { name: "Rodi",
          username: "Rodipet",
          password: "holalapa",
          friends: [],
          enemies: [],
          photo: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fmedia.vogue.es%2Fphotos%2F5cc75252a6e117c22654cd9b%2Fmaster%2Fw_1600%252Cc_limit%2Fmulan_remake_2531.jpg&imgrefurl=https%3A%2F%2Fwww.vogue.es%2Fliving%2Farticulos%2Fliu-yifei-actriz-mulan-remake%2F32096&tbnid=xvbFTKhd5XJPlM&vet=12ahUKEwjD_MP225j0AhUrDWMBHXg3A0UQMygJegUIARDgAQ..i&docid=R5Kkvwzr950ZWM&w=1600&h=1067&q=mulan%20images&ved=2ahUKEwjD_MP225j0AhUrDWMBHXg3A0UQMygJegUIARDgAQ", 
          bio: "I have a mission",
        },
        {
          name: "Mari",
          username: "Sandi",
          password: "Bambi",
          friends: [],
          enemies: [],
          photo: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fplayfm.cl%2Fplayfm%2Fsite%2Fartic%2F20181001%2Fimag%2Ffoto_0000000220181001120610.jpg&imgrefurl=https%3A%2F%2Fplayfm.cl%2Ftendencias%2Fno-lo-esperabamos-la-verdadera-y-macabra-historia-de-mulan-que-te&tbnid=jj2UT_vls7RTIM&vet=12ahUKEwj1v9iJ3Jj0AhUIuxQKHfgjDVkQxiAoAnoECAAQHQ..i&docid=lf64RKSuk5cbgM&w=580&h=360&itg=1&q=mulan%20images&ved=2ahUKEwj1v9iJ3Jj0AhUIuxQKHfgjDVkQxiAoAnoECAAQHQ",
          bio: "I have a plan",
        },
      ];
      const res = {
        json: jest.fn()
      };
      User.find = jest.fn().mockResolvedValue(users);
      await getUsers(null, res);

      expect(res.json).toHaveBeenCalledWith(users);
    })
  })
});

describe("Given the loginUser function", () => {
  describe("When it receives an incorrect username", () => {
    test("Then it should invoke the next function with an error", async () => {
      const req = {
        body: {
          username: "test",
        }
      };
      User.findOne = jest.fn().mockResolvedValue({});
      const res = {};
      const next = jest.fn();
      const error = new Error("Wrong credentials");

      await loginUser(req, res, next);

      expect(User.findOne).toHaveBeenCalled(); 
      expect(next).toHaveBeenCalledWith(error);
    })
  });

  describe("When it receives a correct username and an incorrect password", () => {
    test("Then it should invoke the next function with a 401 error", async ()=>{
      const req = {
        body: {
          username: "Lili",
          password: "Bad password", 
        },
      };
      const res = {};
      const next = jest.fn();
      User.findOne = jest.fn().mockResolvedValue({
        username: "Lili",
        password: "Claro",
      });
      bcrypt.compare = jest.fn().mockResolvedValue(false);
      const error = new Error("Wrong credentials");
      error.code = 401;

      await loginUser(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    })
  });

  describe("When it receives a request with valid username and valid password", () => {
    test("Then it should invoke the res.json function with the generated token", async () => {
      const req = {
        body: {
          username: "bubu",
          password: "bubulina",
        },
      };
      const res = {
        json: jest.fn()
      };
      const next = () => {};

      User.findOne = jest.fn().mockResolvedValue({username: "bubu", password: "bubulina"});
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue("pretty");
      const expectedResponse = {
        token: "pretty",
      };
      
      await loginUser(req, res, next);

      expect(res.json).toHaveBeenCalledWith(expectedResponse);

    })
  })
})