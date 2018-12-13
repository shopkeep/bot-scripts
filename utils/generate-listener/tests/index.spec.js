const generateListener = require("../");

describe("generate-listener", function() {
  let testContext;

  beforeEach(function() {
    testContext = {};
    testContext.botNameMock = "test-bot-name";
    testContext.controllerHearsStub = jest.fn();
    testContext.controllerMock = { hears: testContext.controllerHearsStub };
    testContext.meansMock = ["test-means"];
  });

  it("is a function", function() {
    expect(generateListener).toEqual(expect.any(Function));
  });

  describe("generated listener", function() {
    beforeEach(function() {
      testContext.handlerStub = jest.fn();
      testContext.generatedListener = generateListener(
        testContext.botNameMock,
        testContext.controllerMock,
        testContext.meansMock
      );
    });

    it("is a function", function() {
      expect(testContext.generatedListener).toEqual(expect.any(Function));
    });

    it("binds two listeners", function() {
      testContext.generatedListener("hello", testContext.handlerStub);
      expect(testContext.controllerHearsStub.mock.calls.length).toBe(2);
    });

    it("binds a specified listener", function() {
      testContext.generatedListener("hello", testContext.handlerStub);
      expect(testContext.controllerHearsStub.mock.calls[0]).toEqual([
        /^hello$/i,
        testContext.meansMock,
        expect.any(Function)
      ]);
    });

    it("binds an ambient listener", function() {
      testContext.generatedListener("hello", testContext.handlerStub);
      expect(testContext.controllerHearsStub.mock.calls[1]).toEqual([
        /test-bot-name hello$/i,
        "ambient",
        expect.any(Function)
      ]);
    });
  });
});
