const cron = require('node-cron');
const axios = require('axios');

const EVERY_60_SECONDS = '*/60 * * * * *';

const ipApis: string[] = [
  'https://ip.seeip.org/',
  'https://api.ipify.org/',
  'https://api.my-ip.io/ip/',
];

function isValidIpv4Address(address: string): boolean {
  const validIpv4AddressRegex = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/
  return validIpv4AddressRegex.test(address);
}

async function getExternalIpAddress(): Promise<string> {
  let externalIpAddress: string = '';

  for (const ipApi of ipApis) {
    try {
      const response = await axios.get(ipApi);
      const ipAddress = response.data as string;

      if (isValidIpv4Address(ipAddress)) {
        externalIpAddress = ipAddress;
        break;
      }
    } catch (err) {
      console.error(`${err}`);
      continue;
    }
  }

  return externalIpAddress;
}

export default function() {
  return cron.schedule(EVERY_60_SECONDS, async () => {
    const currentExternalIpAddress = await getExternalIpAddress();

    if (!currentExternalIpAddress) {
      console.warn('IP address not found after checking all APIs')
    } 
    
    if (currentExternalIpAddress) {
      console.log('My IP address is: ', currentExternalIpAddress);
    }
  });
}
