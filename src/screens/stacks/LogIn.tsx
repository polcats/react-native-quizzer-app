import React, { useState, useContext, createRef } from 'react';
import { observer } from 'mobx-react-lite';
import { TouchableWithoutFeedback, Keyboard, StyleSheet } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { useNavigation } from '@react-navigation/native';
import { userContext } from '../../models';
import { Layout, Input, Text, Button } from '@ui-kitten/components';

const LogIn: React.FC = () => {
  const nav = useNavigation();
  const userCtx = useContext(userContext);
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const emailRef = React.createRef<any>();
  const pwRef = createRef<any>();

  const closeKb = () => Keyboard.dismiss();
  const submitLogin = async () => {
    if (!email) {
      emailRef.current?.focus();
      showMessage({
        message: 'Please enter a valid email address..',
        type: 'danger',
      });
      return;
    }
    if (!pw) {
      pwRef.current?.focus();
      showMessage({
        message: 'Please enter a password',
        type: 'danger',
      });
      return;
    }
    setLoggingIn(true);
    const success = await userCtx.logIn(email, pw);
    if (!success) {
      setLoggingIn(false);
    }
  };

  React.useLayoutEffect(() => {
    nav.setOptions({
      headerTitleAlign: 'center',
    });
  }, [nav]);

  return (
    <TouchableWithoutFeedback onPress={closeKb}>
      <Layout>
        <Text style={styles.text} category="h4">
          Email
        </Text>
        <Input
          ref={emailRef}
          keyboardType="email-address"
          defaultValue={email}
          onChangeText={(nextValue) => setEmail(nextValue)}
        />
        <Text style={styles.text} category="h4">
          Password
        </Text>
        <Input
          ref={pwRef}
          secureTextEntry={true}
          defaultValue={pw}
          onChangeText={(nextValue) => setPw(nextValue)}
        />

        <Button
          style={styles.button}
          onPress={submitLogin}
          disabled={loggingIn}
        >
          Log In
        </Button>
        <Button style={styles.button} onPress={() => nav.navigate('Sign Up')}>
          Create Account
        </Button>
      </Layout>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  text: {
    margin: 2,
  },

  button: {
    margin: 2,
  },
});

export default observer(LogIn);
