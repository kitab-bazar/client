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

import {
    transformToFormError,
    ObjectError,
} from '#base/utils/errorTransform';

import {
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

const userType: UserType[] = [
    {
        id: 'ADMIN',
        title: 'Admin',
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
    {
        id: 'INDIVIDUAL_USER',
        title: 'Individual User',
    },
];

const defaultFormValues: PartialForm<RegisterFormType> = {
    userType: 'INDIVIDUAL_USER',
};

const userKeySelector = (u: UserType) => u.id;
const userLabelSelector = (u: UserType) => u.title;

const REGISTER = gql`
    mutation RegisterMutation (
        $email: String!
        $name: String
        $password: String!
        $phoneNumber: String
        $userType: user_type
    ) {
        register(data: {
            email: $email
            firstName: $name
            lastName: $name
            password: $password
            phoneNumber: $phoneNumber
            userType: $userType
        }) {
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

                const {
                    ok,
                    errors,
                } = registerResponse ?? {};

                if (ok) {
                    alert.show(
                        'Registration completed successfully! Please validate your account before loggin in',
                        { variant: 'success' },
                    );
                } else if (errors) {
                    const formErrorFromServer = transformToFormError(
                        removeNull(errors) as ObjectError[],
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

    const handleSubmit = React.useCallback((formValues: PartialForm<RegisterFormType>) => {
        const finalValues = { ...formValues } as RegisterFormType;
        switch (formValues.userType) {
            case 'PUBLISHER':
                delete finalValues.institution;
                delete finalValues.school;
                break;
            case 'SCHOOL_ADMIN':
                delete finalValues.institution;
                delete finalValues.publisher;
                break;
            case 'INSTITUTIONAL_USER':
                delete finalValues.school;
                delete finalValues.publisher;
                break;
            default:
                delete finalValues.school;
                delete finalValues.institution;
                delete finalValues.publisher;
                break;
        }

        // TODO: Fix typing error;
        register({ variables: finalValues });
    }, [register]);

    const confirmationError = React.useMemo(() => {
        if (confirmPassword === value?.password) {
            return undefined;
        }

        return 'Password doesn\'t match';
    }, [confirmPassword, value?.password]);

    const pending = false;

    return (
        <Container
            className={styles.registerForm}
            heading="Register new User"
            headingSize="large"
            spacing="loose"
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
                />
                <TextInput
                    name="email"
                    label="Email"
                    value={value?.email}
                    error={error?.email}
                    onChange={setFieldValue}
                    placeholder="johndoe@email.com"
                    disabled={pending}
                />
                <PasswordInput
                    name="password"
                    label="Password"
                    value={value?.password}
                    error={error?.password}
                    onChange={setFieldValue}
                    disabled={pending}
                />
                <PasswordInput
                    name="confirm-password"
                    label="Confirm Password"
                    value={confirmPassword}
                    error={confirmationError}
                    onChange={setConfirmPassword}
                    disabled={pending}
                />
                <TextInput
                    name="phoneNumber"
                    label="Phone Number"
                    value={value?.phoneNumber}
                    error={error?.phoneNumber}
                    onChange={setFieldValue}
                    disabled={pending}
                />
                {value.userType === 'INSTITUTIONAL_USER' && (
                    <InstitutionForm
                        name="institution"
                        value={value.institution}
                        onChange={setFieldValue}
                        error={error?.institution}
                    />
                )}
                {value.userType === 'PUBLISHER' && (
                    <PublisherForm
                        name="publisher"
                        value={value.publisher}
                        onChange={setFieldValue}
                        error={error?.publisher}
                    />
                )}
                {value.userType === 'SCHOOL_ADMIN' && (
                    <SchoolForm
                        name="school"
                        value={value.school}
                        onChange={setFieldValue}
                        error={error?.school}
                    />
                )}
                <Button
                    name={undefined}
                    type="submit"
                    disabled={registerPending}
                >
                    Submit
                </Button>
            </form>
        </Container>
    );
}

export default RegisterForm;
