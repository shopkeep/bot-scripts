global.process.on = jest.fn();
global.process.exit = jest.fn();
console.error = jest.fn(); // eslint-disable-line no-console

const mockSpawnSync = jest.fn();
jest.mock("cross-spawn", () => ({ sync: mockSpawnSync }));
jest.mock("test-tool");

const {
  getArgs,
  getBotDirectory,
  startsWithPath,
  setupScript
} = require("../");

describe("shared task utils", function() {
  let testContext;

  beforeEach(function() {
    jest.clearAllMocks();
    jest.resetModules();
    testContext = {};
  });

  describe("getArgs", function() {
    beforeEach(function() {
      global.process.argv = ["node-process", "file-path", "hello", "world"];
    });

    it("returns list of arguments", function() {
      expect(getArgs()).toEqual(["hello", "world"]);
    });
  });

  describe("getBotDirectory", function() {
    it("returns bot directory", function() {
      expect(getBotDirectory()).toEqual(
        expect.stringMatching(/\/bot-scripts$/)
      );
    });
  });

  describe("startsWithPath", function() {
    describe("empty arguments", function() {
      beforeEach(function() {
        testContext.args = [];
      });

      it("returns false", function() {
        expect(startsWithPath(testContext.args)).toBe(false);
      });
    });

    describe("flag arguments", function() {
      beforeEach(function() {
        testContext.args = ["--watch", "--fix"];
      });

      it("returns false", function() {
        expect(startsWithPath(testContext.args)).toBe(false);
      });
    });

    describe("arguments with leading path", function() {
      beforeEach(function() {
        testContext.args = ["/path/to/file", "--fix"];
      });

      it("returns true", function() {
        expect(startsWithPath(testContext.args)).toBe(true);
      });
    });

    describe("arguments which include path", function() {
      beforeEach(function() {
        testContext.args = ["--watch", "/path/to/file ", "--fix"];
      });

      it("returns true", function() {
        expect(startsWithPath(testContext.args)).toBe(false);
      });
    });
  });

  describe("setupScript", function() {
    beforeEach(function() {
      testContext.scriptExecutor = setupScript("test-tool");
    });

    describe("script success", function() {
      beforeEach(function() {
        mockSpawnSync.mockReturnValue({ status: 0 });
        testContext.scriptExecutor(["foo"]);
      });

      it("calls eslint with the correct arguments", function() {
        expect(mockSpawnSync.mock.calls.length).toBe(1);
        expect(mockSpawnSync.mock.calls[0]).toEqual([
          expect.stringContaining("/test-tool/bin/test-tool.js"),
          ["foo"],
          { stdio: "inherit" }
        ]);
      });

      it("exits with success", function() {
        expect(process.exit.mock.calls.length).toBe(1);
        expect(process.exit).toHaveBeenCalledWith(0);
      });
    });

    describe("script interupted", function() {
      beforeEach(function() {
        mockSpawnSync.mockReturnValue({ signal: true });
        testContext.scriptExecutor(["foo"]);
      });

      it("exits with failure", function() {
        expect(process.exit.mock.calls.length).toBe(2);
        expect(process.exit).toHaveBeenCalledWith(1);
      });
    });

    describe("script error", function() {
      beforeEach(function() {
        mockSpawnSync.mockReturnValue({ error: true });
        testContext.scriptExecutor(["foo"]);
      });

      it("exits with failure", function() {
        expect(process.exit.mock.calls.length).toBe(2);
        expect(process.exit).toHaveBeenCalledWith(1);
      });
    });
  });
});
