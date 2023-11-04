// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./IChronicle.sol";

/// @title A contract for managing tradable shares associated with subjects
/// @notice This contract allows users to buy and sell shares associated with a subject
contract DeepTouch is Ownable {
    address public constant CHRONICLE_ORACLE_ETH_USD = 0x90430C5b8045a1E2A0Fc4e959542a0c75b576439;

    using Address for address payable;

    // The address where protocol fees will be sent
    address payable public protocolFeeDestination;
    // The percentage of the protocol fee (with 1 ether representing 100%)
    uint256 public protocolFeePercent;
    // The percentage of the subject fee (with 1 ether representing 100%)
    uint256 public subjectFeePercent;

    // Event emitted when a trade is executed
    event Trade(
        address indexed trader,
        address indexed subject,
        bool isBuy,
        uint256 shareAmount,
        uint256 ethAmount,
        uint256 protocolEthAmount,
        uint256 subjectEthAmount,
        uint256 supply
    );

    // SharesSubject => (Holder => Balance)
    mapping(address => mapping(address => uint256)) public sharesBalance;

    // SharesSubject => Supply
    mapping(address => uint256) public sharesSupply;

    /// @notice Fetches the latest Ethereum price from the Chronicle Oracle
    /// @dev Retrieves the current ETH/USD price from the Chronicle Oracle smart contract.
    /// @return value The current ETH price in USD with precision as defined by the Oracle.
    function getEthPrice() external view returns (uint value) {
        return IChronicle(CHRONICLE_ORACLE_ETH_USD).read();
    }

    /// @notice Sets the destination address for protocol fees
    /// @param _feeDestination The address to which protocol fees will be sent
    function setFeeDestination(address payable _feeDestination) external onlyOwner {
        protocolFeeDestination = _feeDestination;
    }

    /// @notice Sets the protocol fee percentage
    /// @param _feePercent The fee percentage to be set for the protocol
    function setProtocolFeePercent(uint256 _feePercent) external onlyOwner {
        require(_feePercent <= 1 ether, "Fee percent must be less than or equal to 100%");
        protocolFeePercent = _feePercent;
    }

    /// @notice Sets the subject fee percentage
    /// @param _feePercent The fee percentage to be set for the subject
    function setSubjectFeePercent(uint256 _feePercent) external onlyOwner {
        require(_feePercent <= 1 ether, "Fee percent must be less than or equal to 100%");
        subjectFeePercent = _feePercent;
    }

    /// @dev Internal function to handle fund transfers securely
    /// @param recipient The address receiving the funds
    /// @param amount The amount of ether to send
    function _sendFunds(address payable recipient, uint256 amount) private {
        require(amount <= address(this).balance, "Insufficient balance in contract");
        recipient.sendValue(amount);
    }

    /// @notice Calculates the price for a given amount of shares based on supply
    /// @param supply The current supply of shares
    /// @param amount The amount of shares for which to calculate the price
    /// @return The price for the given amount of shares
    function getPrice(uint256 supply, uint256 amount) public pure returns (uint256) {
        uint256 sum1 = supply == 0 ? 0 : (supply - 1 )* (supply) * (2 * (supply - 1) + 1) / 6;
        uint256 sum2 = supply == 0 && amount == 1 ? 0 : (supply - 1 + amount) * (supply + amount) * (2 * (supply - 1 + amount) + 1) / 6;
        uint256 summation = sum2 - sum1;
        return summation * 1 ether / 16000;
    }

    /// @notice Calculates the buying price for a given amount of shares, including fees
    /// @param sharesSubject The subject associated with the shares
    /// @param amount The amount of shares to be bought
    /// @return The buying price including the fees
    function getBuyPrice(address sharesSubject, uint256 amount) public view returns (uint256) {
        return getPrice(sharesSupply[sharesSubject], amount);
    }

    /// @notice Calculates the selling price for a given amount of shares, including fees
    /// @param sharesSubject The subject associated with the shares
    /// @param amount The amount of shares to be bought
    /// @return The selling price including the fees
    function getSellPrice(address sharesSubject, uint256 amount) public view returns (uint256) {
        return getPrice(sharesSupply[sharesSubject] - amount, amount);
    }

    /// @notice Calculates the buying price for a given amount of shares, including fees
    /// @param sharesSubject The subject associated with the shares
    /// @param amount The amount of shares to be bought
    /// @return The buying price including the fees
    function getBuyPriceAfterFee(address sharesSubject, uint256 amount) public view returns (uint256) {
        uint256 price = getBuyPrice(sharesSubject, amount);
        uint256 protocolFee = price * protocolFeePercent / 1 ether;
        uint256 subjectFee = price * subjectFeePercent / 1 ether;
        return price + protocolFee + subjectFee;
    }

    /// @notice Calculates the selling price for a given amount of shares, including fees
    /// @param sharesSubject The subject associated with the shares
    /// @param amount The amount of shares to be bought
    /// @return The selling price including the fees
    function getSellPriceAfterFee(address sharesSubject, uint256 amount) public view returns (uint256) {
        uint256 price = getSellPrice(sharesSubject, amount);
        uint256 protocolFee = price * protocolFeePercent / 1 ether;
        uint256 subjectFee = price * subjectFeePercent / 1 ether;
        return price - protocolFee - subjectFee;
    }

    /// @notice Retrieves the total supply of shares for a given subject
    /// @param sharesSubject The subject associated with the shares whose total supply is to be retrieved
    /// @return The total supply of shares for the specified subject
    function getSharesSupply(address sharesSubject) public view returns (uint256) {
        return sharesSupply[sharesSubject];
    }

    /// @notice Retrieves the balance of shares for a specific holder of a given subject
    /// @param sharesSubject The subject associated with the shares
    /// @param holder The address of the holder whose share balance is to be retrieved
    /// @return The balance of shares the holder has for the specified subject
    function getSharesBalance(address sharesSubject, address holder) public view returns (uint256) {
        return sharesBalance[sharesSubject][holder];
    }

    /// @notice Allows users to buy shares associated with a subject
    /// @param sharesSubject The subject associated with the shares to be bought
    /// @param amount The amount of shares to be bought
    function buyShares(address sharesSubject, uint256 amount) public payable {
        uint256 supply = sharesSupply[sharesSubject];
        require(supply > 0 || sharesSubject == msg.sender, "Only the shares' subject can buy the first share");
        uint256 price = getPrice(supply, amount);
        uint256 protocolFee = price * protocolFeePercent / 1 ether;
        uint256 subjectFee = price * subjectFeePercent / 1 ether;
        require(msg.value >= price + protocolFee + subjectFee, "Insufficient payment");
        sharesBalance[sharesSubject][msg.sender] = sharesBalance[sharesSubject][msg.sender] + amount;
        sharesSupply[sharesSubject] = supply + amount;
        emit Trade(msg.sender, sharesSubject, true, amount, price, protocolFee, subjectFee, supply + amount);
        _sendFunds(protocolFeeDestination, protocolFee);
        _sendFunds(payable(sharesSubject), subjectFee);
    }

    /// @notice Allows users to sell shares associated with a subject
    /// @param sharesSubject The subject associated with the shares to be sold
    /// @param amount The amount of shares to be sold
    function sellShares(address sharesSubject, uint256 amount) public payable {
        uint256 supply = sharesSupply[sharesSubject];
        require(supply > amount, "Cannot sell the last share");
        uint256 price = getPrice(supply - amount, amount);
        uint256 protocolFee = price * protocolFeePercent / 1 ether;
        uint256 subjectFee = price * subjectFeePercent / 1 ether;
        require(sharesBalance[sharesSubject][msg.sender] >= amount, "Insufficient shares");
        sharesBalance[sharesSubject][msg.sender] = sharesBalance[sharesSubject][msg.sender] - amount;
        sharesSupply[sharesSubject] = supply - amount;
        emit Trade(msg.sender, sharesSubject, false, amount, price, protocolFee, subjectFee, supply - amount);
        _sendFunds(payable(msg.sender), price - protocolFee - subjectFee);
        _sendFunds(protocolFeeDestination, protocolFee);
        _sendFunds(payable(sharesSubject), subjectFee);
    }
}