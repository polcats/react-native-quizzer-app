import React from 'react';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';

const SignUp: React.FC = () => {
  const nav = useNavigation();
  const closeKb = () => Keyboard.dismiss();

  React.useLayoutEffect(() => {
    nav.setOptions({
      headerTitleAlign: 'center',
    });
  }, [nav]);

  return (
    <TouchableWithoutFeedback onPress={closeKb}>
      <Form>
        <Header>User Details</Header>
        <InputFName placeholder="First Name" />
        <InputLName placeholder="Last Name" />
        <InputEmail placeholder="Email" />
        <InputPw placeholder="Password" secureTextEntry={true} />
        <SignUpButton>
          <ButtonText>Sign Up</ButtonText>
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

const InputTopBorder = styled(Input)`
  border-top-color: #eee;
  border-top-width: 1px;
`;

const InputFName = styled(Input)`
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const InputLName = styled(InputTopBorder)``;
const InputEmail = styled(InputTopBorder)``;

const InputPw = styled(InputTopBorder)`
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`;

const Button = styled.TouchableOpacity`
  background: #fff;
  width: 100%;
  align-self: center;
  margin-top: 20px;
  border-radius: 10px;
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

export default SignUp;
