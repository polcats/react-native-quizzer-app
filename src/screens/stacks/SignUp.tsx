import React, { useState, useContext } from 'react';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import { TouchableWithoutFeedback, Keyboard, StyleSheet } from 'react-native';
import { Layout, Input, Text, Button } from '@ui-kitten/components';
import { userContext } from '../../models';

const SignUp: React.FC = () => {
  const userCtx = useContext(userContext);
  const nav = useNavigation();
  const closeKb = () => Keyboard.dismiss();

  const [fn, setFN] = useState('');
  const [ln, setLN] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPW] = useState('');
  const [createDisabled, setCreateDisabled] = useState(false);

  const [errEmail, setEmailErr] = useState('basic');
  const [errPW, setPWErr] = useState('basic');
  const [errFN, setFNErr] = useState('basic');
  const [errLN, setLNErr] = useState('basic');

  const fnRef = React.createRef<any>();
  const lnRef = React.createRef<any>();
  const emailRef = React.createRef<any>();
  const pwRef = React.createRef<any>();

  const createAcc = async () => {
    if (!fn) {
      fnRef.current?.focus();
      setFNErr('danger');
      showMessage({
        message: 'Please enter your first name.',
        type: 'danger',
      });
      return;
    }
    setFNErr('basic');

    if (!ln) {
      lnRef.current?.focus();
      setLNErr('danger');
      showMessage({
        message: 'Please enter your last name.',
        type: 'danger',
      });
      return;
    }
    setLNErr('basic');

    if (!email) {
      emailRef.current?.focus();
      setEmailErr('danger');
      showMessage({
        message: 'Please enter your email.',
        type: 'danger',
      });
      return;
    }
    setEmailErr('basic');

    if (!pw) {
      pwRef.current?.focus();
      setPWErr('danger');
      showMessage({
        message: 'Please enter your password.',
        type: 'danger',
      });
      return;
    }
    setPWErr('basic');
    setCreateDisabled(true);
    let res = await userCtx.signUp(fn, ln, email, pw);
    if (!res) {
      setCreateDisabled(false);
      showMessage({
        message: 'Registration failed.',
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
          First Name
        </Text>
        <Input
          style={styles.input}
          ref={fnRef}
          status={errFN}
          defaultValue={fn}
          onChangeText={(nextValue) => setFN(nextValue)}
        />
        <Text style={styles.text} category="h4">
          Last Name
        </Text>
        <Input
          style={styles.input}
          ref={lnRef}
          status={errLN}
          defaultValue={ln}
          onChangeText={(nextValue) => setLN(nextValue)}
        />

        <Text style={styles.text} category="h4">
          Email
        </Text>
        <Input
          style={styles.input}
          ref={emailRef}
          status={errEmail}
          keyboardType="email-address"
          defaultValue={email}
          onChangeText={(nextValue) => setEmail(nextValue)}
        />
        <Text style={styles.text} category="h4">
          Password
        </Text>
        <Input
          style={styles.input}
          ref={pwRef}
          status={errPW}
          secureTextEntry={true}
          defaultValue={pw}
          onChangeText={(nextValue) => setPW(nextValue)}
        />

        <Button
          style={styles.button}
          onPress={createAcc}
          disabled={createDisabled}
        >
          Register
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

export default SignUp;
