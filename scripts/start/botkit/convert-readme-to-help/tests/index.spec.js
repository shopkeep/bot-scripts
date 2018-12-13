const convertReadmeToHelp = require("../");
const readmeData = require("./test-data/readme-data");

jest.mock("fs");
const fs = require("fs");

describe("convertReadmeToHelp", function() {
  let testContext;

  beforeEach(function() {
    jest.clearAllMocks();
    testContext = {};
    testContext.conversionPromise = convertReadmeToHelp("./", {
      Goodbye: ":point_left:"
    });
  });

  it("pulls in the readme", function() {
    expect(fs.readFile.mock.calls.length).toBe(1);
  });

  describe("when unable to get readme", function() {
    beforeEach(function() {
      fs.readFile.mock.calls[0][2](new Error("test error"));
    });

    it("provides an error", async function() {
      expect.assertions(1);

      try {
        await testContext.conversionPromise;
      } catch (e) {
        expect(e).toEqual(new Error("test error"));
      }
    });
  });

  describe("when able to get readme", function() {
    describe("but unable to parse readme", function() {
      beforeEach(function() {
        fs.readFile.mock.calls[0][2](null, "hello world");
      });

      it("provides an error message", async function() {
        expect.assertions(1);

        try {
          await testContext.conversionPromise;
        } catch (e) {
          expect(e).toEqual(new Error("Incompatible readme structure"));
        }
      });
    });

    describe("and able to parse readme", function() {
      beforeEach(function() {
        fs.readFile.mock.calls[0][2](null, readmeData);
      });

      it("provides an help message", async function() {
        expect(await testContext.conversionPromise).toMatchSnapshot();
      });
    });
  });
});
