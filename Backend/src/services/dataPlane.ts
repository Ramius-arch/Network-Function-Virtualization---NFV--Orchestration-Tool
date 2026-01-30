import { exec } from 'child_process';

export const routeTraffic = (source: string, destination: string) => {
  return new Promise((resolve, reject) => {
    const command = `iptables -A FORWARD -s ${source} -d ${destination} -j ACCEPT`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error routing traffic: ${stderr}`);
        reject(error);
      } else {
        console.log(`Traffic routed: ${stdout}`);
        resolve(stdout);
      }
    });
  });
};

export const clearTrafficRules = () => {
  return new Promise((resolve, reject) => {
    const command = `iptables -F FORWARD`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error clearing traffic rules: ${stderr}`);
        reject(error);
      } else {
        console.log(`Traffic rules cleared: ${stdout}`);
        resolve(stdout);
      }
    });
  });
};
