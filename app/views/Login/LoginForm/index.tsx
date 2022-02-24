import React, { useCallback, useContext } from 'react';
import {
    TextInput,
    Container,
    PasswordInput,
    Button,
    useAlert,
} from '@the-deep/deep-ui';
import { gql, useMutation } from '@apollo/client';

import {
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

import SmartButtonLikeLink from '#base/components/SmartButtonLikeLink';
// import SmartLink from '#base/components/SmartLink';
import NonFieldError from '#components/NonFieldError';
import { login as loginStrings } from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';
import routes from '#base/configs/routes';
import { LoginMutation, LoginMutationVariables } from '#generated/types';
import { UserContext } from '#base/context/UserContext';
import { transformToFormError, ObjectError } from '#base/utils/errorTransform';

import styles from './styles.css';

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
                email
                firstName
                id
                isActive
                lastLogin
                lastName
                canonicalName
                userType
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

type FormType = LoginMutationVariables;
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
            password: [
                requiredStringCondition,
                lengthGreaterThanCondition(4),
                lengthSmallerThanCondition(129),
            ],
        };
        return basicFields;
    },
};

const initialValue: PartialFormType = {};

function LoginForm() {
    const {
        pristine,
        value,
        error: riskyError,
        setFieldValue,
        validate,
        setError,
    } = useForm(schema, initialValue);

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
                    ok,
                } = loginRes;

                if (ok) {
                    const safeUser = removeNull(result);
                    setUser({
                        id: safeUser.id,
                        displayName: safeUser.canonicalName,
                        displayPictureUrl: undefined,
                        type: safeUser.userType,
                        permissions: safeUser.allowedPermissions,
                        publisherId: safeUser.publisher?.id,
                    });
                } else if (errors) {
                    const formError = transformToFormError(removeNull(errors) as ObjectError[]);
                    setError(formError);
                    // eslint-disable-next-line no-console
                    console.error(formError);
                    alert.show(
                        strings.errorLoggingInLabel,
                        { variant: 'error' },
                    );
                }
            },
            onError: (errors) => {
                setError({
                    [internal]: errors.message,
                });
            },
        },
    );

    const handleSubmit = useCallback((finalValue: PartialFormType) => {
        login({
            variables: finalValue as FormType,
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
                /*
                footerIcons={(
                    <SmartLink
                        route={routes.forgotPassword}
                        state={{ email: value?.email }}
                    >
                        {strings.forgotPasswordLabel}
                    </SmartLink>
                )}
                */
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
