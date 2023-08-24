const hre = require("hardhat");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const initialMessage = "Your initial important message";
  const [deployer] = await ethers.getSigners();
  const ownerAddress = deployer.address;

  const Token = await ethers.getContractFactory("UndeletableMessage");
  const token = await Token.deploy(initialMessage, ownerAddress);
  await token.deployed();
  console.log(`UndeletableMessage deployed to: https://sepolia.etherscan.io/address/${token.address}`);

  console.log("Waiting 30 seconds before verifying the contract...");
  await sleep(30 * 1000);

  console.log("Verifying contract on Etherscan...");
  await hre.run("verify:verify", {
    address: token.address,
    constructorArguments: [initialMessage, ownerAddress],
    network: "goerli",
  });
  console.log("Contract verified on Etherscan");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });