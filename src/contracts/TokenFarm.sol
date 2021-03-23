pragma solidity ^0.5.0;

import "./FJZToken.sol";
import "./DaiToken.sol";


contract TokenFarm{

    string public name = "FJZ Token Farm";
    address public owner;
    FJZToken public fjzToken;
    DaiToken public daiToken;
    address[] public stackers; 
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

   
    
    constructor(FJZToken _fjzToken, DaiToken _daiToken) public {
        fjzToken =_fjzToken;
        daiToken =_daiToken;
        owner = msg.sender;
    }

    // Stake Tokens 
    function stakeTokens(uint _amount) public {
        //require amount greater than 0
        require(_amount > 0, "amount cannot be 0");
        //transfer fake tokens to this contract for stacking
        daiToken.transferFrom(msg.sender, address(this), _amount);

        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        //add stackers to stackers array
        if(!hasStaked[msg.sender]){
            stackers.push(msg.sender);
        }

        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
        

    }

    //Unstacking Tokens
    function unstakeTokens() public {
        uint balance = stakingBalance[msg.sender];

        require(balance>0, 'staking balance cannot be 0');
        daiToken.transfer(msg.sender, balance);

        stakingBalance[msg.sender]=0;

        isStaking[msg.sender] = false;
    }

    //Issuing Tokens
    function issueTokens() public {
        //only owner can issue tokens
        require(msg.sender==owner, "Caller has to be the owner");

        //issue tokens to all stakers
        for (uint i=0; i<stackers.length;i++ ){
            address recipient = stackers[i];
            uint balance = stakingBalance[recipient];
            if(balance>0){
                fjzToken.transfer(recipient, balance);
            }
        }
    }






}
