const auth = require("./userMiddleware");
const jwt = require("jsonwebtoken");

jest.mock("jsonwebtoken");

describe("Given the auth middleware", () => {
  describe("When it receives a request without the Authorization header", () => {
    test("Then it should invoke the next function with a 401 error", async () => {
      const req = {
        header: jest.fn()
      };
      const res = {
        json: jest.fn()
      };
      const next = jest.fn();
      const expectedError = new Error("Not authorized");
      expectedError.code = 401;

      await auth(req, res, next);

      expect(next).toHaveBeenCalledWith(expectedError);

    })
  })
})