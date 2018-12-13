global.process.on = jest.fn();
global.process.exit = jest.fn();
console.error = jest.fn(); // eslint-disable-line no-console

let result;
const mockSpawnSync = jest.fn(() => result);
jest.mock("cross-spawn", () => ({ sync: mockSpawnSync }));
jest.mock("../../utils", () => ({
  getBotDirectory: () => "foo",
  getArgs: () => ["--fix"]
}));

describe("lint script", function() {
  beforeEach(function() {
    jest.clearAllMocks();
    jest.resetModules();
    result = {};
  });

  describe("script success", function() {
    beforeEach(function() {
      result.status = 0;
      require("../"); // eslint-disable-line global-require
    });

    it("calls eslint with the correct arguments", function() {
      expect(mockSpawnSync.mock.calls.length).toBe(1);
      expect(mockSpawnSync.mock.calls[0]).toEqual([
        expect.stringContaining(
          "/bot-scripts/node_modules/eslint/bin/eslint.js"
        ),
        [
          expect.stringContaining("/bot-scripts/foo/src"),
          "--config",
          expect.stringContaining("/bot-scripts/scripts/lint/eslintrc.json"),
          "--fix"
        ],
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
      result.signal = true;
      require("../"); // eslint-disable-line global-require
    });

    it("exits with failure", function() {
      expect(process.exit.mock.calls.length).toBe(2);
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });

  describe("script error", function() {
    beforeEach(function() {
      result.error = true;
      require("../"); // eslint-disable-line global-require
    });

    it("exits with failure", function() {
      expect(process.exit.mock.calls.length).toBe(2);
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });
});
