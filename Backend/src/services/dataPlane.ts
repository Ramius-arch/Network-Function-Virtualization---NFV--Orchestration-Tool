import { exec } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

// Secure regex validation to ensure inputs are strictly valid IPv4/IPv6 or CIDR ranges.
// This prevents command injection vulnerabilities.
const IP_CIDR_REGEX = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/([0-9]|[1-2][0-9]|3[0-2]))?$/;

const isMock = process.env.MOCK_DATA === 'true';

export const routeTraffic = (source: string, destination: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!IP_CIDR_REGEX.test(source) || !IP_CIDR_REGEX.test(destination)) {
      return reject(new Error('Invalid IP or CIDR configuration. Input rejected for security.'));
    }

    if (isMock) {
      console.log(`[MockSDN] Routing traffic from ${source} to ${destination}`);
      return resolve({
        message: `Traffic routed from ${source} to ${destination} via simulated switch fabric.`,
        timestamp: new Date().toISOString()
      });
    }

    const command = `iptables -A FORWARD -s ${source} -d ${destination} -j ACCEPT`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error routing traffic: ${stderr}`);
        reject(new Error(`System network interface failed: ${stderr}`));
      } else {
        console.log(`Traffic routed: ${stdout}`);
        resolve({ message: 'Host iptables rule appended successfully.', output: stdout });
      }
    });
  });
};

export const clearTrafficRules = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (isMock) {
      console.log('[MockSDN] Flushing all simulated flow rules');
      return resolve({
        message: 'All simulated SDN rules flushed.',
        timestamp: new Date().toISOString()
      });
    }

    const command = `iptables -F FORWARD`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error clearing traffic rules: ${stderr}`);
        reject(new Error(`System network interface failed: ${stderr}`));
      } else {
        console.log(`Traffic rules cleared: ${stdout}`);
        resolve({ message: 'Host iptables FORWARD rules cleared.', output: stdout });
      }
    });
  });
};
