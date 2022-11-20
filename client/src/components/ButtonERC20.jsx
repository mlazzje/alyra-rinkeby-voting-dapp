import { useEffect } from "react";
import { useState } from "react";
import useEth from "../contexts/EthContext/useEth";

function Button() {
  const { state: { contract, accounts, web3 } } = useEth();
  const [inputValue, setInputValue] = useState("");
  const [inputAddress, setInputAddress] = useState("");

  const [balance, setBalance] = useState();

  const refreshBalance = async () => {
    const value = await contract.methods.balanceOf(accounts[0]).call({ from: accounts[0] });
    setBalance(value);
  }

  const transfer = async () => {
    if (!web3.utils.isAddress(inputAddress)) {
      alert("invalid address")
    }
    // const value = web3.utils.toBN(parseInt(inputValue) * 10 ** 18);
    // const value = web3.utils.toWei(web3.utils.toBN(parseInt(inputValue)), 'ether');
    const value = web3.utils.toBN(parseInt(inputValue), 'ether');
    await contract.methods.transfer(inputAddress, value).send({ from: accounts[0] });
  };

  useEffect(() => {
    console.log("contract.methods", contract);
    if (contract?.methods) {
      refreshBalance();
    }
  }, [contract]);

  const handleInputChange = e => {
    if (/^\d+$|^$/.test(e.target.value)) {
      setInputValue(e.target.value);
    }
  };

  const handleAddressChange = e => {
    setInputAddress(e.target.value);
  };

  const mint10K = async () => {
    const result = await contract.methods.mint().send({ from: accounts[0] });
    console.log(result);
    await refreshBalance();
  }
  return (
    <div>
        {accounts && accounts[0] && <pre>{accounts[0]}</pre>}
        <button onClick={mint10K}>MINT 100</button>
        <button onClick={refreshBalance}>Refresh balance</button>

        {balance && balance >0 && (
            <pre>{balance}</pre>
        )}

        <div className="btns">

        <input
            type="text"
            placeholder="address"
            value={inputAddress}
            onChange={handleAddressChange}
        />
        <input
            type="text"
            placeholder="amount"
            value={inputValue}
            onChange={handleInputChange}
        />
        <button onClick={transfer} className="input-btn">
            transfer
        </button>
        </div>
    </div>
  );
}

export default Button;