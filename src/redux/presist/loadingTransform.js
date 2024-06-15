import { createTransform } from 'redux-persist';

const loadingTransform = createTransform(
  (inboundState, key) => {
    return inboundState;
  },
  (outboundState, key) => {
    return false;
  },
  { whitelist: ['loading'] }
);

export default loadingTransform;
