// @flow

import React, { useContext, useState, useEffect } from 'react';
import NumberFormat from 'react-number-format';
import ReactPlayer from "react-player"

import {
  Page,
  Grid,
  Dimmer,
  Text,
  Form,
  Header
} from "tabler-react";
import Confetti from 'react-confetti'

import Button from "../components/tablerReactAlt/src/components/Button";

import {
  Accordion
} from 'react-accessible-accordion';

import Card from "../components/tablerReactAlt/src/components/Card";
import DefiTrainEarningsCard from "../components/DefiTrainEarningsCard";
import SiteWrapper from "../SiteWrapper.react";

import { useTokenPrices, useLendingMarketMetrics, useAddressBalances, useContractLoader, useInterval } from "../hooks";
import { default as protektData } from "../data";
import { infuraProvider } from "../config";
import { GetBalanceOfERC20ForAddress } from '../utils'

import _ from 'lodash';


import { Web3Context } from '../App.react';


/*  
    Page does not require a connected wallet - simply pull from the contract address passed in params
    - for new users who may not have a wallet initially connected.
*/

const Onboarding = ({match, location})  => {

 

  return (
    <SiteWrapper>
        <Grid.Row className="d-flex justify-content-center">
          <Grid.Col sm={12} lg={8}>
            <Card className="mt-9" title={(<h2 className="mb-0">What is DeFi and how do I join the movement?</h2>)}>
            <Card.Body>
                <Text>
🤔 DeFi is the umbrella term for the <b>new financial system</b> being built on blockchain technology (like bitcoin!) without banks.
                </Text>
                <br/>
                <Text>
🤩 Bitcoin only lets you send bitcoin, but DeFi lets you trade numerous tokens and even access traditional financial instruments like borrowing (loans) and saving!
                </Text>
                <br/>
                <Text>
🙋‍♂️ If you want to learn more about what DeFi is as a whole we've attached a quick overview below.
                </Text>
                <br/>
                <div>
                    <ReactPlayer
                        url="https://www.youtube.com/watch?v=KlvaNiYK3q4"
                    />
                 </div>
                <br/>
                <Text>
👛 We have set you up your very own wallet (details on your invite email) and your friend has kindly deposited you funds where they are earning interest in <a target="_blank" rel="noreferrer noopener"  href="https://aave.com/">Aave</a>
                </Text>
                <br/>
                <Text>
🦊 To set up your wallet you need a wallet provider, our favourite one to use is <a target="_blank" rel="noreferrer noopener" href="https://metamask.io/">MetaMask</a> and its trusted by millions of user! We have attached a video below showing how to install and use it. When you install the extension, you need to <b>import account</b> and use the <b>private key</b> we sent on the email (seen at 4:15 in the video!).
                </Text>
                <br/>
                <div>
                    <ReactPlayer
                        url="https://www.youtube.com/watch?v=Sc8J98m6SZE"
                    />
                 </div>
                <br/>
                <Text>
🙋‍♂️ Next you probably want to check out other decentralized apps and use your $50 or get more tokens....
                </Text>
                <br/>
                <Text>
👨‍🏫  We have a few guides below explaining our favourite protocols if you want to learn more.
                </Text>
                <br/>
                <br/>
                <Text>
👻 Using <a target="_blank" rel="noreferrer noopener"  href="https://aave.com/">Aave</a> you can deposit tokens and earn interest, this is where your $50 is currently deposited. You can also get loans!
                </Text>
                <br/>
                <div>
                    <ReactPlayer
                        url="https://www.youtube.com/watch?v=qq-Z0-b4sUw"
                    />
                 </div>
                <br/>
                <br/>
                <br/>
                <Text>
🦄 Or head over to <a target="_blank" rel="noreferrer noopener" href="https://app.uniswap.org/">Uniswap</a> where you can exchange tokens and swap them !
                </Text>
                <br/>
                <div>
                    <ReactPlayer
                        url="https://www.youtube.com/watch?v=5sVwLCEtcnk"
                    />
                 </div>
                <br/>

                <Text>
Cheers,<br/>
🛡🛡 <a href={`https://www.protektprotocol.com/`} target="_blank">Protekt Protocol Team</a> 🛡🛡
                </Text>
            </Card.Body>
            </Card>
          </Grid.Col>
        </Grid.Row>

      
      
    </SiteWrapper>
  )
}

export default Onboarding;