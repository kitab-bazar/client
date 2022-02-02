import React, { useCallback, useContext } from 'react';
import { generatePath } from 'react-router-dom';
import {
    TextInput,
    Container,
    PasswordInput,
    Button,
    ButtonLikeLink,
    useAlert,
} from '@the-deep/deep-ui';
import { gql, useMutation } from '@apollo/client';

import {
    ObjectSchema,
    PartialForm,
    requiredStringCondition,
    useForm,
    createSubmitHandler,
    emailCondition,
    lengthGreaterThanCondition,
    lengthSmallerThanCondition,
    getErrorObject,
    removeNull,
} from '@togglecorp/toggle-form';

import { loginLang } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';
import routes from '#base/configs/routes';
import { LoginMutation, LoginMutationVariables } from '#generated/types';
import { UserContext } from '#base/context/UserContext';
import { transformToFormError, ObjectError } from '#base/utils/errorTransform';

import styles from './styles.css';

interface LoginFields {
    email: string;
    password: string;
    // captcha?: string;
}

const LOGIN = gql`
    mutation Login(
        $email: String!,
        $password: String!,
    ) {
        login(data: {
            password: $password,
            email: $email,
        }) {
            errors
            ok
            result {
                fullName
                id
                userType
            }
        }
    }
`;

type FormType = Partial<LoginFields>;

type FormSchema = ObjectSchema<PartialForm<FormType>>;

type FormSchemaFields = ReturnType<FormSchema['fields']>;

const schema: FormSchema = {
    fields: (): FormSchemaFields => {
        const basicFields: FormSchemaFields = {
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
        return basicFields;
    },
};

const initialValue: FormType = {};

function LoginForm() {
    const {
        pristine,
        value,
        error: riskyError,
        setFieldValue,
        validate,
        setError,
    } = useForm(schema, initialValue);

    const t = useTranslation(loginLang);

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
                    ok,
                } = loginRes;

                if (errors) {
                    const formError = transformToFormError(removeNull(errors) as ObjectError[]);
                    setError(formError);
                    alert.show(
                        t.errorLoggingInLabel,
                        {
                            variant: 'error',
                        },
                    );
                } else if (ok) {
                    const safeUser = removeNull(result);
                    setUser({
                        id: safeUser.id,
                        displayName: safeUser.fullName,
                        type: safeUser.userType,
                    });
                }
            },
        },
    );

    const handleSubmit = useCallback((finalValue) => {
        // elementRef.current?.resetCaptcha();
        login({
            variables: {
                email: finalValue?.email,
                password: finalValue?.password,
            },
        });
    }, [login]);

    return (
        <form
            className={styles.loginForm}
            onSubmit={createSubmitHandler(validate, setError, handleSubmit)}
        >
            <Container
                className={styles.loginFormContainer}
                heading={t.loginHeaderLabel}
                headingSize="large"
                headingClassName={styles.heading}
                contentClassName={styles.inputContainer}
                spacing="loose"
                footerContentClassName={styles.footerContent}
                footerContent={(
                    <>
                        {t.donotHaveAccountYetLabel}
                        &nbsp;
                        <ButtonLikeLink
                            className={styles.registerLink}
                            to={generatePath(routes.register.path)}
                            variant="transparent"
                        >
                            {t.registerlabel}
                        </ButtonLikeLink>
                    </>
                )}
            >
                <TextInput
                    name="email"
                    onChange={setFieldValue}
                    label={t.emailLabel}
                    value={value?.email}
                    error={error?.email}
                    placeholder="john.doe@gmail.com"
                    disabled={loginPending}
                />
                <PasswordInput
                    name="password"
                    onChange={setFieldValue}
                    label={t.passwordLabel}
                    value={value?.password}
                    error={error?.password}
                    placeholder="****"
                    disabled={loginPending}
                />
                <Button
                    className={styles.loginButton}
                    name="login"
                    type="submit"
                    variant="primary"
                    disabled={loginPending || pristine}
                >
                    {t.loginButtonLabel}
                </Button>
            </Container>
        </form>
    );
}
export default LoginForm;
