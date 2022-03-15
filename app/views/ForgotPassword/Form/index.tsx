import React, { useMemo, useState, useCallback, useRef } from 'react';
import { isDefined } from '@togglecorp/fujs';
import {
    TextInput,
    Container,
    Button,
    useAlert,
} from '@the-deep/deep-ui';
import { useLocation } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';

import {
    ObjectSchema,
    PartialForm,
    requiredStringCondition,
    useForm,
    internal,
    createSubmitHandler,
    emailCondition,
    getErrorObject,
    removeNull,
} from '@togglecorp/toggle-form';

import Captcha from '@hcaptcha/react-hcaptcha';
import HCaptcha from '#components/HCaptcha';
import SmartLink from '#base/components/SmartLink';
import NonFieldError from '#components/NonFieldError';
import ErrorMessage from '#components/ErrorMessage';
import { resetPassword as resetPasswordStrings } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';
import routes from '#base/configs/routes';
import { hCaptchaKey } from '#base/configs/env';
import {
    GenerateResetPasswordTokenMutation,
    GenerateResetPasswordTokenMutationVariables,
} from '#generated/types';
import { transformToFormError, ObjectError } from '#base/utils/errorTransform';

import styles from './styles.css';

const FORGOT_PASSWORD = gql`
    mutation generateResetPasswordToken(
        $email: String!,
        $captcha: String!,
        $siteKey: String!,
    ) {
        generateResetPasswordToken(data: {
            email: $email,
            captcha: $captcha,
            siteKey: $siteKey,
        }) {
            errors
            ok
        }
    }
`;

type FormType = GenerateResetPasswordTokenMutationVariables;
type PartialFormType = PartialForm<FormType>;

type FormSchema = ObjectSchema<PartialFormType>;

type FormSchemaFields = ReturnType<FormSchema['fields']>;

const schema: FormSchema = {
    fields: (): FormSchemaFields => {
        const basicFields: FormSchemaFields = {
            email: [
                emailCondition,
                requiredStringCondition,
            ],
            captcha: [requiredStringCondition],
        };
        return basicFields;
    },
};

const defaultFormValue: PartialFormType = {};

function ForgotPasswordForm() {
    const elementRef = useRef<Captcha>(null);
    const [resetPasswordSuccessStatus, setResetPasswordSuccessStatus] = useState(false);

    const {
        state,
    } = useLocation();
    const emailFromState = (state as { email?: string } | undefined)?.email;

    const initialValue = useMemo(
        (): PartialFormType => (emailFromState ? { email: emailFromState } : defaultFormValue),
        [emailFromState],
    );

    const {
        pristine,
        value,
        error: riskyError,
        setFieldValue,
        validate,
        setError,
    } = useForm(schema, initialValue);

    const strings = useTranslation(resetPasswordStrings);

    const error = getErrorObject(riskyError);

    const alert = useAlert();

    const [
        resetPassword,
        {
            loading: resetPasswordPending,
        },
    ] = useMutation<
        GenerateResetPasswordTokenMutation,
        GenerateResetPasswordTokenMutationVariables
    >(
        FORGOT_PASSWORD,
        {
            onCompleted: (response) => {
                const { generateResetPasswordToken: resp } = response;
                if (!resp) {
                    return;
                }
                const {
                    errors,
                    ok,
                } = resp;

                if (ok) {
                    alert.show(
                        strings.resetPasswordEmailSentLabel,
                        { variant: 'success' },
                    );
                    setResetPasswordSuccessStatus(true);
                } else if (errors) {
                    const formError = transformToFormError(removeNull(errors) as ObjectError[]);
                    setError(formError);
                    alert.show(
                        <ErrorMessage
                            header={strings.errorResettingPassword}
                            description={
                                isDefined(formError)
                                    ? formError[internal]
                                    : undefined
                            }
                        />,
                        { variant: 'error' },
                    );
                }
            },
            onError: (errors) => {
                setError({
                    [internal]: errors.message,
                });
                alert.show(
                    <ErrorMessage
                        header={strings.errorResettingPassword}
                        description={errors.message}
                    />,
                    { variant: 'error' },
                );
            },
        },
    );

    const handleSubmit = useCallback((finalValue: PartialFormType) => {
        elementRef.current?.resetCaptcha();
        resetPassword({
            variables: {
                ...finalValue,
                siteKey: hCaptchaKey,
            } as FormType,
        });
    }, [resetPassword]);

    return (
        <form
            className={styles.resetPasswordForm}
            onSubmit={createSubmitHandler(validate, setError, handleSubmit)}
        >
            <Container
                className={styles.resetPasswordFormContainer}
                heading={strings.resetPasswordHeaderLabel}
                headingSize="large"
                headingClassName={styles.heading}
                contentClassName={styles.inputContainer}
                spacing="loose"
                footerIcons={(
                    <SmartLink
                        route={routes.login}
                    >
                        {strings.loginLabel}
                    </SmartLink>
                )}
                footerActions={!resetPasswordSuccessStatus && (
                    <Button
                        name={undefined}
                        type="submit"
                        variant="primary"
                        disabled={resetPasswordPending || pristine}
                    >
                        {strings.resetPasswordButtonLabel}
                    </Button>
                )}
            >
                {resetPasswordSuccessStatus ? (
                    strings.resetPasswordEmailSentLabel
                ) : (
                    <>
                        <NonFieldError error={error} />
                        <TextInput
                            name="email"
                            onChange={setFieldValue}
                            label={strings.emailLabel}
                            value={value?.email}
                            error={error?.email}
                            disabled={resetPasswordPending}
                        />
                        <HCaptcha
                            name="captcha"
                            elementRef={elementRef}
                            siteKey={hCaptchaKey}
                            onChange={setFieldValue}
                            error={error?.captcha}
                        />
                    </>
                )}
            </Container>
        </form>
    );
}
export default ForgotPasswordForm;
