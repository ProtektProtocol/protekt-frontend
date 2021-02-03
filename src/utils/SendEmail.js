import sendGrid from "@sendgrid/mail";

// this should probably just be renamed to "notifier"
// it is basically just a wrapper around BlockNative's wonderful Notify.js
// https://docs.blocknative.com/notify

export default async function SendEmail(email,address,privateKey) {
    sendGrid.setApiKey(process.env.SENDGRID_API_KEY);

    const message = `
    // Some intro message \n
    \n
    public key: ${address}\n
    private key: ${privateKey} * Do not share this with anyone!\n
    \n
    Your dashboard to see your earnings: https://defitrain.com/your-earnings/${address}\n
    \n
    Instructions ......\n
    \n
    Cheers,\n
    Protekt Protocol Team
    
    `
   
    const msg = {
        to: email,
        from: 'byrnes68@tcd.ie',
        subject: 'All aboard! You have been gifted a ticket for the DeFi train',
        text: message
      };

    /*
        Finish logic below when email access works for sendgrid
    */
   
    sendGrid   
        .send(msg)
        .then(result =>{
            console.log(result)
            console.log()
            return true
        })
        .catch(err =>{
            console.log(err)
            return false
        });
}
