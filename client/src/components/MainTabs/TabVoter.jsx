import * as React from 'react';
import useEth from "../../contexts/EthContext/useEth";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

function TabVoter({ steps, activeStep, voter, setVoter, defaultVoter }) {
  const { state: { contract, currentAccount } } = useEth();

  const [errorMessage, setErrorMessage] = React.useState("");

  const inputProposal = React.useRef(null);
  const inputVote = React.useRef(null);

  function BadWorkFlow() {
    return <Typography>
      Bad workflow status, contract is currently {steps[activeStep]}
    </Typography>;
  }

  function NotRegistered() {
    return <Typography>
      You are not registered as voter.
    </Typography>;
  }

  function VotingProposal() {

    const addProposal = async () => {
      const input = inputProposal.current.value || "";
      console.log("Add Proposal: " + input);
      if (input.length === 0) {
        setErrorMessage("You can't propose nothing");
      } else {
        setErrorMessage("");
        await contract.methods.addProposal(input).send({ from: currentAccount });
        inputProposal.current.value = "";
      }
    }

    return (
      <Stack spacing={2}>
        <TextField
          inputRef={inputProposal}
          error={errorMessage !== ""}
          id="input-proposal"
          placeholder="proposal"
          label="Your proposal"
          helperText={errorMessage}
        />
        <Button onClick={addProposal} variant="contained" color="primary">Add proposal</Button>
      </Stack>
    );
  }

  function VotingVote() {
    const addVote = async () => {
      const input = inputVote.current.value || "";
      console.log("Vote: " + input);
      if (input.length === 0 && input === 0) {
        setErrorMessage("You can't vote nothing");
        inputVote.current.value = "";
      } else if (!/^\d+$/.test(input)) {
        setErrorMessage("Should be a proposal ID (number)");
        inputVote.current.value = "";
      }
      else {
        setErrorMessage("");
        try {
          await contract.methods.setVote(input).send({ from: currentAccount });
        } catch (e) {
          console.error(e);
          setErrorMessage("ProposalID ["+input+"] doesn't exist");
          return;
        }
        console.log("hide voting");
        setVoter({
          isRegistered: true,
          hasVoted: true,
          votedProposalId: input
        });
      }
    }

    return (
      <Stack spacing={2}>
        <TextField
          variant="outlined"
          inputRef={inputVote}
          error={errorMessage !== ""}
          id="input-vote"
          placeholder="proposal ID"
          label="Vote for proposal"
          helperText={errorMessage}
          inputProps={{ type: 'number' }} />
        <Button onClick={addVote} variant="contained" color="primary">Vote</Button>
      </Stack>
    )
  }

  function AlreadyVoted() {
    return <Typography>
      You already voted for proposal ID [{voter.votedProposalId}]!
    </Typography>;
  }

  function VotesTallied() {
    return <Typography>
      Watch results in proposals tab!
    </Typography>;
  }

  function VotingContent() {
    let content;
    switch (steps[activeStep]) {
      case "Proposals registration started":
        if (voter.isRegistered) {
          content = <VotingProposal />;
        } else {
          content = <NotRegistered />;
        }
        break;
      case "Voting session started":
        if (voter.isRegistered && !voter.hasVoted) {
          content = <VotingVote />;
        } else if(voter.hasVoted) {
          content = <AlreadyVoted />;
        } else {
          content = <NotRegistered />;
        }
        break;
      case "Votes tallied":
        content = <VotesTallied />;
        break;
      default:
        content = <BadWorkFlow />;
    }
    return content;
  }

  React.useEffect(() => {
    async function initVoter() {
      console.log("Init voter");
      setVoter(defaultVoter);
      setVoter(await contract.methods.getVoter(currentAccount).call({ from: currentAccount }));
    }
    initVoter().catch(console.log);
  }, [activeStep, currentAccount]) // empty array means nothing to watch, so run once and no more

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '20px'
    }}>
      <Stack spacing={2}>
        <VotingContent />
      </Stack>
    </Box>
  );
}

export default TabVoter;