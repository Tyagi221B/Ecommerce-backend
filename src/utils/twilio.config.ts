import twilio from 'twilio';

const accountSid = 'ACb92357a01a9c9ceaecc709aa54773850';
const authToken = '0161dd53d39ede1394e65828aca4125e';
const serviceSid = 'VA27c5829f167216a054f3181db8bdb0e7';

// const accountSid = 'AC717be11de78b14b98fbf222ca3ed588f';
// const authToken = 'eb4ae9f8cba8908fcb1eaccbd53bebaa';
// const serviceSid = 'VA097c9b5f466c656bea57173e7ee881ed';

const client = twilio(accountSid, authToken);

export { client, serviceSid };
