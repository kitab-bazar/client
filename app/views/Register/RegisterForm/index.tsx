import React from 'react';
import {
    Container,
    RadioInput,
    TextInput,
    PasswordInput,
    useInputState,
    Button,
    useAlert,
} from '@the-deep/deep-ui';
import {
    useForm,
    getErrorObject,
    createSubmitHandler,
    removeNull,
} from '@togglecorp/toggle-form';
import { useMutation, gql } from '@apollo/client';

import NonFieldError from '#components/NonFieldError';
import SmartButtonLikeLink from '#base/components/SmartButtonLikeLink';
import {
    UserUserType,
    RegisterMutation,
    RegisterMutationVariables,
} from '#generated/types';
import routes from '#base/configs/routes';

import {
    transformToFormError,
    ObjectError,
} from '#base/utils/errorTransform';

import {
    PartialRegisterFormType,
    RegisterFormType,
    schema,
} from './common';

import InstitutionForm from './InstitutionForm';
import PublisherForm from './PublisherForm';
import SchoolForm from './SchoolForm';
import styles from './styles.css';

interface UserType {
    id: UserUserType;
    title: string;
}

// TODO: fetch this from the server
const userTypes: UserType[] = [
    {
        id: 'INDIVIDUAL_USER',
        title: 'Individual User',
    },
    {
        id: 'PUBLISHER',
        title: 'Publisher',
    },
    {
        id: 'INSTITUTIONAL_USER',
        title: 'Institution',
    },
    {
        id: 'SCHOOL_ADMIN',
        title: 'School',
    },
];

const defaultFormValues: PartialRegisterFormType = {
    userType: 'INDIVIDUAL_USER',
};

const userKeySelector = (u: UserType) => u.id;
const userLabelSelector = (u: UserType) => u.title;

const REGISTER = gql`
    mutation Register($data: RegisterInputType!) {
        register(data: $data) {
            errors
            ok
        }
    }
`;

function RegisterForm() {
    const {
        setFieldValue,
        value,
        error: formError,
        validate,
        setError,
    } = useForm(schema, defaultFormValues);

    const alert = useAlert();

    const error = getErrorObject(formError);

    const [confirmPassword, setConfirmPassword] = useInputState<string | undefined>(undefined);

    const [
        register,
        { loading: registerPending },
    ] = useMutation<RegisterMutation, RegisterMutationVariables>(
        REGISTER,
        {
            onCompleted: (response) => {
                const { register: registerResponse } = response;
                if (!registerResponse) {
                    // FIXME: translate
                    alert.show('No response from server!');
                    return;
                }

                const {
                    ok,
                    errors,
                } = registerResponse;

                if (ok) {
                    alert.show(
                        // FIXME: translate
                        'Registration completed successfully! Please validate your account before loggin in',
                        { variant: 'success' },
                    );
                } else if (errors) {
                    const formErrorFromServer = transformToFormError(
                        removeNull(registerResponse?.errors) as ObjectError[],
                    );
                    setError(formErrorFromServer);

                    alert.show(
                        // FIXME: translate
                        'Error during registration!',
                        { variant: 'error' },
                    );
                }
            },
            onError: (errors) => {
                alert.show(
                    errors.message,
                    { variant: 'error' },
                );
            },
        },
    );

    const handleSubmit = React.useCallback((formValues: PartialRegisterFormType) => {
        const finalValues = formValues as RegisterFormType;
        register({
            variables: { data: finalValues },
        });
    }, [register]);

    const confirmationError = React.useMemo(() => {
        if (confirmPassword === value?.password) {
            return undefined;
        }

        // FIXME: translate
        return 'Password doesn\'t match';
    }, [confirmPassword, value?.password]);

    return (
        <Container
            className={styles.registerForm}
            // FIXME: translate
            heading="Register new User"
            headingSize="large"
            spacing="loose"
            footerContentClassName={styles.footerContent}
            // FIXME: translate
            footerContent={(
                <>
                    Already have an account?
                    &nbsp;
                    <SmartButtonLikeLink
                        className={styles.loginLink}
                        route={routes.login}
                        variant="transparent"
                    >
                        Login
                    </SmartButtonLikeLink>
                </>
            )}
        >
            <form
                className={styles.form}
                onSubmit={createSubmitHandler(validate, setError, handleSubmit)}
            >
                <NonFieldError error={error} />
                <RadioInput
                    name="userType"
                    options={userTypes}
                    // FIXME: translate
                    label="Select User Type"
                    keySelector={userKeySelector}
                    labelSelector={userLabelSelector}
                    onChange={setFieldValue}
                    value={value.userType}
                    error={error?.userType}
                    disabled={registerPending}
                />
                <TextInput
                    name="email"
                    // FIXME: translate
                    label="Email"
                    value={value?.email}
                    error={error?.email}
                    onChange={setFieldValue}
                    disabled={registerPending}
                />
                <PasswordInput
                    name="password"
                    // FIXME: translate
                    label="Password"
                    value={value?.password}
                    error={error?.password}
                    onChange={setFieldValue}
                    disabled={registerPending}
                />
                <PasswordInput
                    name={undefined}
                    // FIXME: translate
                    label="Confirm Password"
                    value={confirmPassword}
                    error={confirmationError}
                    onChange={setConfirmPassword}
                    disabled={registerPending}
                />
                <TextInput
                    name="phoneNumber"
                    // FIXME: translate
                    label="Phone Number"
                    value={value?.phoneNumber}
                    error={error?.phoneNumber}
                    onChange={setFieldValue}
                    disabled={registerPending}
                />
                {value.userType === 'INDIVIDUAL_USER' && (
                    <>
                        <TextInput
                            name="firstName"
                            // FIXME: translate
                            label="First Name"
                            value={value?.firstName}
                            error={error?.firstName}
                            onChange={setFieldValue}
                            disabled={registerPending}
                        />
                        <TextInput
                            name="lastName"
                            // FIXME: translate
                            label="Last Name"
                            value={value?.lastName}
                            error={error?.lastName}
                            onChange={setFieldValue}
                            disabled={registerPending}
                        />
                    </>
                )}
                {value.userType === 'INSTITUTIONAL_USER' && (
                    <InstitutionForm
                        name="institution"
                        value={value.institution}
                        onChange={setFieldValue}
                        error={error?.institution}
                        disabled={registerPending}
                    />
                )}
                {value.userType === 'PUBLISHER' && (
                    <PublisherForm
                        name="publisher"
                        value={value.publisher}
                        onChange={setFieldValue}
                        error={error?.publisher}
                        disabled={registerPending}
                    />
                )}
                {value.userType === 'SCHOOL_ADMIN' && (
                    <SchoolForm
                        name="school"
                        value={value.school}
                        onChange={setFieldValue}
                        error={error?.school}
                        disabled={registerPending}
                    />
                )}
                <Button
                    className={styles.registerButton}
                    name={undefined}
                    type="submit"
                    disabled={registerPending}
                    // FIXME: translate
                >
                    Register
                </Button>
            </form>
        </Container>
    );
}

export default RegisterForm;
