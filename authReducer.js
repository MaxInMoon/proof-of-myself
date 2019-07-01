/* @flow */
import {
  API_REQUEST,
  API_REQUEST_SUCCEEDED,
  API_REQUEST_FAILED,
  LOGOUT,
} from '@actionsTypes';
import { REHYDRATE } from 'redux-persist/lib/constants';
import type {
  AuthStateType,
  ApiRequestActionType,
  ApiRequestSucceededActionType,
  ApiRequestFailedActionType,
} from '@types';


const stayConnected = true;

const initialState: AuthStateType = {
  stayConnected,
  hasAlreadyLoggedIn: false,
  token: '',
  clientToken: '',
  uid: '',
  loginEmail: '',
  isAuthentificated: false,
  hasValidatedPeristedAuthToken: false,
};


const reducers = {
  [REHYDRATE]: (state, action) => {
    const payload = action.payload || { auth: initialState };
    const persistedAuth = payload.auth;

    if (persistedAuth) {
      return {
        ...state,
        ...persistedAuth,
        isAuthentificated: persistedAuth.isAuthentificated
          && !!persistedAuth.token
          && !!persistedAuth.loginEmail,
        hasValidatedPeristedAuthToken: false,
      };
    }
    return state;
  },
  [LOGOUT]: (state) => {
    return {
      ...initialState,
      hasAlreadyLoggedIn: state.hasAlreadyLoggedIn,
      loginEmail: state.loginEmail,
    };
  },
  [API_REQUEST]: (state, action: ApiRequestActionType) => {
    const { requestName, payload } = action;
    if (requestName === 'login') {
      return {
        ...state,
        stayConnected,
      };
    }
    return state;
  },
  [API_REQUEST_SUCCEEDED]: (state, action: ApiRequestSucceededActionType) => {
    const {
      accessToken,
      clientToken,
      uid,
      requestName,
      response,
      requestPayload,
    } = action;

    if (requestName === 'login') {
      return {
        ...state,
        hasAlreadyLoggedIn: true,
        token: accessToken,
        clientToken,
        uid,
        isAuthentificated: !!accessToken,
        hasValidatedPeristedAuthToken: !!accessToken,
        isLoading: false,
        loginEmail: requestPayload.email || initialState.loginEmail,
      };
    }
    else if (requestName === 'signup') {
      return {
        ...state,
        hasAlreadyLoggedIn: true,
        token: accessToken,
        clientToken,
        uid,
        isAuthentificated: !!accessToken,
        hasValidatedPeristedAuthToken: !!accessToken,
        isLoading: false,
        loginEmail: requestPayload.email || initialState.loginEmail,
      };
    }
    return state;
  },
  [API_REQUEST_FAILED]: (state, action: ApiRequestFailedActionType) => {
    const { requestName, response, requestPayload } = action; // eslint-disable-line no-unused-vars
    if (requestName === 'login') {
      return {
        ...state,
        isLoading: false,
        isAuthentificated: false,
        hasValidatedPeristedAuthToken: false,
        token: '',
        clientToken: '',
        uid: '',
        loginEmail: requestPayload.email || initialState.loginEmail,
      };
    }
    return state;
  },
};

// eslint-disable-next-line flowtype/no-weak-types
export const authReducer = (state: AuthStateType = initialState, action: Object) => {
  if (reducers[action.type]) {
    return reducers[action.type](state, action);
  }
  return state;
};
