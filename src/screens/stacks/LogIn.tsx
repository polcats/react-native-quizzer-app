import React, { useState, useContext, createRef } from 'react';
import { observer } from 'mobx-react-lite';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { useNavigation } from '@react-navigation/native';
import { userContext } from '../../models';
import styled from 'styled-components/native';

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
      <Form>
        <Header>Welcome</Header>
        <InputEmail
          ref={emailRef}
          defaultValue=""
          placeholder="Email"
          keyboardType="email-address"
          onChangeText={(text) => setEmail(text)}
        />
        <InputPw
          ref={pwRef}
          defaultValue=""
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text) => setPw(text)}
        />
        <LoginButton onPress={submitLogin} disabled={loggingIn}>
          <ButtonText>{loggingIn ? 'Logging in..' : 'Log In'}</ButtonText>
        </LoginButton>

        <SignUpButton>
          <ButtonText onPress={() => nav.navigate('Sign Up')}>
            Create Account
          </ButtonText>
        </SignUpButton>
      </Form>
    </TouchableWithoutFeedback>
  );
};

const Form = styled.View`
  flex: 1;
  background: skyblue;
  justify-content: center;
  padding: 20px;
`;

const Header = styled.Text`
  font-size: 45px;
  font-weight: bold;
  color: #fff;
  align-self: center;
  margin-bottom: 50px;
`;

const Input = styled.TextInput`
  background: #fff;
  color: #000;
  font-size: 15px;
  padding: 10px;
`;

const InputEmail = styled(Input)`
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const InputPw = styled(Input)`
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top-color: #eee;
  border-top-width: 1px;
`;

const Button = styled.TouchableOpacity`
  background: #fff;
  width: 100%;
  align-self: center;
  margin-top: 20px;
  border-radius: 10px;
`;

const LoginButton = styled(Button)`
  width: 100%;
  background: ${(props) => (props.disabled ? '#555' : '#fff')};
`;

const SignUpButton = styled(Button)`
  margin-top: 50px;
`;

const ButtonText = styled.Text`
  color: skyblue;
  font-size: 20px;
  text-align: center;
  padding: 10px;
`;

export default observer(LogIn);
