import * as React from 'react';
import useEth from "../../contexts/EthContext/useEth";
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';

const contractNextStep = [
  "startProposalsRegistering",
  "endProposalsRegistering",
  "startVotingSession",
  "endVotingSession",
  "tallyVotes"
]

function TabOwner({ activeStep, setActiveStep, steps }) {
  const { state: { contract, currentAccount, web3 } } = useEth();

  const [inputAddress, setInputAddress] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  console.log("Tab Owner step: "+activeStep);

  const handleNext = async () => {
    try {
      await contract.methods[contractNextStep[activeStep]]().send({ from: currentAccount });
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddressChange = e => {
    if(web3.utils.isAddress(e.target.value)) {
      setInputAddress(e.target.value);
      setErrorMessage("");
    } else {
      setInputAddress(e.target.value);
      setErrorMessage("It's not a valid ETH address");
    }
  };

  const addVoter = async () => {
    console.log("add Voter: "+inputAddress);
    await contract.methods.addVoter(inputAddress).send({ from: currentAccount });
    setInputAddress("");
    setErrorMessage("");
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      {activeStep === steps.length - 1 ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, marginBottom: "10px" }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button variant="contained" onClick={handleNext}>
              {activeStep === steps.length - 2 ? 'Finish' : 'Next step'}
            </Button>
          </Box>
        </React.Fragment>
      )}

      <Divider />
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '20px'
      }}>
        {activeStep === steps.indexOf("Registering voters") && (
          <Stack spacing={2}>
            <TextField
              error={errorMessage !== ""}
              placeholder="address"
              label="Voter ETH address"
              helperText={errorMessage}
              value={inputAddress}
              onChange={handleAddressChange}
            />
            <Button 
              disabled={errorMessage !== "" || inputAddress.length === 0}
              variant="contained" 
              color="secondary" 
              onClick={addVoter}>
                Add voter
            </Button>
          </Stack>
        )}
      </Box>
    </Box>

  );
}

export default TabOwner;