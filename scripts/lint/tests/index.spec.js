const mockSetupScript = jest.fn();
const mockGetArgs = jest.fn();

jest.mock("../../shared", () =>
  Object.assign(require.requireActual("../../shared"), {
    getBotDirectory: () => "foo",
    getArgs: mockGetArgs,
    setupScript: () => mockSetupScript
  })
);

describe("lint script", function() {
  beforeEach(function() {
    jest.clearAllMocks();
    jest.resetModules();
  });

  describe("when no additional arguments", function() {
    beforeEach(function() {
      mockGetArgs.mockReturnValue([]);
      require("../"); // eslint-disable-line global-require
    });

    it("calls eslint with the correct arguments", function() {
      expect(mockSetupScript.mock.calls.length).toBe(1);
      expect(mockSetupScript.mock.calls[0]).toEqual([
        [
          expect.stringContaining("/bot-scripts/foo/src"),
          "--config",
          expect.stringContaining("/bot-scripts/scripts/lint/eslintrc.json")
        ]
      ]);
    });
  });

  describe("when additional flag argument passed", function() {
    beforeEach(function() {
      mockGetArgs.mockReturnValue(["--fix"]);
      require("../"); // eslint-disable-line global-require
    });

    it("calls eslint with the correct arguments", function() {
      expect(mockSetupScript.mock.calls.length).toBe(1);
      expect(mockSetupScript.mock.calls[0]).toEqual([
        [
          expect.stringContaining("/bot-scripts/foo/src"),
          "--config",
          expect.stringContaining("/bot-scripts/scripts/lint/eslintrc.json"),
          "--fix"
        ]
      ]);
    });
  });

  describe("when path argument passed", function() {
    beforeEach(function() {
      mockGetArgs.mockReturnValue(["/new/lint/path"]);
      require("../"); // eslint-disable-line global-require
    });

    it("calls eslint with the correct arguments", function() {
      expect(mockSetupScript.mock.calls.length).toBe(1);
      expect(mockSetupScript.mock.calls[0]).toEqual([
        [
          "/new/lint/path",
          "--config",
          expect.stringContaining("/bot-scripts/scripts/lint/eslintrc.json")
        ]
      ]);
    });
  });

  describe("when mixture of arguments passed", function() {
    beforeEach(function() {
      mockGetArgs.mockReturnValue(["/new/lint/path", "--fix"]);
      require("../"); // eslint-disable-line global-require
    });

    it("calls eslint with the correct arguments", function() {
      expect(mockSetupScript.mock.calls.length).toBe(1);
      expect(mockSetupScript.mock.calls[0]).toEqual([
        [
          "/new/lint/path",
          "--config",
          expect.stringContaining("/bot-scripts/scripts/lint/eslintrc.json"),
          "--fix"
        ]
      ]);
    });
  });
});
