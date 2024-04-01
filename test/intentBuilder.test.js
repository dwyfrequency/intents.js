import { ethers } from "ethers";
import sinon from "sinon";
import { expect } from "chai";
import { IntentBuilder } from "../src/index"; 


describe("IntentBuilder", () => {
  let providerStub, contractStub;

  beforeEach(() => {
    // Setup provider stub
    providerStub = sinon.stub(ethers.providers, "JsonRpcProvider").returns({
      getContract: () => contractStub,
    });

    // Setup contract stub with mock getNonce method
    contractStub = {
      getNonce: sinon.stub().resolves("1"), // Example nonce return value
    };
  });

  afterEach(() => {
    sinon.restore(); // Restore all stubs
  });

  describe("getNonce", () => {
    it("should retrieve and log the nonce for a given sender", async () => {
      const intentBuilder = new IntentBuilder();
      const nonce = await intentBuilder.getNonce("senderAddress", "nodeUrl");

      expect(nonce).to.equal("1");
      expect(contractStub.getNonce.calledWith("senderAddress", "0")).to.be.true;
    });
  });

  // Include more tests...
});
