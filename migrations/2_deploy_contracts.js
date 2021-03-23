const FJZToken = artifacts.require("FJZToken");
const DaiToken = artifacts.require("DaiToken");
const TokenFarm = artifacts.require("TokenFarm");

module.exports = async function(deployer, network, accounts) {

    await deployer.deploy(DaiToken)
    const daiToken = await DaiToken.deployed()

    await deployer.deploy(FJZToken)
    const fjzToken = await FJZToken.deployed()

    await deployer.deploy(TokenFarm, fjzToken.address, daiToken.address)
    const tokenFarm = await  TokenFarm.deployed()
    
    //Transfering the 1 million tokens to the TokenFarm
    await fjzToken.transfer(tokenFarm.address, '1000000000000000000000000')

    //Transferring 100 fake dai tokens to user
    await daiToken.transfer(accounts[1], '100000000000000000000')


};
