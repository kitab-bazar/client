import React from 'react';
import { isTruthyString } from '@togglecorp/fujs';
import {
    IoPencil,
} from 'react-icons/io5';
import {
    PendingMessage,
    Container,
    Button,
    Header,
    TextOutput,
    useModalState,
} from '@the-deep/deep-ui';
import { useQuery, gql } from '@apollo/client';
import {
    PublisherProfileQuery,
    PublisherProfileQueryVariables,
} from '#generated/types';
import EditPublisherProfileModal from './EditPublisherProfileModal';

import styles from './styles.css';

const PUBLISHER_PROFILE = gql`
    query PublisherProfile {
        me {
            id
            firstName
            lastName
            fullName
            phoneNumber
            email
            image {
                name
                url
            }
            publisher {
                id
                localAddress
                name
                panNumber
                vatNumber
                wardNumber
                municipality {
                    id
                    name
                    district {
                        id
                        name
                        province {
                            id
                            name
                        }
                    }
                }
            }
        }
    }
`;

function Profile() {
    const [
        editProfileModalShown,
        showEditProfileModal,
        hideEditProfileModal,
    ] = useModalState(false);

    const {
        data: profileDetails,
        loading,
    } = useQuery<PublisherProfileQuery, PublisherProfileQueryVariables>(
        PUBLISHER_PROFILE,
    );

    return (
        <Container
            className={styles.profile}
            contentClassName={styles.content}
            spacing="comfortable"
        >
            { loading && (<PendingMessage />)}
            <Container
                className={styles.profileDetails}
                spacing="comfortable"
            >
                <div className={styles.top}>
                    <Header
                        className={styles.heading}
                        headingSectionClassName={styles.headingSection}
                        headingSize="extraLarge"
                        spacing="comfortable"
                        actions={(
                            <Button
                                name={undefined}
                                variant="general"
                                onClick={showEditProfileModal}
                                icons={<IoPencil />}
                            >
                                Edit Profile
                            </Button>
                        )}
                        icons={isTruthyString(profileDetails?.me?.image?.url) && (
                            <div
                                className={styles.displayPicture}
                            >
                                <img
                                    src={profileDetails?.me?.image?.url ?? undefined}
                                    alt={profileDetails?.me?.image?.name ?? ''}
                                />
                            </div>
                        )}
                        heading={profileDetails?.me?.fullName}
                    />
                </div>
                <div className={styles.bottom}>
                    <TextOutput
                        label="Address"
                        value={profileDetails?.me?.publisher?.localAddress}
                    />
                    <TextOutput
                        label="Email"
                        value={profileDetails?.me?.email}
                    />
                    <TextOutput
                        label="Phone Number"
                        value={profileDetails?.me?.phoneNumber}
                    />
                    <TextOutput
                        label="PAN Number"
                        value={profileDetails?.me?.publisher?.panNumber}
                    />
                    <TextOutput
                        label="VAT Number"
                        value={profileDetails?.me?.publisher?.vatNumber}
                    />
                </div>
            </Container>
            <Container
                className={styles.orderSummary}
                heading="Order Summary"
                headingSize="extraLarge"
            />
            {editProfileModalShown && (
                <EditPublisherProfileModal
                    onModalClose={hideEditProfileModal}
                />
            )}
        </Container>
    );
}

export default Profile;
