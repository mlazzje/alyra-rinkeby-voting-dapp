import { EthProvider } from "./contexts/EthContext";
import TopBar from "./components/TopBar";
import MainTabs from "./components/MainTabs";
import "./App.css";
import { SnackbarProvider } from 'notistack';

function App() {

  return (
    <EthProvider>
      <SnackbarProvider 
      maxSnack={3} 
      anchorOrigin={{vertical: 'top', horizontal: 'right', }}>
        <TopBar />
      </SnackbarProvider>
      <main>
        <MainTabs />
      </main>
      {/* <div id="App" >
        <div className="container">
          <Demo />
          <ButtonERC20 />
          <Web3stuff />
        </div>
      </div> */}
    </EthProvider>
  );
}

export default App;
