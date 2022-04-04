import React, { useCallback, useContext, useRef, useMemo, useState } from 'react';
import { isDefined } from '@togglecorp/fujs';
import {
    TextInput,
    Container,
    PasswordInput,
    Button,
    useAlert,
} from '@the-deep/deep-ui';
import { gql, useMutation } from '@apollo/client';
import Captcha from '@hcaptcha/react-hcaptcha';

import {
    PurgeNull,
    ObjectSchema,
    PartialForm,
    requiredStringCondition,
    useForm,
    internal,
    createSubmitHandler,
    emailCondition,
    lengthGreaterThanCondition,
    lengthSmallerThanCondition,
    getErrorObject,
    removeNull,
} from '@togglecorp/toggle-form';

import HCaptcha from '#components/HCaptcha';
import { hCaptchaKey } from '#base/configs/env';
import SmartButtonLikeLink from '#base/components/SmartButtonLikeLink';
import SmartLink from '#base/components/SmartLink';
import NonFieldError from '#components/NonFieldError';
import { login as loginStrings } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';
import routes from '#base/configs/routes';
import { LoginMutation, LoginMutationVariables } from '#generated/types';
import { UserContext } from '#base/context/UserContext';
import { transformToFormError, ObjectError } from '#base/utils/errorTransform';
import ErrorMessage from '#components/ErrorMessage';

import styles from './styles.css';

const LOGIN = gql`
    mutation Login(
        $email: String!,
        $password: String!,
        $captcha: String,
        $siteKey: String,
    ) {
        login(data: {
            password: $password,
            email: $email,
            captcha: $captcha,
            siteKey: $siteKey,
        }) {
            captchaRequired
            errors
            ok
            result {
                email
                firstName
                id
                isActive
                lastLogin
                lastName
                canonicalName
                userType
                isVerified
                institution {
                    id
                    name
                }
                publisher {
                    id
                    name
                }
                school {
                    id
                    name
                }
                allowedPermissions
            }
        }
    }
`;

type FormType = PurgeNull<LoginMutationVariables>;
type PartialFormType = PartialForm<FormType>;

type FormSchema = ObjectSchema<PartialFormType>;

type FormSchemaFields = ReturnType<FormSchema['fields']>;

const schema = (captchaRequired: boolean): FormSchema => ({
    fields: (): FormSchemaFields => {
        let basicFields: FormSchemaFields = {
            email: [
                emailCondition,
                requiredStringCondition,
            ],
            password: [
                requiredStringCondition,
                lengthGreaterThanCondition(4),
                lengthSmallerThanCondition(129),
            ],
        };
        if (captchaRequired) {
            basicFields = {
                ...basicFields,
                captcha: [requiredStringCondition],
            };
        }
        return basicFields;
    },
});

const initialValue: PartialFormType = {};

function LoginForm() {
    const [captchaRequired, setCaptchaRequired] = useState(false);

    const mySchema = useMemo(
        () => schema(captchaRequired),
        [captchaRequired],
    );

    const {
        pristine,
        value,
        error: riskyError,
        setFieldValue,
        validate,
        setError,
    } = useForm(mySchema, initialValue);

    const elementRef = useRef<Captcha>(null);
    const strings = useTranslation(loginStrings);

    const { setUser } = useContext(UserContext);

    const error = getErrorObject(riskyError);

    const alert = useAlert();

    const [
        login,
        { loading: loginPending },
    ] = useMutation<LoginMutation, LoginMutationVariables>(
        LOGIN,
        {
            onCompleted: (response) => {
                const { login: loginRes } = response;
                if (!loginRes) {
                    return;
                }
                const {
                    errors,
                    result,
                    captchaRequired: captchaRequiredFromResponse,
                    ok,
                } = loginRes;

                if (captchaRequiredFromResponse) {
                    setCaptchaRequired(captchaRequiredFromResponse);
                }

                if (ok) {
                    const safeUser = removeNull(result);
                    setUser({
                        id: safeUser.id,
                        displayName: safeUser.canonicalName,
                        displayPictureUrl: undefined,
                        type: safeUser.userType,
                        permissions: safeUser.allowedPermissions,
                        publisherId: safeUser.publisher?.id,
                        isVerified: safeUser.isVerified,
                    });
                } else if (errors) {
                    const formError = transformToFormError(removeNull(errors) as ObjectError[]);
                    setError(formError);
                    // eslint-disable-next-line no-console
                    console.error(formError);
                    alert.show(
                        <ErrorMessage
                            header={strings.errorLoggingInLabel}
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
                        header={strings.errorLoggingInLabel}
                        description={errors.message}
                    />,
                    { variant: 'error' },
                );
            },
        },
    );

    const handleSubmit = useCallback((finalValue: PartialFormType) => {
        elementRef.current?.resetCaptcha();
        login({
            variables: {
                ...finalValue,
                siteKey: hCaptchaKey,
            } as FormType,
        });
    }, [login]);

    return (
        <form
            className={styles.loginForm}
            onSubmit={createSubmitHandler(validate, setError, handleSubmit)}
        >
            <Container
                className={styles.loginFormContainer}
                heading={strings.loginHeaderLabel}
                headingSize="large"
                headingClassName={styles.heading}
                contentClassName={styles.inputContainer}
                spacing="loose"
                footerIcons={(
                    <SmartLink
                        route={routes.forgotPassword}
                        state={{ email: value?.email }}
                    >
                        {strings.forgotPasswordLabel}
                    </SmartLink>
                )}
                footerActions={(
                    <Button
                        className={styles.loginButton}
                        name="login"
                        type="submit"
                        variant="primary"
                        disabled={loginPending || pristine}
                    >
                        {strings.loginButtonLabel}
                    </Button>
                )}
            >
                <NonFieldError error={error} />
                <TextInput
                    name="email"
                    onChange={setFieldValue}
                    label={strings.emailLabel}
                    value={value?.email}
                    error={error?.email}
                    disabled={loginPending}
                />
                <PasswordInput
                    name="password"
                    onChange={setFieldValue}
                    label={strings.passwordLabel}
                    value={value?.password}
                    error={error?.password}
                    disabled={loginPending}
                />
                {captchaRequired && (
                    <HCaptcha
                        name="captcha"
                        elementRef={elementRef}
                        siteKey={hCaptchaKey}
                        onChange={setFieldValue}
                        error={error?.captcha}
                    />
                )}
            </Container>
            <div className={styles.footerContent}>
                {strings.donotHaveAccountYetLabel}
                &nbsp;
                <SmartButtonLikeLink
                    className={styles.registerLink}
                    route={routes.register}
                    variant="transparent"
                >
                    {strings.registerlabel}
                </SmartButtonLikeLink>
            </div>
        </form>
    );
}
export default LoginForm;
