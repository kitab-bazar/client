import React, { useState } from 'react';

import {
    Container,
    RadioInput,
} from '@the-deep/deep-ui';

import {
    UserUserType,
} from '#generated/types';

import IndividualUserForm from './IndividualUserForm';
import InstitutionForm from './InstitutionForm';
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

const userKeySelector = (u: UserType) => u.id;
const userLabelSelector = (u: UserType) => u.id;

function RegisterForm() {
    const [userTypeValue, setUserTypeValue] = useState<UserType['id']>('INDIVIDUAL_USER');

    return (
        <div className={styles.register}>
            <Container
                className={styles.registerFormContainer}
                heading="Register"
                headingSize="medium"
                headingClassName={styles.heading}
                contentClassName={styles.inputContainer}
            >
                <RadioInput
                    name="userType"
                    options={userType}
                    label="Select User Type"
                    keySelector={userKeySelector}
                    labelSelector={userLabelSelector}
                    onChange={setUserTypeValue}
                    value={userTypeValue}
                    spacing="compact"
                />
                {userTypeValue === 'INDIVIDUAL_USER' && (
                    <IndividualUserForm />
                )}
                {userTypeValue === 'INSTITUTIONAL_USER' && (
                    <InstitutionForm />
                )}
            </Container>
        </div>
    );
}

export default RegisterForm;
