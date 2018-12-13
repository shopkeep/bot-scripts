const outputError = require("../");

describe("output-error", function() {
  let testContext;

  beforeEach(function() {
    testContext = {};
    testContext.botReplyStub = jest.fn();
    testContext.botMock = { reply: testContext.botReplyStub };
    testContext.messageMock = { isMessageMock: true };
    testContext.errMock = "Mock Error Message";
  });

  it("is a function", function() {
    expect(outputError).toEqual(expect.any(Function));
  });

  it("outputs error message", function() {
    outputError(
      testContext.botMock,
      testContext.messageMock,
      testContext.errMock
    );
    expect(testContext.botReplyStub.mock.calls.length).toBe(1);
    expect(testContext.botReplyStub.mock.calls[0]).toEqual([
      testContext.messageMock,
      ":dizzy_face: Sorry, there was an error with your command :exclamation: Error received:\n```\nMock Error Message\n```"
    ]);
  });
});
