/* @flow */
import { call, all, put, takeLatest, takeEvery, select } from 'redux-saga/effects';
import type { Saga as SagaType } from 'redux-saga';
import { Keyboard } from 'react-native';
import _ from 'lodash';
import md5 from '@md5';
import { reset, SubmissionError } from 'redux-form';
import * as actions from '@actions';
import {
  FORM_SUBMIT,
  FORM_SUBMIT_ASYNC_ERRORS,
  FORM_RESET,
  FORM_RESET_LOGOUT,
} from '@actionsTypes';
import md5 from '@md5';
import { selectAppFormOptions, selectAppForms } from '@selectors';
import type {
  StoreStateType,
  FormSubmitActionType,
  FormSubmitAsyncErrorsActionType,
  FormNamesType,
} from '@types';



function* formSubmit({ formName, values, formOwnProps, reject }: FormSubmitActionType): * {
  try {
    const formOptions = yield select((state: StoreStateType) => selectAppFormOptions(state, formName));
    const { submitUrl } = formOptions;

    if (submitUrl) {
      const payload = {
        url: submitUrl,
        values,
        options: formOptions,
        reject,
        formProps: formOwnProps,
      };

      yield put(actions.apiRequest({
        requestName: 'form',
        payload,
      }));
    }
    else if (formName === 'login') {
      Keyboard.dismiss();

      if (values.email && values.password) {
        yield put(actions.apiRequest({
          requestName: 'login',
          payload: {
            email: values.email,
            password: md5(values.password),
            reject,
          },
        }));
      }
    }
    else if (formName === 'signup') {
      // ...
    }
    else if (formName === 'profile') {
      // ...
    }
  }
  catch (e) {
    console.log(e); // eslint-disable-line no-console
  }
}


function* formReset(action: { type: string, payload: { formName: FormNamesType }}): * {
  const { formName } = action.payload;
  if (formName) yield put(reset(formName));
}

// eslint-disable-next-line require-yield
function* submitAsynErrors({ formName, formErrors, reject }: FormSubmitAsyncErrorsActionType): * {
  /* NOTE: "reject" is passed from the onSubmit function (withForm HOC). It allows
    to trigger erros after server response.
    see: https://github.com/redux-saga/redux-saga/issues/161#issuecomment-191312502
         https://github.com/redux-saga/redux-saga/issues/161#issuecomment-227556218
  */
  try {
    yield call(reject, new SubmissionError(formErrors));
  }
  catch (e) {
    yield call(console.log, e); // eslint-disable-line no-console
  }
}

function* formSagas(): SagaType<void> {
  yield all([
    takeEvery(FORM_SUBMIT, formSubmit),
    takeEvery(FORM_SUBMIT_ASYNC_ERRORS, submitAsynErrors),
    takeEvery(FORM_RESET, formReset),
  ]);
}

export default [formSagas];
