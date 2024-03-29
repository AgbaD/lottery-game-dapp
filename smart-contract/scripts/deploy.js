const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });
const { FEE, VRF_COORDINATOR, LINK_TOKEN, KEY_HASH } = require("../constants");

async function main() {
  const randomWinnerGame = await ethers.getContractFactory("RandomWinnerGame");
  const deployedRandomWinnerGame = await randomWinnerGame.deploy(
    VRF_COORDINATOR, LINK_TOKEN,
    KEY_HASH, FEE
  )
  await deployedRandomWinnerGame.deployed();
  console.log("RandomWinnerGame CA: " + deployedRandomWinnerGame.address);

  // Wait for etherscan to notice that the contract has been deployed
  console.log("Sleeping...")
  await sleep(30000);

  await hre.run("verify:verify", {
    address: deployedRandomWinnerGame.address,
    constructorArguments: [VRF_COORDINATOR, LINK_TOKEN, KEY_HASH, FEE],
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main()
  .then(() => process.exit(1))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })