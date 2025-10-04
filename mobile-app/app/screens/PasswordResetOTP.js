import React, {useState} from 'react';
import {StyleSheet, Text, Alert, TouchableOpacity} from 'react-native';
import * as Yup from 'yup';

import {Form, FormField, SubmitButton} from '../components/forms';
import routes from '../navigation/routes';

import defaultStyles from '../config/styles';
import RegistrationContainer from '../components/forms/RegistrationContainer';
import colors from '../config/colors';
import authService from '../services/auth.service';

const validationSchema = Yup.object().shape({
  otp: Yup.string('Invalid Code')
    .required()
    .label('Verification code')
    .length(6),
});

export default function PasswordResetOTP({navigation, route}) {
  const {email: username} = route?.params;

  const [message, setMessage] = useState({
    text: 'Shareup has sent you a verification code to the email',
    type: 'default',
    isSending: false,
  });

  const [loading, setLoading] = React.useState(false);

  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        e.preventDefault();
        Alert.alert(
          'Discard changes?',
          'Are you sure to discard and leave the screen?',
          [
            {text: "Don't leave", style: 'cancel', onPress: () => {}},
            {
              text: 'Discard',
              style: 'destructive',
              onPress: () => navigation.dispatch(e.data.action),
            },
          ],
        );
      }),
    [navigation],
  );

  const handleSubmit = async (values, props) => {
    const {setFieldError} = props;

    setLoading(true);
    authService
      .verifyPasswordResetOTP(username, values.otp)
      .then(res => {
        if (res.status === 200) {
          navigation.navigate(routes.PASSWORD_RESET, {
            username,
          });
        }
      })
      .catch(e => {
        if (e.message === 'Request failed with status code 400')
          setFieldError('otp', 'Incorrect code');
        else if (e.message === 'Request failed with status code 408')
          setFieldError('otp', 'Code expired');
        else setFieldError('otp', 'Unexpected error.');
      })
      .finally(() => setLoading(false));
  };

  const resendOTP = () => {
    setMessage({...message, isSending: true});
    authService

      .passwordResetOTP(username)
      .then(res =>
        res.status === 200
          ? setMessage({
              isSending: false,
              text: 'Shareup has re-sent your verification code',
              type: 'success',
            })
          : null,
      )
      .catch(e =>
        setMessage({
          isSending: false,
          text: 'Verification code not send',
          type: 'error',
        }),
      );
  };

  return (
    <RegistrationContainer title="Forgot Password">
      <Form
        initialValues={{
          otp: '',
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}>
        <Text
          style={
            message.type === 'success'
              ? {color: 'green'}
              : message.type === 'error' && 'crimson'
          }>
          {message.text}
        </Text>
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="number-pad"
          name="otp"
          placeholder="Verification code"
          textContentType="number" // Only for ios
          style={defaultStyles.formField}
        />
        <Text>Verification code will expire after 5 minutes</Text>
        <TouchableOpacity
          activeOpacity={0.6}
          style={{
            marginVertical: 5,
            backgroundColor: '#cacaca60',
            paddingHorizontal: 15,
            paddingVertical: 6,
            borderRadius: 30,
          }}
          disabled={message.isSending}>
          <Text
            style={{color: colors.iondigoDye, fontWeight: '700'}}
            onPress={resendOTP}>
            {message.isSending ? 'Sending..' : 'Re-send'}
          </Text>
        </TouchableOpacity>

        <SubmitButton
          title="Verify"
          disabled={loading}
          style={styles.submitButton}
        />
      </Form>
    </RegistrationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  submitButton: {
    alignSelf: 'center',
    width: '60%',
    paddingTop: '10%',
  },
});
