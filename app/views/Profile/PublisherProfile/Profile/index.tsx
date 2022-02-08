import React from 'react';
import { isTruthyString } from '@togglecorp/fujs';
import {
    IoPencil,
} from 'react-icons/io5';
import {
    Container,
    Button,
    Header,
    TextOutput,
    useModalState,
} from '@the-deep/deep-ui';

import EditPublisherProfileModal from './EditPublisherProfileModal';
import { ProfileDetails } from '../index';

import styles from './styles.css';

interface Props {
    profileDetails?: ProfileDetails;
    onEditSuccess: () => void;
}

function Profile(props: Props) {
    const {
        profileDetails,
        onEditSuccess,
    } = props;

    const [
        editProfileModalShown,
        showEditProfileModal,
        hideEditProfileModal,
    ] = useModalState(false);

    const publisherDetails = {
        ...profileDetails?.publisher,
        municipality: profileDetails?.publisher?.municipality.id,
    };

    return (
        <Container
            className={styles.profile}
            contentClassName={styles.content}
            spacing="comfortable"
        >
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
                        icons={isTruthyString(profileDetails?.image?.url) && (
                            <div
                                className={styles.displayPicture}
                            >
                                <img
                                    src={profileDetails?.image?.url ?? undefined}
                                    alt={profileDetails?.fullName ?? ''}
                                />
                            </div>
                        )}
                        heading={profileDetails?.fullName}
                    />
                </div>
                <div className={styles.bottom}>
                    <TextOutput
                        label="Address"
                        value={profileDetails?.publisher?.localAddress}
                    />
                    <TextOutput
                        label="Phone Number"
                        value={profileDetails?.phoneNumber}
                    />
                    <TextOutput
                        label="PAN Number"
                        value={profileDetails?.publisher?.panNumber}
                    />
                    <TextOutput
                        label="VAT Number"
                        value={profileDetails?.publisher?.vatNumber}
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
                    onEditSuccess={onEditSuccess}
                    profileDetails={publisherDetails}
                />
            )}
        </Container>
    );
}

export default Profile;
