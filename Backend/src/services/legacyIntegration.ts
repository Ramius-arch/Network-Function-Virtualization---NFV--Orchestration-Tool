import { exec } from 'child_process';

export const wrapLegacyFunction = (legacyCommand: string) => {
  return new Promise((resolve, reject) => {
    exec(legacyCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error wrapping legacy function: ${stderr}`);
        reject(error);
      } else {
        console.log(`Legacy function wrapped: ${stdout}`);
        resolve(stdout);
      }
    });
  });
};

export const testLegacyAPI = (apiUrl: string) => {
  return new Promise((resolve, reject) => {
    const command = `curl -I ${apiUrl}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error testing legacy API: ${stderr}`);
        reject(error);
      } else {
        console.log(`Legacy API response: ${stdout}`);
        resolve(stdout);
      }
    });
  });
};
