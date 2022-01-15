import React from 'react';
import { generatePath } from 'react-router-dom';
import {
    Container,
    RadioInput,
    TextInput,
    PasswordInput,
    useInputState,
    Button,
    useAlert,
    ButtonLikeLink,
} from '@the-deep/deep-ui';
import {
    PartialForm,
    useForm,
    getErrorObject,
    createSubmitHandler,
    removeNull,
} from '@togglecorp/toggle-form';
import { useMutation, gql } from '@apollo/client';

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
    RegisterFormType,
    RegistrationFields,
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

// FIXME: fetch this from the server
const userType: UserType[] = [
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

const defaultFormValues: PartialForm<RegisterFormType> = {
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
                    alert.show('No response from server!');
                    return;
                }

                if (registerResponse?.ok) {
                    alert.show(
                        'Registration completed successfully! Please validate your account before loggin in',
                        { variant: 'success' },
                    );
                } else if (registerResponse?.errors) {
                    const formErrorFromServer = transformToFormError(
                        removeNull(registerResponse?.errors) as ObjectError[],
                    );
                    setError(formErrorFromServer);

                    alert.show(
                        'Error during registration!',
                        { variant: 'error' },
                    );
                }
            },
        },
    );

    const handleSubmit = React.useCallback((formValues: Partial<RegisterFormType>) => {
        const finalValues = { ...formValues } as RegistrationFields;

        register({ variables: { data: finalValues } });
    }, [register]);

    const confirmationError = React.useMemo(() => {
        if (confirmPassword === value?.password) {
            return undefined;
        }

        return 'Password doesn\'t match';
    }, [confirmPassword, value?.password]);

    return (
        <Container
            className={styles.registerForm}
            heading="Register new User"
            headingSize="large"
            spacing="loose"
            footerContentClassName={styles.footerContent}
            footerContent={(
                <>
                    Already have an account?
                    &nbsp;
                    <ButtonLikeLink
                        className={styles.loginLink}
                        to={generatePath(routes.login.path)}
                        variant="transparent"
                    >
                        Login
                    </ButtonLikeLink>
                </>
            )}
        >
            <form
                className={styles.form}
                onSubmit={createSubmitHandler(validate, setError, handleSubmit)}
            >
                <RadioInput
                    name="userType"
                    options={userType}
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
                    label="Email"
                    value={value?.email}
                    error={error?.email}
                    onChange={setFieldValue}
                    placeholder="johndoe@email.com"
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
                <TextInput
                    name="phoneNumber"
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
                            label="First Name"
                            value={value?.firstName}
                            error={error?.firstName}
                            onChange={setFieldValue}
                            disabled={registerPending}
                        />
                        <TextInput
                            name="lastName"
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
                >
                    Register
                </Button>
            </form>
        </Container>
    );
}

export default RegisterForm;
