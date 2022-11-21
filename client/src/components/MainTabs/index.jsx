import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Copyright from '@mui/icons-material/Copyright';
import FormatListNumbered from '@mui/icons-material/FormatListNumbered';
import Person from '@mui/icons-material/Person';

import useEth from "../../contexts/EthContext/useEth";
import TabOwner from './TabOwner';
import TabVoter from './TabVoter';
import TabProposals from './TabProposals';

const steps = ["Registering voters",
  "Proposals registration started",
  "Proposals registration ended",
  "Voting session started",
  "Voting session ended",
  "Votes tallied"];

const defaultVoter = {
  isRegistered: false,
  hasVoted: false,
  votedProposalId: 0
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function BasicTabs() {
  const [value, setValue] = React.useState(0);
  const { state: { isOwner, contract, currentAccount, accounts } } = useEth();
  const [activeStep, setActiveStep] = React.useState(0);
  const [proposalsId, setProposalsId] = React.useState([]);
  const [voter, setVoter] = React.useState(defaultVoter);

  const initStep = async () => {
    console.log("Init step");
    let step = await contract.methods.workflowStatus().call({ from: currentAccount });
    console.log(step);
    setActiveStep(parseInt(step));
  }

  const initVoter = async () => {
    console.log("Init voter");
    setVoter(defaultVoter);
    setVoter(await contract.methods.getVoter(currentAccount).call({ from: currentAccount }));
  }

  React.useEffect(() => {
    console.log("Main tabs");
    if (contract) {
      initStep().catch(console.log);
      setVoter(defaultVoter);
      initVoter().catch(console.log);
    };
  }, [contract, currentAccount])

  // const [inputAddress, setInputAddress] = useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{
        borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab icon={<FormatListNumbered />} label="PROPOSALS" {...a11yProps(0)} />
          <Tab icon={<Person />} label="VOTER" {...a11yProps(1)} />
          {isOwner &&
            <Tab icon={<Copyright />} label="OWNER" {...a11yProps(2)} />
          }
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <TabProposals
          activeStep={activeStep}
          steps={steps}
          voter={voter}
           />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TabVoter
          steps={steps}
          activeStep={activeStep}
          voter={voter}
          setVoter={setVoter}
          defaultVoter={defaultVoter} />
      </TabPanel>
      {isOwner &&
        <TabPanel value={value} index={2}>
          <TabOwner
            steps={steps}
            activeStep={activeStep}
            setActiveStep={setActiveStep} />
        </TabPanel>
      }
    </Box>
  );
}

export default BasicTabs;