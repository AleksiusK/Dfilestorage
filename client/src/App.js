import React, { Component } from "react";
import SolidityDrive from "./contracts/SolidityDrive.json";
import getWeb3 from "./getWeb3";
import{StyledDropZone} from 'react-drop-zone';
import {FileIcon, defaultStyles} from 'react-file-icon';
import {Table} from 'reactstrap';
import "react-drop-zone/dist/styles.css";
import "bootstrap/dist/css/bootstrap.css"

import "./App.css";

class App extends Component {
  state = { SolidityDrive: [], web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SolidityDrive.networks[networkId];
      const instance = new web3.eth.Contract(
        SolidityDrive.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.getFiles);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  getFiles = async () => {
    const { account, contract } = this.state;
    let filesLenght = await contract.methods.filesLenght().call({from: account[0]});
    let files = [];
    for(let i=0;i<filesLenght;i++) {
      let file = await contract.method.getFiles(i).call({ from: account[0]});
      files.push(file);
    }
    this.setState({SolidityDrive: files });
  }

  onDrop= async () => {
    //TODO
  }


  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return(
      <div className="App">
        <div className="container pt-5">
        <StyledDropZone/>
        <Table>
          <thead>
            <tr>
              <th width="5%" scope="row">Type</th>
              <th className="text-left">File Name</th>
              <th className="text-right">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th><FileIcon extension="docx"{...defaultStyles.docx}/></th>
              <th className="text-left">File name.docx</th>
              <th className="text-right">2001</th>
            </tr>
          </tbody>
        </Table>
        </div>
      </div>
    );
  }
}

export default App;
