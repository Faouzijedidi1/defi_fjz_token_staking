const { assert } = require('chai');

const FJZToken = artifacts.require("FJZToken");
const DaiToken = artifacts.require("DaiToken");
const TokenFarm = artifacts.require("TokenFarm");

require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokens(n){
    return web3.utils.toWei(n,'ether')
}
contract('TokenFarm',([owner,investor])=>{

    let daiToken, fjzToken,tokenFarm
    before(async ()=>{
         daiToken = await DaiToken.new()
         fjzToken = await FJZToken.new()
         tokenFarm = await TokenFarm.new(fjzToken.address,daiToken.address)

         //transfer tokens to tokenFarm 
         await fjzToken.transfer(tokenFarm.address, tokens('1000000'))

         //transfer investor tokens
         await daiToken.transfer(investor, tokens('100'), { from: owner })
    })
 
    //test dai
    describe('Fake Dai Deployment', async ()=>{
        it('has a name', async ()=>{
            const name = await daiToken.name()
            assert.equal(name, 'Fake DAI Token')
        })
    })

    describe('FJZ Token Deployment', async ()=>{
        it('has a name', async ()=>{
            const name = await fjzToken.name()
            assert.equal(name, 'FJZ Token')
        })
    })

    describe('Token Farm Deployment', async ()=>{
        it('has a name', async ()=>{
            const name = await tokenFarm.name()
            assert.equal(name, 'FJZ Token Farm')
        })

        it('contract has tokens', async ()=>{
            let balance = await fjzToken.balanceOf(tokenFarm.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })

    describe('Farming Tokens', async ()=>{
        it('rewarding investors for stacking fDai tokens', async ()=>{
            let result

            //check balance before stacking
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'investor fake Dai wallet balance correct before stacking')

            //approval
            await daiToken.approve(tokenFarm.address, tokens('100'),{ from: investor})
            //Stake Tokens
            await tokenFarm.stakeTokens(tokens('100'), { from: investor})

            //check balance after stacking
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('0'), 'investor fake Dai wallet balance correct After stacking')

            //check Stacked Balance
            result = await daiToken.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens('100'), 'Token Farm fake Dai wallet balance correct After stacking')

            //check stacking Balance
            result = await tokenFarm.stakingBalance(investor)
            assert.equal(result.toString(), tokens('100'), 'investor stacking balance correct After stacking')

            result = await tokenFarm.isStaking(investor)
            assert.equal(result.toString(), 'true', 'investor stacking status correct after stacking')

            //issue tokens
            await tokenFarm.issueTokens({ from: owner})

            //check balance after issuing
            result = await fjzToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'investor FJZ tokens balance correct after issuing')

             //ensure only owner can call issueTokens
             await tokenFarm.issueTokens({ from:investor }).should.be.rejected;

             //unstake tokens
             await tokenFarm.unstakeTokens({ from: investor})

            //check Balance after unstaking
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'investor fake Dai wallet balance correct After unstacking')

            //check tokenFarm Balance
            result = await daiToken.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens('0'), 'Token Farm fake Dai wallet balance correct After unstaking')

            //check investor tokenFarm Balance
            result = await tokenFarm.stakingBalance(investor)
            assert.equal(result.toString(), tokens('0'), 'investor stacking balance correct After unstaking')

            result = await tokenFarm.isStaking(investor)
            assert.equal(result.toString(), 'false', 'investor stacking status correct after unstacking')
        })
    })

})