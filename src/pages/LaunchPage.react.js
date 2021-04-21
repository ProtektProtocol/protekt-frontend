
import React from 'react';

// libraries
import { SocialIcon } from 'react-social-icons';
import  ITyped from 'react-ityped';
import {Nav,Form,Button,FormControl, Navbar} from 'react-bootstrap'

// hooks
import {Fragment, useEffect, useState} from 'react';


const LaunchPage = () => {

  const calculateTimeLeft = () => {
    let year = new Date().getFullYear();
    const difference = +new Date(`${year}-4-28`) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {


    timerComponents.push(
      <span className="launch-timer-container">
        <h1 className="launch-timer-value">{timeLeft[interval]}</h1> {interval}{" "}
      </span>
    );
  });

  const strings = ['Forget everything you know about DeFi Insurance','Protekt is launching on Mainnet.']

  return (
    <Fragment>
      <Navbar fixed="top">
        <div className="container launch-nav-container">
          <Navbar.Brand className="launch-brand" href="#home">
            <img 
              src={`${process.env.PUBLIC_URL}/assets/protekt-transparent.png`}
              className="launch-nav-logo"
            
            />
          </Navbar.Brand>
          <Nav className="mr-auto"/>
          <Nav.Link 
            href="https://protektprotocol.com/" 
          >
            <a className="launch-nav-text">
              Home
            </a>
          </Nav.Link>
          <Nav.Link 
            href="https://docs.protektprotocol.com/#/" 
          >
            <a className="launch-nav-text">
              Docs
            </a>
          </Nav.Link>
          <a  rel="noopener noreferrer" 
              href="https://t.me/protektdefi" 
              target="_blank"
          >
            <Button variant="outline-light">Join Telegram</Button>
          </a>
        </div>   
      </Navbar>
      <div className="launch-site-wrapper">
        <div className="launch-shine-container flicker-in-1">
          <img 
              src={`${process.env.PUBLIC_URL}/assets/shine-v2.png`} 
              className="launch-shine"
            
          />
        </div>
        
        <div className="navbar">
            <div className="launch-logo-container">
              <img 
                src={`${process.env.PUBLIC_URL}/assets/protekt.png`} 
                className="launch-logo flicker-in-1"
              />
            </div>
        </div>
        <div className="launch-main-content-container">
          <div className="launch-main-content">
            <div className="container">
              <div className="launch-heading-container">
                <ITyped className='launch-heading'
                    showCursor={false}
                    strings={strings}
                    typeSpeed={80}
                    backSpeed={30}
                    startDelay={0}
                    backDelay={3000}
                    disableBackTyping={true}
                />
              </div>
              <div classNam="launch-subheading-container">
                <p className="launch-sub-heading text-focus-in">Don't get Rekt. Use Protekt.</p>
              </div>
              
            </div>
            
          
            <div className="launch-timer-component">
              {timerComponents.length ? timerComponents : <span>Time's up!</span>}
            </div>

            
            
          </div>
        </div>
        <div className="launch-footer">
          <div>
            <SocialIcon 
              url="https://twitter.com/protektprotocol" 
              bgColor="#fff"
              className="launch-social-icon"
            />
            <SocialIcon 
              url="https://github.com/ProtektProtocol"
              bgColor="#fff" 
              className="launch-social-icon"
            />
            <SocialIcon 
              url="https://t.me/protektdefi" 
              bgColor="#fff"
              className="launch-social-icon"
            />
          </div>
          <div className="launch-footer-text">
            <p>Copyright © 2021 by Protekt Protocol</p>
          </div>
        </div>
      </div>
    </Fragment>
    
  );
}

export default LaunchPage;
