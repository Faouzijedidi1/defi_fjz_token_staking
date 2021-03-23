import React, { Component } from 'react'
import dai from '../dai.png'

class Main extends Component {


  render() {
    return (

      <div id="content" className="mt-3">
          <h1 className="font-weight-bold text-center mb-4">Let's Stake Some Coiiiiiins!</h1>
        <p className="text-justify  text-muted">All blockchains have one thing in common: transactions need to get validated. Other than Bitcoin's Proof of Work (PoW), 
            There are other consensus mechanisms that are used for validation. Proof-of-Stake (PoS) is one such consensus mechanism that has several variations of its own, 
            as well as some hybrid models. To simplify, we can refer to all of these as staking. Coin staking gives currency holders some decision power on the network. 
            By staking coins, you gain the ability to vote and generate an income. It is quite similar to how someone would receive interest for holding money in a bank account 
            or giving it to the bank to invest. </p>
          <table className="table table-borderless text-muted text-center">
            <thead>
                <tr>
                <th scope="col">Staking Balance</th>
                <th scope="col">Reward Balance</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td>{window.web3.utils.fromWei(this.props.stakingBalance,'Ether')} fDAI</td>
                <td>{window.web3.utils.fromWei(this.props.fjzTokenBalance,'Ether')} FJZ</td>
                </tr>
            </tbody>
        </table>

        <div className="card mb-4">
            <div className="card-body">
                <form className="mb-3" onSubmit={(event)=>{
                  event.preventDefault()
                  let amount
                  amount = this.input.value.toString()
                  console.log(amount)
                  amount = window.web3.utils.toWei(amount,'Ether')
                  this.props.stakeTokens(amount)
                }}>
                    <div>
                        <label className="float-left"><b>Stake Tokens</b></label>
                        <span className="float-right text-muted">
                          <b>Available fDAI Balance: <span style={{color: "black", fontSize:21}}>{window.web3.utils.fromWei(this.props.daiTokenBalance, 'Ether')}</span></b>
                        </span>
                    </div>
                    <div className="input-group mb-4">
                        <input
                            type="text"
                            ref={(input)=>{this.input=input}}
                            className="form-control form-control-lg"
                            placeholder="0"
                            required
                        />
                        <div className="input-group-append">
                            <div className="input-group-text">
                                <img src={dai} height='32' alt='dai'/>
                                &nbsp;&nbsp;&nbsp; fDAI
                            </div>

                        </div>

                    </div>
                    <button type="submit" className="btn btn-primary btn-block btn-lg">STAKE NOW!</button>

                </form>

                <button type="submit" className="btn btn-primary btn-block btn-lg"
                onClick={(event)=>{
                  event.preventDefault()
                  this.props.unstakeTokens()
                }}
                >Unstake All tokens!</button>
            </div>
        </div>
      </div>
    );
  }
}

export default Main;
