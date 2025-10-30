// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TrustLensVerification {
    struct VerifiedContent {
        bytes32 contentHash;
        string filecoinCID;
        address creator;
        uint256 timestamp;
        string contentType;
        bool isVerified;
    }

    mapping(bytes32 => VerifiedContent) public verifiedContents;
    mapping(address => bytes32[]) public creatorContents;

    bytes32[] public allContentHashes;

    event ContentVerified(
        bytes32 indexed contentHash,
        string filecoinCID,
        address indexed creator,
        uint256 timestamp,
        string contentType
    );

    event ContentFlagged(
        bytes32 indexed contentHash,
        address indexed flagger,
        uint256 timestamp
    );

    function verifyContent(
        bytes32 _contentHash,
        string memory _filecoinCID,
        string memory _contentType
    ) public returns (bool) {
        require(_contentHash != bytes32(0), "Invalid content hash");
        require(bytes(_filecoinCID).length > 0, "Invalid Filecoin CID");
        require(!verifiedContents[_contentHash].isVerified, "Content already verified");

        verifiedContents[_contentHash] = VerifiedContent({
            contentHash: _contentHash,
            filecoinCID: _filecoinCID,
            creator: msg.sender,
            timestamp: block.timestamp,
            contentType: _contentType,
            isVerified: true
        });

        creatorContents[msg.sender].push(_contentHash);
        allContentHashes.push(_contentHash);

        emit ContentVerified(
            _contentHash,
            _filecoinCID,
            msg.sender,
            block.timestamp,
            _contentType
        );

        return true;
    }

    function checkContentVerification(bytes32 _contentHash)
        public
        view
        returns (
            bool isVerified,
            address creator,
            uint256 timestamp,
            string memory filecoinCID,
            string memory contentType
        )
    {
        VerifiedContent memory content = verifiedContents[_contentHash];
        return (
            content.isVerified,
            content.creator,
            content.timestamp,
            content.filecoinCID,
            content.contentType
        );
    }

    function getCreatorContentCount(address _creator) public view returns (uint256) {
        return creatorContents[_creator].length;
    }

    function getCreatorContent(address _creator, uint256 _index)
        public
        view
        returns (bytes32)
    {
        require(_index < creatorContents[_creator].length, "Index out of bounds");
        return creatorContents[_creator][_index];
    }

    function getTotalVerifiedCount() public view returns (uint256) {
        return allContentHashes.length;
    }
}
