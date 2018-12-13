const { isMaterialEmancipationGridRequiredFor } = require("./");

describe("utils", function() {
  describe("isMaterialEmancipationGridRequiredFor", function() {
    describe("when Material Emancipation Grid is required", function() {
      it("returns true", function() {
        const protocol = "with material emancipation grid";
        expect(isMaterialEmancipationGridRequiredFor(protocol)).toBe(true);
      });
    });

    describe("when Material Emancipation Grid is not required", function() {
      it("returns false", function() {
        const protocol = "with truth enhancement";
        expect(isMaterialEmancipationGridRequiredFor(protocol)).toBe(false);
      });
    });
  });
});
