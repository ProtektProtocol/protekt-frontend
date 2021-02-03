import sendGrid from "@sendgrid/mail";

// this should probably just be renamed to "notifier"
// it is basically just a wrapper around BlockNative's wonderful Notify.js
// https://docs.blocknative.com/notify

export default function SendEmail(email,address,privateKey) {
    sendGrid.setApiKey(`${process.env.SENDGRID_API_KEY}`);

    const message = 'Public Key: '+address+"\n\n"+
                    'Private Key: '+privateKey+"\n\n"
                    ;
   
    const msg = {
        to: email,
        from: 'defitrain@protektprotocol.com',
        subject: 'All aboard! You have been gifted a ticket for the DeFi train',
        text: message
      };

    // sendGrid.send(msg).then(result =>{
    //     return true
    // }).catch(err =>{
    //     return false
    // });
    console.log(message)
}
