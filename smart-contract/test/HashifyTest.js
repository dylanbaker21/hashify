const Hashify = artifacts.require("Hashify");
const Register = artifacts.require("Register");
const Proxy = artifacts.require("Proxy");
const {
  BN,
  constants,
  expectEvent,
  shouldFail
} = require("openzeppelin-test-helpers");

const mode = process.env.MODE;

let hashifyInstance;
let registerInstance;
let proxyInstance;
let hashifyByProxy;

contract("Hashify", accounts => {
  before(async function() {
    hashifyInstance = await Hashify.new();
    registerInstance = await Register.new();
    proxyInstance = await Proxy.new(registerInstance.address);
    hashifyByProxy = await Hashify.at(proxyInstance.address);
  });

  after("write coverage/profiler output", async () => {
    if (mode === "profile") {
      await global.profilerSubprovider.writeProfilerOutputAsync();
    } else if (mode === "coverage") {
      await global.coverageSubprovider.writeCoverageAsync();
    }
  });

  it("Hashify owner = address that deployed", async () => {
    assert.equal(
      await hashifyInstance.owner(),
      accounts[0],
      "Owner isn't address 0 (msg.sender)"
    );
  });

  it("Register owner = address that deployed", async () => {
    assert.equal(
      await registerInstance.owner(),
      accounts[0],
      "Owner isn't address 0 (msg.sender)"
    );
  });

  it("Revert if call goes through when version not set", async () => {
    await shouldFail(registerInstance.getLatestVersion());
  });

  it("Set Hashify instance in the register contract", async () => {
    await registerInstance.setNewVersion(hashifyInstance.address);
    assert.equal(
      await registerInstance.getLatestVersion(),
      hashifyInstance.address,
      "Latest Hashify instance in register contract isn't hashify's address"
    );
  });

  it("Fail to set Hashify instance in the register contract to an EOA", async () => {
    await shouldFail(registerInstance.setNewVersion(accounts[1]));
    assert.equal(
      await registerInstance.getLatestVersion(),
      hashifyInstance.address,
      "Set hashify instance to a non-contract address"
    );
  });

  it("Fail to let non-owner change Hashify instance in register", async () => {
    await shouldFail(
      registerInstance.setNewVersion(hashifyInstance.address, {
        from: accounts[1]
      })
    );
    assert.equal(
      await registerInstance.getLatestVersion(),
      hashifyInstance.address,
      "Non owner set hashify instance in register contract"
    );
  });

  it("Add hash", async () => {
    const { logs } = await hashifyByProxy.addHash(
      "0xca35b7d915458ef540ade6068dfe2f44e8fa733c"
    );
    expectEvent.inLogs(logs, "HashAdded", {
      hash:
        "0xca35b7d915458ef540ade6068dfe2f44e8fa733c000000000000000000000000",
      index: "0",
      account: accounts[0]
    });
  });

  it("Get hash info", async () => {
    const { logs } = await hashifyByProxy.getHashInfo(accounts[0], 0);
    expectEvent.inLogs(logs, "HashInfo", {
      hash:
        "0xca35b7d915458ef540ade6068dfe2f44e8fa733c000000000000000000000000",
      verified: false,
      block: "0",
      v: "0",
      r: "0x0000000000000000000000000000000000000000000000000000000000000000",
      s: "0x0000000000000000000000000000000000000000000000000000000000000000"
    });
  });

  it("Get hashes", async () => {
    const { logs } = await hashifyByProxy.getHashes();

    assert.equal(
      logs[0].args.hashes[0],
      "0xca35b7d915458ef540ade6068dfe2f44e8fa733c000000000000000000000000",
      "Hash that was added wasn't retrieved"
    );
  });

  it("Register Verification", async () => {
    const { logs } = await hashifyByProxy.registerVerification(
      0,
      28,
      "0xde848681629b45c2544072bce5f5066e979f70f1e7a3924c93d9fcd05ca64712",
      "0x14a049134c6cfe40c166113890ee72bb53a53a0aa0d46406e6c3b21a42922369"
    );
    let block = await web3.eth.getBlock("latest");
    expectEvent.inLogs(logs, "HashVerified", {
      hash:
        "0xca35b7d915458ef540ade6068dfe2f44e8fa733c000000000000000000000000",
      block: block.number.toString(),
      account: accounts[0]
    });
  });

  it("Pass invalid data and fail verification", async () => {
    await shouldFail(
      hashifyByProxy.registerVerification(
        0,
        25,
        "0xde848681629b45c2544072bce5f5066e979f70f1e7a3924c93d9fcd05ca64712",
        "0x14a049134c6cfe40c166113890ee72bb53a53a0aa0d46406e6c3b21a42922369"
      )
    );
  });

  it("Add second hash", async () => {
    const { logs } = await hashifyByProxy.addHash(
      "0x14723a09acff6d2a60dcdf7aa4aff308fddc160c"
    );
    expectEvent.inLogs(logs, "HashAdded", {
      hash:
        "0x14723a09acff6d2a60dcdf7aa4aff308fddc160c000000000000000000000000",
      index: "1",
      account: accounts[0]
    });
  });

  it("Delete the first Hash", async () => {
    const { logs } = await hashifyByProxy.deleteHash(0);
    expectEvent.inLogs(logs, "HashDeleted", {
      account: accounts[0],
      hash: "0xca35b7d915458ef540ade6068dfe2f44e8fa733c000000000000000000000000"
    });
  });

  it("Fail to delete hash given improper index", async () => {
    await shouldFail(hashifyByProxy.deleteHash(20));
  });
});
