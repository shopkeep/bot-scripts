const getUser = require("../");

describe("get-user", function() {
  let testContext;

  it("is a function", function() {
    expect(getUser).toEqual(expect.any(Function));
  });

  describe("when called", function() {
    beforeEach(function() {
      testContext = {};
      testContext.userInfoMock = jest.fn();
      testContext.bot = { api: { users: { info: testContext.userInfoMock } } };
      testContext.getUserPromise = getUser(testContext.bot, "test-user");
    });

    it("calls bot api", function() {
      expect(testContext.userInfoMock.mock.calls.length).toBe(1);
      expect(testContext.userInfoMock.mock.calls[0][0]).toEqual({
        user: "test-user"
      });
    });

    describe("and user info is not available", function() {
      beforeEach(function() {
        const responseHandler = testContext.userInfoMock.mock.calls[0][1];
        responseHandler(new Error("test error"));
      });

      it("provides a user object", async function() {
        expect.assertions(1);

        try {
          await testContext.getUserPromise;
        } catch (e) {
          expect(e).toEqual(new Error("test error"));
        }
      });
    });

    describe("and user info is available", function() {
      beforeEach(function() {
        const responseHandler = testContext.userInfoMock.mock.calls[0][1];
        responseHandler(null, {
          user: {
            id: "123",
            real_name: "Joe Bloggs",
            name: "Joe",
            tz: "America/New_York",
            profile: {
              email: "joe.bloggs@example.com",
              image_512: "http://www.example.com/avatars/joe_bloggs.jpg"
            }
          }
        });
      });

      it("provides a user object", async function() {
        expect(await testContext.getUserPromise).toMatchSnapshot();
      });
    });
  });
});
