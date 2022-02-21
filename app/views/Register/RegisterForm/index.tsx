import React, { useState } from 'react';
import {
    Container,
    RadioInput,
    TextInput,
    PasswordInput,
    useInputState,
    Button,
    useAlert,
} from '@the-deep/deep-ui';
import { useHistory } from 'react-router-dom';
import {
    useForm,
    getErrorObject,
    createSubmitHandler,
    removeNull,
} from '@togglecorp/toggle-form';
import { useMutation, gql } from '@apollo/client';

import SmartButtonLikeLink from '#base/components/SmartButtonLikeLink';
import { register as registerStrings } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';
import { resolveToComponent } from '#base/utils/lang';
import routes from '#base/configs/routes';
import {
    transformToFormError,
    ObjectError,
} from '#base/utils/errorTransform';
import {
    UserUserType,
    RegisterMutation,
    RegisterMutationVariables,
} from '#generated/types';
import NonFieldError from '#components/NonFieldError';

import {
    PartialRegisterFormType,
    RegisterFormType,
    schema,
} from './common';

import { MunicipalityOption } from './LocationInput';
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
    /*
    {
        id: 'INDIVIDUAL_USER',
        title: 'Individual User',
    },
    {
        id: 'INSTITUTIONAL_USER',
        title: 'Institution',
    },
    */
    {
        id: 'SCHOOL_ADMIN',
        title: 'School',
    },
    {
        id: 'PUBLISHER',
        title: 'Publisher',
    },
];

const defaultFormValues: PartialRegisterFormType = {
    userType: 'SCHOOL_ADMIN',
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

    const strings = useTranslation(registerStrings);
    const alert = useAlert();
    const error = getErrorObject(formError);
    const history = useHistory();

    const [confirmPassword, setConfirmPassword] = useInputState<string | undefined>(undefined);

    const [
        municipalityOptions,
        setMunicipalityOptions,
    ] = useState<MunicipalityOption[] | undefined | null>();

    const [
        register,
        { loading: registerPending },
    ] = useMutation<RegisterMutation, RegisterMutationVariables>(
        REGISTER,
        {
            onCompleted: (response) => {
                const { register: registerResponse } = response;
                if (!registerResponse) {
                    return;
                }

                const {
                    ok,
                    errors,
                } = registerResponse;

                if (ok) {
                    alert.show(
                        strings.registrationSuccessMessage,
                        { variant: 'success' },
                    );
                    history.replace(routes.login.path);
                } else if (errors) {
                    const formErrorFromServer = transformToFormError(
                        removeNull(registerResponse?.errors) as ObjectError[],
                    );
                    setError(formErrorFromServer);

                    alert.show(
                        strings.registrationFailureMessage,
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

        return strings.passwordConfirmationError;
    }, [strings.passwordConfirmationError, confirmPassword, value?.password]);

    return (
        <Container
            className={styles.registerForm}
            heading={strings.pageHeading}
            headingSize="large"
            spacing="loose"
            footerContentClassName={styles.footerContent}
            footerContent={
                resolveToComponent(
                    strings.alreadyHaveAccountMessage,
                    {
                        loginLink: (
                            <SmartButtonLikeLink
                                className={styles.loginLink}
                                route={routes.login}
                                variant="transparent"
                            >
                                {strings.loginLinkLabel}
                            </SmartButtonLikeLink>
                        ),
                    },
                )
            }
        >
            <form
                className={styles.form}
                onSubmit={createSubmitHandler(validate, setError, handleSubmit)}
            >
                <NonFieldError error={error} />
                <TextInput
                    name="email"
                    label={strings.emailInputLabel}
                    value={value?.email}
                    error={error?.email}
                    onChange={setFieldValue}
                    disabled={registerPending}
                />
                <PasswordInput
                    name="password"
                    label={strings.passwordInputLabel}
                    value={value?.password}
                    error={error?.password}
                    onChange={setFieldValue}
                    disabled={registerPending}
                />
                <PasswordInput
                    name={undefined}
                    label={strings.confirmPasswordInputLabel}
                    value={confirmPassword}
                    error={confirmationError}
                    onChange={setConfirmPassword}
                    disabled={registerPending}
                />
                <TextInput
                    name="phoneNumber"
                    label={strings.phoneNumberInputLabel}
                    value={value?.phoneNumber}
                    error={error?.phoneNumber}
                    onChange={setFieldValue}
                    disabled={registerPending}
                />
                <RadioInput
                    name="userType"
                    options={userTypes}
                    label={strings.userTypeInputLabel}
                    keySelector={userKeySelector}
                    labelSelector={userLabelSelector}
                    onChange={setFieldValue}
                    value={value.userType}
                    error={error?.userType}
                    disabled={registerPending}
                />
                {value.userType === 'INDIVIDUAL_USER' && (
                    <>
                        <TextInput
                            name="firstName"
                            label={strings.firstNameInputLabel}
                            value={value?.firstName}
                            error={error?.firstName}
                            onChange={setFieldValue}
                            disabled={registerPending}
                        />
                        <TextInput
                            name="lastName"
                            label={strings.lastNameInputLabel}
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
                        municipalityOptions={municipalityOptions}
                        onMunicipalityOptionsChange={setMunicipalityOptions}
                    />
                )}
                {value.userType === 'PUBLISHER' && (
                    <PublisherForm
                        name="publisher"
                        value={value.publisher}
                        onChange={setFieldValue}
                        error={error?.publisher}
                        disabled={registerPending}
                        municipalityOptions={municipalityOptions}
                        onMunicipalityOptionsChange={setMunicipalityOptions}
                    />
                )}
                {value.userType === 'SCHOOL_ADMIN' && (
                    <SchoolForm
                        name="school"
                        value={value.school}
                        onChange={setFieldValue}
                        error={error?.school}
                        disabled={registerPending}
                        municipalityOptions={municipalityOptions}
                        onMunicipalityOptionsChange={setMunicipalityOptions}
                    />
                )}
                <Button
                    className={styles.registerButton}
                    name={undefined}
                    type="submit"
                    disabled={registerPending}
                >
                    {strings.registerButtonLabel}
                </Button>
            </form>
        </Container>
    );
}

export default RegisterForm;
