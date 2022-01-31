import React, { useState } from 'react';

import { useQuery, gql } from '@apollo/client';

import {
    MyProfileQuery,
    MyProfileQueryVariables,
    UserMeType,
} from '#generated/types';

import IndividualProfile from './IndividualProfile';
import SchoolProfile from './SchoolProfile';
import InstitutionProfile from './InstitutionProfile';

import styles from './styles.css';

const MY_PROFILE = gql`
    query MyProfile {
        me {
            userType
        }
    }
`;

function Profile() {
    const [userType, setUserType] = useState<UserMeType | undefined>();
    useQuery<MyProfileQuery, MyProfileQueryVariables>(
        MY_PROFILE,
        {
            onCompleted: (data) => {
                setUserType(data?.me?.userType);
            },
        },
    );

    return (
        <div className={styles.profile}>
            {userType === 'INDIVIDUAL_USER' && (
                <IndividualProfile />
            )}
            {userType === 'SCHOOL_ADMIN' && (
                <SchoolProfile />
            )}
            {userType === 'INSTITUTIONAL_USER' && (
                <InstitutionProfile />
            )}
        </div>
    );
}

export default Profile;
