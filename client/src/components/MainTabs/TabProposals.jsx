import useEth from "../../contexts/EthContext/useEth";
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Contract from "../Demo/Contract";

function TabProposals() {
  const { state: { accounts } } = useEth();

  // TODO get Events proposals
/*   let oldEvents = await Contract.getPastEvents("ProposalRegistered"),{
    fromBlock: 0, // improve with contract blockNumber
    toBlock: "latest"
  } */

  return (
    "Item Proposals"
    );
}

export default TabProposals;