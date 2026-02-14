// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

contract lotteryGame is VRFConsumerBaseV2Plus {
    uint public constant ENTRY_FEE = 0.000000000000000001 ether;
    uint8[7] public winningNumbers;
    uint public roundStartTime;
    uint constant ROUND_DURATION = 5 minutes;
    bool public lotteryOpen;

    struct Ticket {
        address player;
        uint8[7] numbers;
    }
    Ticket[] public tickets;
    mapping(address => uint) public pendingRewards;

    // VRF
    bytes32 public keyHash = 0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae;
    uint256 public subscriptionId = 13168769024327207748906946501962927677918452239861740502138561102184179347810;
    uint32 public callbackGasLimit = 700_000;
    uint16 public requestConfirmations = 3;
    uint32 public numWords = 7;

    event TicketPurchased(address indexed player);
    event WinningNumbersGenerated(uint8[7] numbers);
    event RewardClaimed(address indexed player, uint amount);

    constructor()
        VRFConsumerBaseV2Plus(0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B)
    {
        lotteryOpen = false;
    }

    function buyTicket(uint8[7] memory numbers) external payable {
        require(msg.value == ENTRY_FEE, "Wrong fee");

        // If first ticket, start the round
        if (!lotteryOpen) {
            lotteryOpen = true;
            roundStartTime = block.timestamp;
        }

        // If round expired, close it and request VRF
        if (lotteryOpen && block.timestamp > roundStartTime + ROUND_DURATION) {
            lotteryOpen = false;
            requestWinningNumbers(true);
            return; // this ticket will go to next round
        }

        // Validate numbers
        for (uint i=0; i<7; i++) {
            require(numbers[i] >= 1 && numbers[i] <= 47, "Invalid number");
        }

        tickets.push(Ticket(msg.sender, numbers));
        emit TicketPurchased(msg.sender);
    }

    function requestWinningNumbers(bool enableNativePayment) internal {
        s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: keyHash,
                subId: subscriptionId,
                requestConfirmations: requestConfirmations,
                callbackGasLimit: callbackGasLimit,
                numWords: numWords,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({nativePayment: enableNativePayment})
                )
            })
        );
    }

    function fulfillRandomWords(uint256, uint256[] calldata randomWords) internal override {
        // Generate winning numbers
        for (uint i=0; i<7; i++) {
            winningNumbers[i] = uint8((randomWords[i] % 47) + 1);
        }
        emit WinningNumbersGenerated(winningNumbers);

        distributeRewards();
    }

    function distributeRewards() internal {
        uint totalPool = address(this).balance;
        uint ownerFee = (totalPool * 10) / 100;
        payable(owner()).transfer(ownerFee);

        uint prizePool = totalPool - ownerFee;
        uint[8] memory matchCount;

        for (uint i=0; i<tickets.length; i++) {
            uint matches = countMatches(tickets[i].numbers);
            if (matches >= 2) matchCount[matches]++;
        }

        for (uint i=0; i<tickets.length; i++) {
            uint matches = countMatches(tickets[i].numbers);
            if (matches >= 2 && matchCount[matches] > 0) {
                uint reward = (prizePool * getPercentage(matches)) / 100 / matchCount[matches];
                pendingRewards[tickets[i].player] += reward;
            }
        }

        delete tickets;
        lotteryOpen = false;
    }

    function claimReward() external {
        uint reward = pendingRewards[msg.sender];
        require(reward > 0, "No reward");
        pendingRewards[msg.sender] = 0;
        payable(msg.sender).transfer(reward);
        emit RewardClaimed(msg.sender, reward);
    }

    function countMatches(uint8[7] memory numbers) internal view returns (uint) {
        uint matches;
        for (uint i=0; i<7; i++) {
            if (numbers[i] == winningNumbers[i]) matches++;
        }
        return matches;
    }

    function getPercentage(uint matches) internal pure returns (uint) {
        uint256[8] memory percentages = [uint256(0), 0, 5, 10, 15, 20, 20, 30];
        return percentages[matches];
    }

    receive() external payable {}
}
