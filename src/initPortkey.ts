import { DID } from '@portkey/did';

export const did = new DID();

did.setConfig({
  // Modify the value corresponding to the following fields
  requestDefaults: {
    baseURL: 'your did server node',
    timeout: 30000, // optional default 8000ms
  },
});
