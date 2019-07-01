/* @flow */
import { compose, createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import ReduxThunk from 'redux-thunk';
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';
import reducers from '@reducers';
import mySagas from '@sagas';
import {
  persistConfig,
  logger,
  initializeI18n,
} from '@config';


const sagaMiddleware = createSagaMiddleware();

// Note: createReactNavigationReduxMiddleware must be run before createReduxContainer
const routerMiddleware = createReactNavigationReduxMiddleware(
  state => state.nav,
);


export default function configureStore() {
  const middlewares = [];
  if (__DEV__) middlewares.push(logger);
  middlewares.push(routerMiddleware);
  middlewares.push(sagaMiddleware);
  middlewares.push(ReduxThunk);

  const persistedReducer = persistReducer(persistConfig, reducers);

  const store = createStore(
    persistedReducer,
    compose(
      applyMiddleware(...middlewares),
    ),
  );

  // run redux-saga
  sagaMiddleware.run(mySagas);

  // react-redux-i18n
  initializeI18n(store);

  persistStore(
    store,
    null,
  );

  return store;
}
