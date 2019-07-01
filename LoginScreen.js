/* @flow */
import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { withScreen, withRequest } from '@hoc';
import { FormLogin as Form } from '@forms';
import { Typo } from '@ui';
import type { ScreenPropsType } from '@types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// Wrap with request's HOC
const FormLogin = withRequest(Form, 'login');


const styles = StyleSheet.create({
  awareScrollView: {
    flexGrow: 1,
  },
  contentContainerStyleScrollView: {
    flexGrow: 1,
    flexDirection: 'column',
  },
  wrapperTitle: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 60,
    marginBottom: 10,
  },
  wrapperForm: {
    flexGrow: 1,
  },
});

type StateType = {|
  isKeyboardVisible: boolean,
|};

class LoginScreen extends PureComponent<ScreenPropsType, StateType> {

  state = {
    isKeyboardVisible: false,
  }

  onKeyboardWillShow = () => this.setState({ isKeyboardVisible: true })

  onKeyboardWillHide = () => this.setState({ isKeyboardVisible: false })

  render() {
    const {
      screenContent: {
        title,
        linkLabel,
        buttonLabel,
      },
      withScreenProps: {
        auth: { loginEmail },
      }
    } = this.props;

    const { isKeyboardVisible } = this.state;

    return (
      <KeyboardAwareScrollView
        style={styles.awareScrollView}
        contentContainerStyle={styles.contentContainerStyleScrollView}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={!global.isIOS}
        // enableResetScrollToCoords // provoke a bug on iOS after error alert (small bounce)
        // -- iOS only
        alwaysBounceVertical={false}
        onKeyboardWillShow={global.isIOS ? this.onKeyboardWillShow : undefined}
        onKeyboardWillHide={global.isIOS ? this.onKeyboardWillHide : undefined}
        // -- Android only
        enableOnAndroid
        onKeyboardDidShow={global.isAndroid ? this.onKeyboardWillShow : undefined}
        onKeyboardDidHide={global.isAndroid ? this.onKeyboardWillHide : undefined}
      >
        <View style={styles.wrapperTitle}>
          <Typo label={title} type="pageH1" />
        </View>
        <View style={styles.wrapperForm}>
          <FormLogin
            initialValues={{
              email: loginEmail,
            }}
            navigation={this.props.navigation}
            linkLabel={linkLabel}
            submitLabel={buttonLabel}
            isKeyboardVisible={isKeyboardVisible}
          />
        </View>
        {global.isIOS && <KeyboardSpacer topSpacing={0} />}
      </KeyboardAwareScrollView>
    );
  }

}

export default withScreen(LoginScreen, { screenName: 'Login' });
