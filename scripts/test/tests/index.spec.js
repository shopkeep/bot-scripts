const mockSetupScript = jest.fn();
const mockGetArgs = jest.fn();

jest.mock("../../shared", () =>
  Object.assign(require.requireActual("../../shared"), {
    getBotDirectory: () => "foo",
    getArgs: mockGetArgs,
    setupScript: () => mockSetupScript
  })
);

describe("test script", function() {
  beforeEach(function() {
    jest.clearAllMocks();
    jest.resetModules();
  });

  describe("when no additional arguments", function() {
    beforeEach(function() {
      mockGetArgs.mockReturnValue([]);
      require("../"); // eslint-disable-line global-require
    });

    it("calls jest with the correct arguments", function() {
      expect(mockSetupScript.mock.calls.length).toBe(1);
      expect(mockSetupScript.mock.calls[0]).toEqual([
        [
          "foo",
          "--env",
          "node",
          "--setupFilesAfterEnv",
          expect.stringContaining("/bot-scripts/scripts/test/mock-logger.js")
        ]
      ]);
    });
  });

  describe("when additional flag argument passed", function() {
    beforeEach(function() {
      mockGetArgs.mockReturnValue(["--watch"]);
      require("../"); // eslint-disable-line global-require
    });

    it("calls jest with the correct arguments", function() {
      expect(mockSetupScript.mock.calls.length).toBe(1);
      expect(mockSetupScript.mock.calls[0]).toEqual([
        [
          "foo",
          "--env",
          "node",
          "--setupFilesAfterEnv",
          expect.stringContaining("/bot-scripts/scripts/test/mock-logger.js"),
          "--watch"
        ]
      ]);
    });
  });

  describe("when path argument passed", function() {
    beforeEach(function() {
      mockGetArgs.mockReturnValue(["/new/test/path"]);
      require("../"); // eslint-disable-line global-require
    });

    it("calls jest with the correct arguments", function() {
      expect(mockSetupScript.mock.calls.length).toBe(1);
      expect(mockSetupScript.mock.calls[0]).toEqual([
        [
          "/new/test/path",
          "--env",
          "node",
          "--setupFilesAfterEnv",
          expect.stringContaining("/bot-scripts/scripts/test/mock-logger.js")
        ]
      ]);
    });
  });

  describe("when mixture of arguments passed", function() {
    beforeEach(function() {
      mockGetArgs.mockReturnValue(["/new/test/path", "--watch"]);
      require("../"); // eslint-disable-line global-require
    });

    it("calls jest with the correct arguments", function() {
      expect(mockSetupScript.mock.calls.length).toBe(1);
      expect(mockSetupScript.mock.calls[0]).toEqual([
        [
          "/new/test/path",
          "--env",
          "node",
          "--setupFilesAfterEnv",
          expect.stringContaining("/bot-scripts/scripts/test/mock-logger.js"),
          "--watch"
        ]
      ]);
    });
  });
});
