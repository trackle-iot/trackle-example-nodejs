import { Trackle } from 'trackle-library-nodejs';
import wlogger from './logger';
const logger = wlogger(module);

const DEVICE_ID = 'IlTuoId'; // string
const PRIVATE_KEY = 'LaTuaChiavePrivataPEM'; // PEM string

/*
  Or get DER binary from file
  const PRIVATE_KEY = fs.readFileSync('PercorsoDellaTuaChiavePrivataDER'); // DER file
*/

/* 
 * Connected event
 */
Trackle.on('connected', () => logger.info('[CLOUD] Handshake completed'));

/*
 * Other events
 *
  Trackle.on('connect', ({ host, port }) => logger.info('[DEVICE] Connecting to '+host+ ':' +port));
  Trackle.on('connectionError', (err: Error) => logger.error('[DEVICE] Connection error '+err.message));
  Trackle.on('error', (err: Error) => logger.error('[DEVICE] Global error '+err.message));
  Trackle.on('disconnect', () => logger.info('[DEVICE] Disconnected'));
  Trackle.on('reconnect', () => logger.info('[DEVICE] Reconnecting...'));
  Trackle.on('publish', ({ eventName }) => logger.info('[DEVICE] Sent ' + eventName));
  Trackle.on('publishCompleted', () => logger.info('[CLOUD] Publish completed'));
  Trackle.on('time', (timestamp: number) => logger.info('[CLOUD] Got time: '+timestamp));
*/

/* Expose a get named "variable" */
Trackle.get('variable', 'double', (): number => {
  logger.info('[CLOUD] Ask for variable');
  return 20.40;
});

/* Expose a post named "action" */
Trackle.post('action', (args: string): number => {
  logger.info(`[CLOUD] Called action for ${args}`);
  return 1;
});

/* Subscribe to the event "sub" */
Trackle.subscribe('sub', (event: string, data: string) => {
  logger.info(`[DEVICE] Received ${event} with value ${data}`);
}, 'ALL_DEVICES');

/* Begin and connect */
Trackle.begin(DEVICE_ID, PRIVATE_KEY).then(() => {
  Trackle.connect();

  /* Publish an event every 10s */
  setInterval(() => Trackle.publish('event', 'Hello Trackle from my device'), 10000);
}).catch((error) => logger.error(error.message));
