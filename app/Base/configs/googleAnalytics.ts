import { InitializeOptions } from 'react-ga';
import { isDebugMode } from './env';

export const trackingId = process.env.REACT_APP_GA_TRACKING_ID;

export const gaConfig: InitializeOptions = {
    debug: isDebugMode,
    testMode: isDebugMode,
    gaOptions: {
        userId: undefined,
    },
};
