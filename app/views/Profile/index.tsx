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
    const {
        data: profileData,
    } = useQuery<MyProfileQuery, MyProfileQueryVariables>(
        MY_PROFILE,
    );

    return (
        <div className={styles.profile}>
            {profileData?.me?.userType === 'INDIVIDUAL_USER' && (
                <IndividualProfile />
            )}
            {profileData?.me?.userType === 'SCHOOL_ADMIN' && (
                <SchoolProfile />
            )}
            {profileData?.me?.userType === 'INSTITUTIONAL_USER' && (
                <InstitutionProfile />
            )}
        </div>
    );
}

export default Profile;
