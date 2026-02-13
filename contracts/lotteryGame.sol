// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";


contract lotteryGame is VRFConsumerBaseV2 {

    address public owner;
    uint public constant ENTRY_FEE = 2 gwei;
    uint public rolloverPool;
    bool public lotteryOpen;

    uint8[7] public winningNumbers;

    struct Ticket {
        address player;
        uint8[7] numbers;
    }

    Ticket[] public tickets;

    
    uint constant TWO_MATCH = 5;
    uint constant THREE_MATCH = 10;
    uint constant FOUR_MATCH = 15;
    uint constant FIVE_MATCH = 20;
    uint constant SIX_MATCH = 20;
    uint constant SEVEN_MATCH = 30;

    uint constant OWNER_FEE_PERCENT = 10;

   
    VRFCoordinatorV2Interface COORDINATOR;
    uint64 s_subscriptionId;
    bytes32 keyHash;
    uint32 callbackGasLimit = 200000;
    uint16 requestConfirmations = 3;
    uint32 numWords = 7;
    uint256 public s_requestId;

    event TicketPurchased(address indexed player);
    event WinnerNumbersGenerated(uint8[7] winningNumbers);
    event RewardsDistributed();

    constructor(
        address vrfCoordinator,
        bytes32 _keyHash,
        uint64 subscriptionId
    ) VRFConsumerBaseV2(vrfCoordinator) {
        owner = msg.sender;
        lotteryOpen = true;

        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        keyHash = _keyHash;
        s_subscriptionId = subscriptionId;
    }

    // ========== MODIFIER ==========
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    // buy ticktet
    function buyTicket(uint8[7] memory _numbers) public payable {
        require(lotteryOpen, "Lottery closed");
        require(msg.value == ENTRY_FEE, "Incorrect entry fee");

        for (uint i = 0; i < 7; i++) {
            require(_numbers[i] >= 1 && _numbers[i] <= 47, "Invalid number");
        }

        tickets.push(Ticket(msg.sender, _numbers));
        emit TicketPurchased(msg.sender);
    }

    // get random words from chainlink vrf
    function requestWinningNumbers() public onlyOwner {
        require(lotteryOpen, "Lottery closed");
        s_requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
    }

    // chainlink vrf callback function to receive random words and generate winning numbers
    function fulfillRandomWords(
        uint256, // requestId 
        uint256[] memory randomWords
    ) internal override {
        for (uint i = 0; i < 7; i++) {
            winningNumbers[i] = uint8((randomWords[i] % 47) + 1);
        }
        emit WinnerNumbersGenerated(winningNumbers);
        distributeRewards();
    }

    // distribute rewards to winners based on matching numbers
    function distributeRewards() internal {
        uint totalPool = address(this).balance;
        uint ownerFee = (totalPool * OWNER_FEE_PERCENT) / 100;
        payable(owner).transfer(ownerFee);

        uint prizePool = totalPool - ownerFee;

        uint[8] memory matchCount;

        // Count winners per tier
        for (uint i = 0; i < tickets.length; i++) {
            uint matches = countMatches(tickets[i].numbers);
            if (matches >= 2) matchCount[matches]++;
        }

        // Distribute rewards
        for (uint i = 0; i < tickets.length; i++) {
            uint matches = countMatches(tickets[i].numbers);
            if (matches >= 2 && matchCount[matches] > 0) {
                uint percentage = getPercentage(matches);
                uint categoryPool = (prizePool * percentage) / 100;
                uint reward = categoryPool / matchCount[matches];

                payable(tickets[i].player).transfer(reward);
            }
        }

        // Remaining balance becomes rollover
        rolloverPool = address(this).balance;
        delete tickets;

        emit RewardsDistributed();
    }

    // helper functions
    function countMatches(uint8[7] memory playerNumbers) internal view returns (uint) {
        uint matches = 0;
        for (uint i = 0; i < 7; i++) {
            if (playerNumbers[i] == winningNumbers[i]) matches++;
        }
        return matches;
    }

    function getPercentage(uint matches) internal pure returns (uint) {
        if (matches == 2) return TWO_MATCH;
        if (matches == 3) return THREE_MATCH;
        if (matches == 4) return FOUR_MATCH;
        if (matches == 5) return FIVE_MATCH;
        if (matches == 6) return SIX_MATCH;
        if (matches == 7) return SEVEN_MATCH;
        return 0;
    }

    function reopenLottery() public onlyOwner {
        require(!lotteryOpen, "Already open");
        lotteryOpen = true;
    }

    receive() external payable {}
}
