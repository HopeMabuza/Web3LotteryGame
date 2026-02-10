// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract lotteryGame {
    //state variables
    address public owner;//contract must know who perfoms administrative actions, e.g trigerring the ChainLink
    uint256 public  ticketPrice = 0.00002 ether;//constant ticket price, will be used to calculations for reward distribution
    uint256 public cuurentRound;//keeps track of data of each round
    bool public roundOpen;//restricts the time for buying tickets for each round
    uint256 public totalPoolAMount;//total of the current pool



    

}