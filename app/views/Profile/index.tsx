import React from 'react';

import { useQuery, gql } from '@apollo/client';

import {
    MyProfileTypeQuery,
    MyProfileTypeQueryVariables,
} from '#generated/types';

import IndividualProfile from './IndividualProfile';
import SchoolProfile from './SchoolProfile';
import InstitutionProfile from './InstitutionProfile';
import PublisherProfile from './PublisherProfile';

import styles from './styles.css';

const MY_PROFILE = gql`
    query MyProfileType {
        me {
            id
            userType
        }
    }
`;

function Profile() {
    const {
        data: profileData,
    } = useQuery<MyProfileTypeQuery, MyProfileTypeQueryVariables>(
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
            {profileData?.me?.userType === 'PUBLISHER' && (
                <PublisherProfile />
            )}
            {profileData?.me?.userType === 'INSTITUTIONAL_USER' && (
                <InstitutionProfile />
            )}
        </div>
    );
}

export default Profile;
