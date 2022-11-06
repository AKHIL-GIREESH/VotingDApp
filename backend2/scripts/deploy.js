const {ethers} = require("hardhat");

async function main(){
  const votingSystem = await ethers.getContractFactory("votingSystem");
  const deployedVotingSystem = await votingSystem.deploy();
  await deployedVotingSystem.deployed();
  console.log("votingSystem Contract Address: ",deployedVotingSystem.address);
  console.log(deployedVotingSystem);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});