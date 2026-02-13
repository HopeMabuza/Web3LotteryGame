require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const lotteryFactory = await ethers.getContractFactory("lotteryGame");

  const lottery = await lotteryFactory.deploy(
    process.env.VRF_COORDINATOR,
    process.env.KEY_HASH,
    Number(process.env.SUBSCRIPTION_ID)
  );

  await lottery.deployed();

  console.log("Lottery deployed to:", lottery.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
