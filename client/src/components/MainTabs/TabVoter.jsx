import * as React from 'react';
import useEth from "../../contexts/EthContext/useEth";
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

function TabVoter({ steps, activeStep }) {
  const defaultVoter = {
    isRegistered: false,
    hasVoted: false,
    votedProposalId: 0
  }
  const { state: { contract, currentAccount, accounts } } = useEth();
  const [voter, setVoter] = React.useState(defaultVoter);

  const [errorMessage, setErrorMessage] = React.useState("");

  const inputProposal = React.useRef(null);

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
      if (input.length == 0) {
        setErrorMessage("You can't propose nothing");
      } else {
        setErrorMessage("");
        await contract.methods.addProposal(input).send({ from: currentAccount });
        inputProposal.current.value = "";
      }
      /* await contract.methods.addVoter(inputAddress).send({ from: currentAccount });
      setInputAddress("");
      setErrorMessage(""); */
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
    return <Button variant="contained" color="primary">Vote</Button>;
  }

  function VotingContent() {
    let content;
    switch (steps[activeStep]) {
      case "Proposals registration started":
        content = <VotingProposal />;
        break;
      case "Voting session started":
        content = <VotingVote />;
        break;
      default:
        content = <BadWorkFlow />;
    }
    if (voter.isRegistered) {
      return content
    } else {
      return <NotRegistered />;
    }
  }

  React.useEffect(() => {
    async function initVoter() {
      console.log("Init voter");
      setVoter(defaultVoter);
      setVoter(await contract.methods.getVoter(currentAccount).call({ from: currentAccount }));
    }
    initVoter().catch(console.log);
  }, [activeStep, accounts]) // empty array means nothing to watch, so run once and no more

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