import React, { useCallback } from 'react';

import { generatePath, useHistory } from 'react-router-dom';

import { useMutation, gql } from '@apollo/client';

import {
    TextInput,
    PasswordInput,
    Button,
    useInputState,
    useAlert,
} from '@the-deep/deep-ui';

import {
    ObjectSchema,
    PartialForm,
    emailCondition,
    requiredStringCondition,
    lengthGreaterThanCondition,
    lengthSmallerThanCondition,
    useForm,
    getErrorObject,
    createSubmitHandler,
    removeNull,
} from '@togglecorp/toggle-form';

import {
    UserUserType,
    RegisterMutation,
    RegisterMutationVariables,
} from '#generated/types';
import routes from '#base/configs/routes';
import { transformToFormError, ObjectError } from '#base/utils/errorTransform';

import styles from './styles.css';

function IndividualUserForm() {
    const {
        pristine,
        value,
        error: riskyError,
        setFieldValue,
        validate,
        setError,
    } = useForm(schema, initialValue);

    const alert = useAlert();
    const history = useHistory();

    const error = getErrorObject(riskyError);
    const [confirmPassword, setConfirmPassword] = useInputState<string>('');

    const [
        register,
        { loading: registerPending },
    ] = useMutation<RegisterMutation, RegisterMutationVariables>(
        REGISTER,
        {
            onCompleted: (response) => {
                console.info('Registeration completed', response);
                const { register: registerRes } = response;
                if (!register) {
                    return;
                }
                const {
                    ok,
                    errors,
                } = registerRes ?? {};

                if (ok) {
                    alert.show(
                        'Registration completed successfully!',
                        {
                            variant: 'success',
                        },
                    );
                    history.push(generatePath(routes.login.path));
                } else if (errors) {
                    const formError = transformToFormError(removeNull(errors) as ObjectError []);
                    setError(formError);

                    alert.show(
                        'Error during registration',
                        {
                            variant: 'error',
                        },
                    );
                }
            },
        },
    );

    const handleSubmit = useCallback((finalValue) => {
        register({
            variables: {
                email: finalValue?.email,
                password: finalValue?.password,
                firstName: finalValue?.firstName,
                lastName: finalValue?.lastName,
                phoneNumber: finalValue?.phoneNumber,
                userType: 'INDIVIDUAL_USER',
            },
        });
    }, []);

    const confirmationError = React.useMemo(() => {
        if (confirmPassword === value?.password) {
            return undefined;
        }

        return 'Password doesn\'t match';
    }, [confirmPassword, value?.password]);

    return (
        <form
            className={styles.registerForm}
            onSubmit={createSubmitHandler(validate, setError, handleSubmit)}
        >
            <TextInput
                name="email"
                label="Email"
                value={value?.email}
                error={error?.email}
                onChange={setFieldValue}
                placeholder="johndoe@email.com"
                disabled={registerPending}
            />
            <TextInput
                name="firstName"
                label="First Name"
                value={value?.firstName}
                error={error?.firstName}
                onChange={setFieldValue}
                placeholder="John"
                disabled={registerPending}
            />
            <TextInput
                name="lastName"
                label="Last Name"
                value={value?.lastName}
                error={error?.lastName}
                onChange={setFieldValue}
                placeholder="John Doe"
                disabled={registerPending}
            />
            <TextInput
                name="phoneNumber"
                label="Phone Number"
                value={value?.phoneNumber}
                error={error?.phoneNumber}
                onChange={setFieldValue}
                disabled={registerPending}

            />
            <PasswordInput
                name="password"
                label="Password"
                value={value?.password}
                error={error?.password}
                onChange={setFieldValue}
                disabled={registerPending}
            />
            <PasswordInput
                name="confirm-password"
                label="Confirm Password"
                value={confirmPassword}
                error={confirmationError}
                onChange={setConfirmPassword}
                disabled={registerPending}
            />
            <Button
                name="register"
                className={styles.submit}
                type="submit"
                variant="primary"
                disabled={pristine || registerPending}
            >
                Register
            </Button>
        </form>
    );
}

export default IndividualUserForm;
