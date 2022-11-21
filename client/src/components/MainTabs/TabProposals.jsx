import * as React from 'react';
import useEth from "../../contexts/EthContext/useEth";

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProposalIcon from '@mui/icons-material/ReceiptLong';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

function TabProposals({ voter, steps, activeStep }) {
  const { state: { currentAccount, contract } } = useEth();
  const [proposals, setProposals] = React.useState([]);
  const [winningProposal, setWinningProposal] =  React.useState({});

  function NotRegistered() {
    return <Typography>
      You are not registered as voter.
    </Typography>;
  }

  function BadWorkFlow() {
    return <Typography>
      Bad workflow status, contract is currently {steps[activeStep]}
    </Typography>;
  }

  function VotesTallied() {
    console.log("Votes Tallied");
    return (
      <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Winning proposal
        </Typography>
        <Typography variant="h5" component="div">
          ID: {winningProposal.id}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
        {winningProposal.voteCount} votes
        </Typography>
        <Typography variant="h3">
        {winningProposal.description}
        </Typography>
      </CardContent>
    </Card>
    )
  }

  function ListProposals() {
    return (
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {proposals.map((p) => (
          <Box key={p.id}>
            <ListItem alignItems="flex-start">
              <ListItemIcon>
                <ProposalIcon />
              </ListItemIcon>
              <ListItemText
                primary={p.description}
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      ID:
                    </Typography>
                    {p.id}
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </Box>
        ))
        }
      </List>
    )
  }

  function ProposalsView () {
    switch (true) {
      case activeStep < steps.indexOf("Proposals registration started"):
        return <BadWorkFlow/>
      case activeStep < steps.indexOf("Votes tallied"):
        if (!voter.isRegistered) {
          return <NotRegistered />
        } else {
          return <ListProposals />
        }
      case activeStep === steps.indexOf("Votes tallied"):
        return <VotesTallied />;
      default:
        return <BadWorkFlow />;
    }
  }

  React.useEffect(() => {
    const getWinner = async () => {
      console.log("get winner");
      let winningProposalID = await contract.methods.winningProposalID().call({ from: currentAccount });
      console.log("Winner is: "+ winningProposalID);
      let winningProposal = await getProposal(winningProposalID);
      setWinningProposal(winningProposal);
      console.log("Winner is: "+ winningProposal);
    }

    const getProposal = async (proposalId) => {
      let proposal = await contract.methods.getOneProposal(proposalId).call({ from: currentAccount });
      return {
        id: proposalId,
        description: proposal.description,
        voteCount: proposal.voteCount
      };
    }

    const getOldEvents = async () => {
      console.log("get Old Events");
      let oldEvents = await contract.getPastEvents("ProposalRegistered", {
        fromBlock: 0, // improve with contract blockNumber
        toBlock: "latest"
      });
      // NOT USED YET
      let proposalsId = oldEvents.map((e) => e.returnValues.proposalId);
      setProposals(await Promise.all(proposalsId.map(async (p) => await getProposal(p))));
    }

    console.log("proposals useEffect updated");
    if(contract) {
      if (voter.isRegistered && activeStep < steps.indexOf("Votes tallied")) { 
        getOldEvents(); 
      }
      if(activeStep === steps.indexOf("Votes tallied")) {
        getWinner();
      }
    }
    if (contract && voter.isRegistered && activeStep < steps.indexOf("Votes tallied")) { 
      getOldEvents(); 
    }
  }, [voter]) // empty array means nothing to watch, so run once and no more

/*   React.useEffect(() => {
    console.log("updated voter");
    setProposals();
  }, [voter]) */

  // TODO new entry based on notification and avoid rendering & request again BC

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '20px'
    }}>
      <ProposalsView proposals={{proposals}} />
    </Box>
  );
}

export default TabProposals;