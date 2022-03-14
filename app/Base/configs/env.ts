export const isStaging = process.env.REACT_APP_ENVIRONMENT === 'staging';
export const isDebugMode = process.env.REACT_APP_DEBUG_MODE?.toLowerCase() === 'true';
