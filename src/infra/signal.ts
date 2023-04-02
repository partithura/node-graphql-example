import { rootLogger } from './logger';

const ctrl = new AbortController();

const events: NodeJS.Signals[] = ['SIGTERM', 'SIGINT', 'SIGQUIT'];

let aborted = false;

const getSignal = (): AbortSignal => ctrl.signal;
const abort = (signal?: string): void => {
  if (aborted) {
    return;
  }

  aborted = true;
  rootLogger.warn({ signal }, 'aborting application');
  ctrl.abort();
};

events.forEach((eventName) => {
  process.addListener(eventName, abort);
});

export { getSignal, abort };
