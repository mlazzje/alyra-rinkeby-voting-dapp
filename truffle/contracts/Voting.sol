// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Alyra Rinkeby Voting Contract
 * @author Cyril Castagnet & Maxime L
 * @notice This is a voting smart contract including different steps
 * listed in WorkflowStatus enum
 *
 * @dev Only the owner can start the voting session by registering voters.
 * Only the owner can go to the next step
 *
 * FIX: I limited the smart contract to 100 proposals in order to avoid DOS Gas limit
 * during tallyVotes function at the end
 *
 */
contract Voting is Ownable {
    uint256 public winningProposalID;

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint256 votedProposalId;
    }

    struct Proposal {
        string description;
        uint256 voteCount;
    }

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    /// @dev only public variable
    WorkflowStatus public workflowStatus;

    Proposal[] proposalsArray;
    mapping(address => Voter) voters;

    /// @dev All events available

    /**
     * @dev Emits event when a new voter registered
     * @return voterAddress The new voter address
     */
    event VoterRegistered(address voterAddress);
    /**
     * @dev Emits event when workflow status changes
     * @return previousStatus The previous workflow status
     * @return newStatus The new workflow status
     */
    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );
    /**
     * @dev Emits event when a new proposal is registered
     * @return proposalId The proposal ID
     */
    event ProposalRegistered(uint256 proposalId);
    /**
     * @dev Emits event when a voter voted
     * @return voter The voter address
     * @return proposalId The voted proposal ID
     */
    event Voted(address voter, uint256 proposalId);

    /// @dev onlyVoters modifier used below
    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, "You're not a voter");
        _;
    }

    /**
     * @dev we can do a factored modifier for each steps, like I did in project 1
     * but I decided to use the proposed Voting smart contract for the DApp
     */

    /// @dev all getters available externally, only for voters

    /**
     * @dev Returns the voter with address, only for voters
     * @param _addr The address of voter to retrieve
     * @return voter The voter
     */
    function getVoter(address _addr)
        external
        view
        onlyVoters
        returns (Voter memory)
    {
        return voters[_addr];
    }

    /**
     * @dev Returns a proposal with ID, only for voters
     * @param _id The ID of the proposal
     * @return proposal The proposal
     */
    function getOneProposal(uint256 _id)
        external
        view
        onlyVoters
        returns (Proposal memory)
    {
        return proposalsArray[_id];
    }

    /// @dev for RegisteringVoters step, only for the owner

    /**
     * @dev Add a voter with his/her address only for the owner
     * @param _addr Address of the voter
     */
    function addVoter(address _addr) external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.RegisteringVoters,
            "Voters registration is not open yet"
        );
        require(voters[_addr].isRegistered != true, "Already registered");

        voters[_addr].isRegistered = true;
        emit VoterRegistered(_addr);
    }

    /// @dev for ProposalsRegistrationStarted step, only for voters added by owner during 1st step

    /**
     * @dev Add a proposal with its description, only for voters
     * @param _desc Description of the proposal
     */
    function addProposal(string calldata _desc) external onlyVoters {
        require(
            workflowStatus == WorkflowStatus.ProposalsRegistrationStarted,
            "Proposals are not allowed yet"
        );
        require(
            proposalsArray.length <= 100,
            "Number of proposals limited to 100"
        ); // To avoid Dos gas limit
        require(
            keccak256(abi.encode(_desc)) != keccak256(abi.encode("")),
            "Vous ne pouvez pas ne rien proposer"
        ); // facultatif
        // voir que desc est different des autres

        Proposal memory proposal;
        proposal.description = _desc;
        proposalsArray.push(proposal);
        emit ProposalRegistered(proposalsArray.length - 1);
    }

    /// @dev for VotingSessionStarted step, only for voters added by owner during 1st step
    
    /**
     * @dev Set a vote, only for voters
     * @param _id Proposal ID voted
     */
    function setVote(uint256 _id) external onlyVoters {
        require(
            workflowStatus == WorkflowStatus.VotingSessionStarted,
            "Voting session havent started yet"
        );
        require(voters[msg.sender].hasVoted != true, "You have already voted");
        require(_id < proposalsArray.length, "Proposal not found"); // pas obligé, et pas besoin du >0 car uint

        voters[msg.sender].votedProposalId = _id;
        voters[msg.sender].hasVoted = true;
        proposalsArray[_id].voteCount++;

        emit Voted(msg.sender, _id);
    }

    /// @dev all Owner functions to go to the next step by following WorkflowStatus enum
    
    /**
     * @dev Start the 2nd step ProposalsRegistrationStarted, only for owner
     */
    function startProposalsRegistering() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.RegisteringVoters,
            "Registering proposals cant be started now"
        );
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;

        Proposal memory proposal;
        proposal.description = "GENESIS";
        proposalsArray.push(proposal);

        emit WorkflowStatusChange(
            WorkflowStatus.RegisteringVoters,
            WorkflowStatus.ProposalsRegistrationStarted
        );
    }

    /**
     * @dev Start the 3rd step ProposalsRegistrationEnded, only for owner
     */
    function endProposalsRegistering() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.ProposalsRegistrationStarted,
            "Registering proposals havent started yet"
        );
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(
            WorkflowStatus.ProposalsRegistrationStarted,
            WorkflowStatus.ProposalsRegistrationEnded
        );
    }

    /**
     * @dev Start the 4th step VotingSessionStarted, only for owner
     */
    function startVotingSession() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.ProposalsRegistrationEnded,
            "Registering proposals phase is not finished"
        );
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(
            WorkflowStatus.ProposalsRegistrationEnded,
            WorkflowStatus.VotingSessionStarted
        );
    }

    /**
     * @dev Start the 5th step VotingSessionEnded, only for owner
     */
    function endVotingSession() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.VotingSessionStarted,
            "Voting session havent started yet"
        );
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(
            WorkflowStatus.VotingSessionStarted,
            WorkflowStatus.VotingSessionEnded
        );
    }

    /**
     * @dev End the voting session and nominate the winning proposal, only for owner
     */
    function tallyVotes() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.VotingSessionEnded,
            "Current status is not voting session ended"
        );
        uint256 _winningProposalId;
        for (uint256 p = 0; p < proposalsArray.length; p++) {
            if (
                proposalsArray[p].voteCount >
                proposalsArray[_winningProposalId].voteCount
            ) {
                _winningProposalId = p;
            }
        }
        winningProposalID = _winningProposalId;

        workflowStatus = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(
            WorkflowStatus.VotingSessionEnded,
            WorkflowStatus.VotesTallied
        );
    }
}
