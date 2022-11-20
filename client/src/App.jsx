import { EthProvider } from "./contexts/EthContext";
import ButtonERC20 from "./components/ButtonERC20";
import Web3stuff from "./components/Web3";
import Demo from "./components/Demo";
import TopBar from "./components/TopBar";
import MainTabs from "./components/MainTabs";
import "./App.css";

function App() {

  return (
    <EthProvider>
      <TopBar />
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
