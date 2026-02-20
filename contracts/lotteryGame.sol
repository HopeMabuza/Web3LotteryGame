// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

contract lotteryGame is VRFConsumerBaseV2Plus {

    uint public constant ENTRY_FEE = 0.000000000000000001 ether;
    uint public constant ROUND_DURATION = 5 minutes;

    uint8[7] public winningNumbers; // stored winning numbers (sorted, unique)
    uint public roundStartTime;
    bool public lotteryOpen;

    struct Ticket {
        address player;
        uint256 packedNumbers; 
    }

    Ticket[] public tickets;
    mapping(address => uint) public pendingRewards;

    bytes32 public keyHash =
        0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae;

    uint256 public subscriptionId;
    uint32 public callbackGasLimit = 2_500_000;
    uint16 public requestConfirmations = 3;
    uint32 public numWords = 7;

    struct RequestStatus {
        bool fulfilled;
        bool exists;
    }

    mapping(uint256 => RequestStatus) public s_requests;
    uint256 public lastRequestId;

    event TicketPurchased(address indexed player);
    event RequestSent(uint256 requestId);
    event WinningNumbersGenerated(uint8[7] numbers);
    event RewardClaimed(address indexed player, uint amount);

    constructor(uint256 _subscriptionId)
        VRFConsumerBaseV2Plus(0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B)
    {
        subscriptionId = _subscriptionId;
    }

    //buy ticket
    function buyTicket(uint8[7] memory numbers) external payable {
        require(msg.value == ENTRY_FEE, "Wrong fee");

        // Start round if first ticket
        if (!lotteryOpen) {
            lotteryOpen = true;
            roundStartTime = block.timestamp;
        }

        require(block.timestamp <= roundStartTime + ROUND_DURATION, "Round ended");

        // Validate numbers
        for (uint i = 0; i < 7; i++) {
            require(numbers[i] >= 1 && numbers[i] <= 49, "Invalid number");
        }

        // Pack numbers into a single uint256
        uint256 packed;
        for (uint i = 0; i < 7; i++) {
            packed |= uint256(numbers[i]) << (i * 8); // 8 bits per number
        }

        tickets.push(Ticket(msg.sender, packed));
        emit TicketPurchased(msg.sender);
    }

    //get winner
    function drawWinner() external onlyOwner returns (uint256 requestId) {
        require(lotteryOpen, "Lottery not open");
        require(block.timestamp >= roundStartTime + ROUND_DURATION, "Round not finished");
        require(tickets.length > 0, "No players");

        lotteryOpen = false;

        requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: keyHash,
                subId: subscriptionId,
                requestConfirmations: requestConfirmations,
                callbackGasLimit: callbackGasLimit,
                numWords: numWords,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
                )
            })
        );

        s_requests[requestId] = RequestStatus({fulfilled: false, exists: true});
        lastRequestId = requestId;
        emit RequestSent(requestId);
        return requestId;
    }

    //call VRF
    function fulfillRandomWords(uint256 requestId, uint256[] calldata randomWords) internal override {
        require(s_requests[requestId].exists, "Request not found");
        s_requests[requestId].fulfilled = true;

        uint8[7] memory tempNumbers;

        //get winning numbers without duplicates
        uint8 count = 0;
        for (uint i = 0; i < randomWords.length; i++) {
            uint8 num = uint8((randomWords[i] % 49) + 1);
            // check uniqueness
            bool exists = false;
            for (uint j = 0; j < count; j++) {
                if (tempNumbers[j] == num) {
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                tempNumbers[count] = num;
                count++;
            }
            if (count == 7) break; // stop when we have 7 unique numbers
        }

       //sort numbers from smallest to biggest
        for (uint i = 0; i < 6; i++) {
            for (uint j = i + 1; j < 7; j++) {
                if (tempNumbers[i] > tempNumbers[j]) {
                    uint8 tmp = tempNumbers[i];
                    tempNumbers[i] = tempNumbers[j];
                    tempNumbers[j] = tmp;
                }
            }
        }

        // Store final winning numbers
        for (uint i = 0; i < 7; i++) {
            winningNumbers[i] = tempNumbers[i];
        }

        emit WinningNumbersGenerated(winningNumbers);

       //calculate pending rewards
        distributeRewards();
    }

    //reward logic
    function distributeRewards() internal {
        uint totalPool = address(this).balance;

        // 10% owner fee
        uint ownerFee = (totalPool * 10) / 100;
        (bool sent, ) = payable(owner()).call{value: ownerFee}("");
        require(sent, "Owner fee transfer failed");

        uint prizePool = totalPool - ownerFee;
        uint[8] memory matchCount;

        // First pass: count winners per tier
        for (uint i = 0; i < tickets.length; i++) {
            uint matches = countMatchesPacked(tickets[i].packedNumbers);
            if (matches >= 2) {
                matchCount[matches]++;
            }
        }

        // Second pass: assign pending rewards
        for (uint i = 0; i < tickets.length; i++) {
            uint matches = countMatchesPacked(tickets[i].packedNumbers);
            if (matches >= 2 && matchCount[matches] > 0) {
                uint reward = (prizePool * getPercentage(matches)) / 100 / matchCount[matches];
                pendingRewards[tickets[i].player] += reward;
            }
        }

        delete tickets;
        lotteryOpen = false;
    }

    //get reward
    function claimReward() external {
        uint reward = pendingRewards[msg.sender];
        require(reward > 0, "No reward");
        pendingRewards[msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: reward}("");
        require(success, "Transfer failed");

        emit RewardClaimed(msg.sender, reward);
    }

    //helpers
    function countMatchesPacked(uint256 packedNumbers) internal view returns (uint) {
        uint matches;
        for (uint i = 0; i < 7; i++) {
            uint8 num = uint8((packedNumbers >> (i * 8)) & 0xFF);
            if (num == winningNumbers[i]) {
                matches++;
            }
        }
        return matches;
    }

    function getPercentage(uint matches) internal pure returns (uint) {
        uint256[8] memory percentages = [uint256(0), 0, 5, 10, 15, 20, 20, 30];
        return percentages[matches];
    }

    receive() external payable {}
}
