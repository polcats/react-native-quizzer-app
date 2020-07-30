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
  const [errEmail, setEmailErr] = useState('basic');
  const [errPW, setPWErr] = useState('basic');

  const emailRef = React.createRef<any>();
  const pwRef = createRef<any>();

  const closeKb = () => Keyboard.dismiss();
  const submitLogin = async () => {
    let err = false;

    if (!email) {
      emailRef.current?.focus();
      setEmailErr('danger');
      showMessage({
        message: 'Please enter a valid email address..',
        type: 'danger',
      });

      err = true;
    } else {
      setEmailErr('basic');
    }

    if (!pw) {
      setPWErr('danger');

      if (!err) {
        pwRef.current?.focus();
        showMessage({
          message: 'Please enter a password',
          type: 'danger',
        });
      }

      err = true;
    } else {
      setPWErr('basic');
    }

    if (err) {
      return;
    }

    setLoggingIn(true);
    const success = await userCtx.logIn(email, pw);
    if (!success) {
      setLoggingIn(false);
      showMessage({
        message: 'Log in failed.',
        type: 'danger',
      });
    }
  };

  React.useLayoutEffect(() => {
    nav.setOptions({
      headerTitleAlign: 'center',
    });
  }, [nav]);

  return (
    <TouchableWithoutFeedback onPress={closeKb}>
      <Layout style={styles.container}>
        <Text style={styles.text} category="h4">
          Email
        </Text>
        <Input
          status={errEmail}
          style={styles.input}
          ref={emailRef}
          keyboardType="email-address"
          defaultValue={email}
          onChangeText={(nextValue) => setEmail(nextValue)}
        />
        <Text style={styles.text} category="h4">
          Password
        </Text>
        <Input
          status={errPW}
          style={styles.input}
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
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    margin: 2,
  },
  text: {
    margin: 2,
  },
  button: {
    margin: 2,
  },
});

export default observer(LogIn);
