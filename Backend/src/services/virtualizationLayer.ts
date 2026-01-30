import { exec } from 'child_process';

export const deployVirtualFunction = (functionName: string, image: string) => {
  return new Promise((resolve, reject) => {
    const command = `docker run -d --name ${functionName} ${image}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error deploying virtual function: ${stderr}`);
        reject(error);
      } else {
        console.log(`Virtual function deployed: ${stdout}`);
        resolve(stdout);
      }
    });
  });
};

export const removeVirtualFunction = (functionName: string) => {
  return new Promise((resolve, reject) => {
    const command = `docker rm -f ${functionName}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error removing virtual function: ${stderr}`);
        reject(error);
      } else {
        console.log(`Virtual function removed: ${stdout}`);
        resolve(stdout);
      }
    });
  });
};
