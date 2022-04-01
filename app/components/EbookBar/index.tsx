import React from 'react';
import {
    IoBookSharp,
    IoGlobeOutline,
} from 'react-icons/io5';
import { Button, ButtonLikeLink, Container, ElementFragments, useModalState } from '@the-deep/deep-ui';
import {
    gql,
} from '@apollo/client';
import Avatar from '../Avatar';
import {
    MyElinksQuery,
    MyElinksQueryVariables,
} from '#generated/types';
import SaveChild from './savechild.jpg';
import useTranslation from '#base/hooks/useTranslation';
import { ebook } from '#base/configs/lang';

import styles from './styles.css';

const ELINKS = gql`
query MyElinks {
    institutions {
        results {
        name
        libraryUrl
        logoUrl
        websiteUrl
        id
        }
    }
}
`;
export type Elink = NonNullable<NonNullable<MyElinksQuery['institutions']>['results']>[number];

const websiteUrl = 'https://www.togglecorp.com';
const libraryUrl = 'https://blog.kitabbazar.org';

const elinkKeySelector = (n: Elink) => n.id;

function EbookBar() {
    const strings = useTranslation(ebook);

    return (
        <div className={styles.ebook}>
            <ElementFragments
                icons={(
                    <Avatar
                        className={styles.displayPicture}
                        src={SaveChild}
                    />
                )}
            />
            <div className={styles.linkContent}>
                <Container
                    className={styles.details}
                    headingSize="large"
                    heading="Save the Children"
                />
                <div className={styles.content}>
                    <ButtonLikeLink
                        to={websiteUrl}
                        className={styles.button}
                    >
                        {strings.gotoSiteLabel}
                        <IoGlobeOutline className={styles.fallbackIcon} />
                    </ButtonLikeLink>
                    <ButtonLikeLink
                        to={libraryUrl}
                        className={styles.button}
                    >
                        {strings.eBookSiteLabel}
                        <IoBookSharp className={styles.fallbackIcon} />
                    </ButtonLikeLink>
                </div>
            </div>
        </div>
    );
}

export default EbookBar;
