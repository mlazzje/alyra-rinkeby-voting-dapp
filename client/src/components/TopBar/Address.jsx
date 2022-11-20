import useEth from "../../contexts/EthContext/useEth";
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import AccountCircle from '@mui/icons-material/AccountCircle';

function Address() {
  const { state: { accounts } } = useEth();

  return (
    <div>
      <Tooltip title="My ETH address">
        <Chip size="medium" color="secondary" icon={<AccountCircle fontSize="large" />} label={accounts && accounts[0] && accounts[0]} />
      </Tooltip>
    </div>
    );
}

export default Address;