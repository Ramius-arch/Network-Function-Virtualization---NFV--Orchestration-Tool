import { exec } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

const isMock = process.env.MOCK_DATA === 'true';

// Whitelist of allowed legacy CLI commands to prevent Remote Code Execution (RCE)
const ALLOWED_COMMANDS_REGEX = /^(show ip (route|ospf neighbor detail|interface brief)|ping -c [1-5] [a-zA-Z0-9\.]+|curl -I https?:\/\/[a-zA-Z0-9\.\-_/]+)$/;

export const wrapLegacyFunction = (legacyCommand: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (isMock) {
      console.log(`[MockLegacy] Wrapping command: ${legacyCommand}`);
      return resolve({
        translated_command: legacyCommand,
        orchestrator_hook: "cli_gateway_v2",
        execution_status: "proxy_success",
        raw_output_buffer: `Mock VNF translation payload for command: "${legacyCommand}"`
      });
    }

    // Safety validation
    if (!ALLOWED_COMMANDS_REGEX.test(legacyCommand)) {
      return reject(new Error('Command rejected: Command not in the legacy whitelist or contains illegal characters.'));
    }

    exec(legacyCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error wrapping legacy function: ${stderr}`);
        reject(new Error(`Legacy execution failed: ${stderr}`));
      } else {
        console.log(`Legacy command output: ${stdout}`);
        resolve({
          translated_command: legacyCommand,
          orchestrator_hook: "cli_gateway_v2",
          execution_status: "proxy_success",
          raw_output_buffer: stdout
        });
      }
    });
  });
};

export const testLegacyAPI = (apiUrl: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    // Sanitize API URL to prevent injection attacks
    const URL_REGEX = /^https?:\/\/[a-zA-Z0-9\.\-_/:]+$/;
    if (!URL_REGEX.test(apiUrl)) {
      return reject(new Error('Invalid URL endpoint provided for integration testing.'));
    }

    if (isMock) {
      console.log(`[MockLegacy] Probing endpoint: ${apiUrl}`);
      return resolve({
        endpoint: apiUrl,
        latency: "14ms",
        auth_type: "None",
        health: "accessible",
        response_snippet: "{\"system_status\": \"nominal\", \"fan_rpm\": 4500}"
      });
    }

    const command = `curl -I ${apiUrl}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error testing legacy API: ${stderr}`);
        reject(new Error(`Probe failed: ${stderr}`));
      } else {
        console.log(`Legacy API response: ${stdout}`);
        resolve({
          endpoint: apiUrl,
          latency: "22ms",
          auth_type: "None",
          health: "accessible",
          response_snippet: stdout
        });
      }
    });
  });
};
