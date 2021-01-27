module.exports = {
  address: "0x205Fb9e7d44AFBcac3e987640C936531eE865990",
  abi: [
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "InvestigationPeriodEnd",
          "type": "uint256"
        }
      ],
      "name": "ClaimInvestigationStarted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [],
      "name": "Payout",
      "type": "event"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "activePayoutEvent",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "currentInvestigationPeriodEnd",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "governance",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "investigationPeriod",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "shieldToken",
      "outputs": [
        {
          "internalType": "contract IShieldToken",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "status",
      "outputs": [
        {
          "internalType": "enum ClaimsManagerSingleAccount.ClaimsStatus",
          "name": "",
          "type": "uint8"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "_shieldToken",
          "type": "address"
        }
      ],
      "name": "setShieldToken",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "_governance",
          "type": "address"
        }
      ],
      "name": "setGovernance",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_period",
          "type": "uint256"
        }
      ],
      "name": "setInvestigationPeriod",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "checkPayoutEvent",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "bool",
          "name": "_activePayoutEvent",
          "type": "bool"
        }
      ],
      "name": "setActivePayoutEvent",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "submitClaim",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "payoutClaim",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "resetClaim",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "isReady",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ],
  bytecode: "0x608060405234801561001057600080fd5b5061a8c060028190555060006003819055506000600460006101000a81548160ff02191690831515021790555033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506000600160146101000a81548160ff0219169083600281111561009d57fe5b0217905550610db2806100b16000396000f3fe608060405234801561001057600080fd5b50600436106100f55760003560e01c80636d3c3d4011610097578063ab033ea911610066578063ab033ea914610278578063d999e6ee146102bc578063ee8ba5c514610300578063f82cbde41461034a576100f5565b80636d3c3d40146101fe57806380000dc51461021c5780639d55ce561461024c578063a094a03114610256576100f5565b8063200d2ed2116100d3578063200d2ed21461015c578063264c7f4014610188578063553ea3e9146101aa5780635aa6e675146101b4576100f5565b80630d540408146100fa5780631afbd128146101185780631bb7eef41461013a575b600080fd5b610102610378565b6040518082815260200191505060405180910390f35b61012061037e565b604051808215151515815260200191505060405180910390f35b610142610492565b604051808215151515815260200191505060405180910390f35b6101646104a5565b6040518082600281111561017457fe5b60ff16815260200191505060405180910390f35b6101906104b8565b604051808215151515815260200191505060405180910390f35b6101b26104cf565b005b6101bc6106bf565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6102066106e5565b6040518082815260200191505060405180910390f35b61024a6004803603602081101561023257600080fd5b810190808035151590602001909291905050506106eb565b005b6102546107cb565b005b61025e610a4f565b604051808215151515815260200191505060405180910390f35b6102ba6004803603602081101561028e57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610a7e565b005b6102fe600480360360208110156102d257600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610b85565b005b610308610c8b565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6103766004803603602081101561036057600080fd5b8101908080359060200190929190505050610cb0565b005b60025481565b600080600281111561038c57fe5b600160149054906101000a900460ff1660028111156103a757fe5b1461041a576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260068152602001807f215265616479000000000000000000000000000000000000000000000000000081525060200191505060405180910390fd5b6104226104b8565b1561048f57600254430160038190555060018060146101000a81548160ff0219169083600281111561045057fe5b02179055507fa64bb3be94822c94a1b10353c9cda615e3c092c8857f979e6082f7b60da490f46003546040518082815260200191505060405180910390a15b90565b600460009054906101000a900460ff1681565b600160149054906101000a900460ff1681565b6000600460009054906101000a900460ff16905090565b436003541115610547576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260138152602001807f21446f6e6520496e7665737469676174696e670000000000000000000000000081525060200191505060405180910390fd5b60028081111561055357fe5b600160149054906101000a900460ff16600281111561056e57fe5b14806105b057506001600281111561058257fe5b600160149054906101000a900460ff16600281111561059d57fe5b1480156105af57506105ad6104b8565b155b5b610622576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601e8152602001807f2150616964206f722021496e7665737469676174696e672b5061796f7574000081525060200191505060405180910390fd5b60028081111561062e57fe5b600160149054906101000a900460ff16600281111561064957fe5b148061068b57506001600281111561065d57fe5b600160149054906101000a900460ff16600281111561067857fe5b14801561068a57506106886104b8565b155b5b156106bd5760006003819055506000600160146101000a81548160ff021916908360028111156106b757fe5b02179055505b565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60035481565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146107ae576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600b8152602001807f21676f7665726e616e636500000000000000000000000000000000000000000081525060200191505060405180910390fd5b80600460006101000a81548160ff02191690831515021790555050565b600160028111156107d857fe5b600160149054906101000a900460ff1660028111156107f357fe5b14610866576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600e8152602001807f21496e7665737469676174696e6700000000000000000000000000000000000081525060200191505060405180910390fd5b4360035411156108de576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260138152602001807f21446f6e6520496e7665737469676174696e670000000000000000000000000081525060200191505060405180910390fd5b6108e66104b8565b610958576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600d8152602001807f215061796f7574204576656e740000000000000000000000000000000000000081525060200191505060405180910390fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166363bd1d4a6040518163ffffffff1660e01b8152600401602060405180830381600087803b1580156109c157600080fd5b505af11580156109d5573d6000803e3d6000fd5b505050506040513d60208110156109eb57600080fd5b8101908080519060200190929190505050506002600160146101000a81548160ff02191690836002811115610a1c57fe5b02179055507f354d7e40465161205ea9dee6ebfe67aee9bc460c83cd2397a35e68c5f6ef5e5160405160405180910390a1565b6000806002811115610a5d57fe5b600160149054906101000a900460ff166002811115610a7857fe5b14905090565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610b41576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600b8152602001807f21676f7665726e616e636500000000000000000000000000000000000000000081525060200191505060405180910390fd5b80600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610c48576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600b8152602001807f21676f7665726e616e636500000000000000000000000000000000000000000081525060200191505060405180910390fd5b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610d73576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600b8152602001807f21676f7665726e616e636500000000000000000000000000000000000000000081525060200191505060405180910390fd5b806002819055505056fea265627a7a72315820768b518ac1007b3557548f0802aa22cbe6311debc0dfd1af6b8dee192ec5a71064736f6c63430005110032"
}