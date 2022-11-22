import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Address from "./Address";
import useEth from "../../contexts/EthContext/useEth";
import { useSnackbar } from 'notistack';

function TopBar() {

  const { state: { contract } } = useEth();
  const [notification, setNotifications] = React.useState(0);
  const [subscribed, setSubscribed] = React.useState(false);
  let notifCount = 0; // Lack of react knowledge

  const { enqueueSnackbar } = useSnackbar();

  const addNotif = React.useCallback(() => {
    console.log("From notif " + notifCount);
    // let _notification = notification + 1;
    setNotifications(++notifCount);
  }, [notifCount]);

  const subscribeEvent = React.useCallback(() => {
    if (contract && !subscribed) {
      contract.events.ProposalRegistered(() => {
      }).on("connected", function (subscriptionId) {
        console.log('SubID: ', subscriptionId);
      })
        .on('data', function (event) {
          console.log('Event: ' + event);
          console.log('Proposal ID: ' + event.returnValues.proposalId);
          // addProposalId(event.returnValues.proposalId);
          addNotif();
          enqueueSnackbar('New proposal added, ID: ' + event.returnValues.proposalId
            , { variant: 'info' });
        })
        .on('changed', function (event) {
          //Do something when it is removed from the database.
        })
        .on('error', function (error, receipt) {
          console.log('Error:', error, receipt);
        });
      setSubscribed(true);
    }
  }, [contract, enqueueSnackbar, addNotif, subscribed]);

  /* const addProposalId = (proposalId) => {
    setProposalsId(current => [...current, proposalId]);
  } */

  React.useEffect(() => {
    console.log("Top bar");
    if (contract) {
      subscribeEvent();
    };
  }, [contract, subscribeEvent]) // empty array means nothing to watch, so run once and no more

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography
            variant="h4"
            noWrap
            component="div"
            sx={{ display: { xs: 'block', sm: 'block' } }}
          >
            Voting DApp
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'flex', md: 'flex' } }}>
            <IconButton
              size="large"
              aria-label="new notifications"
              color="inherit"
            >
              <Badge badgeContent={notification} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Address />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default TopBar;
