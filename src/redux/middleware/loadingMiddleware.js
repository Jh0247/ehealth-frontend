export const loadingMiddleware = (store) => (next) => (action) => {
  if (action.type.endsWith('/pending')) {
    store.dispatch({ type: 'loading/start' });
  } else if (action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected')) {
    store.dispatch({ type: 'loading/stop' });
  }
  return next(action);
};
