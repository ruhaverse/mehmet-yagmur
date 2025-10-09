import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Formik, FormikProps, FormikValues } from 'formik';
import * as Yup from 'yup';

interface FormProps<T extends FormikValues> {
  children: ReactNode | ((formikProps: FormikProps<T>) => ReactNode);
  initialValues: T;
  validationSchema?: Yup.ObjectSchema<any>;
  onSubmit: (values: T) => void | Promise<void>;
  style?: ViewStyle;
  enableReinitialize?: boolean;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

function Form<T extends FormikValues>({
  children,
  initialValues,
  validationSchema,
  onSubmit,
  style,
  enableReinitialize = false,
  validateOnChange = true,
  validateOnBlur = true,
}: FormProps<T>) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize={enableReinitialize}
      validateOnChange={validateOnChange}
      validateOnBlur={validateOnBlur}
    >
      {(formikProps) => (
        <View style={[styles.container, style]}>
          {typeof children === 'function' ? children(formikProps) : children}
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Form;