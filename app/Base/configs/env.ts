export const isStaging = process.env.REACT_APP_ENVIRONMENT === 'staging';
export const isDebugMode = process.env.REACT_APP_DEBUG_MODE?.toLowerCase() === 'true';
export const hCaptchaKey = process.env.REACT_APP_HCATPCHA_SITEKEY || '10000000-ffff-ffff-ffff-000000000001';
