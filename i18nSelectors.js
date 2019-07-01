/* @flow */
import { createSelector } from 'reselect';
import type {
  StoreStateType,
  I18nStateType,
  TranslationType,
  StringsType,
} from '@types';

export const selectI18nState = createSelector(
  (state: StoreStateType) => state.i18n,
  (i18n: I18nStateType) => i18n,
);

export const selectTranslation = createSelector(
  (state: StoreStateType) => {
    const { locale, translations } = state.i18n;
    return translations[locale];
  },
  (translation: TranslationType) => translation,
);

export const selectLocale = createSelector(
  (state: StoreStateType) => state.i18n.locale,
  (locale: string) => locale,
);

export const selectStrings: (state: StoreStateType) => StringsType = createSelector(
  selectTranslation,
  (translation: TranslationType) => translation.strings,
);
