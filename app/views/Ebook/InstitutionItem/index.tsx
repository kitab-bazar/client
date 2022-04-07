import React from 'react';
import { _cs } from '@togglecorp/fujs';
import {
    ButtonLikeLink,
} from '@the-deep/deep-ui';
import { IoHome, IoBook } from 'react-icons/io5';

import Avatar from '#components/Avatar';
import useTranslation from '#base/hooks/useTranslation';
import { ebook } from '#base/configs/lang';

import { Institution } from '../index';
import styles from './styles.css';

interface Props {
    className?: string;
    institution: Institution;
}

function InstitutionItem(props: Props) {
    const {
        institution,
        className,
    } = props;

    const strings = useTranslation(ebook);

    return (
        <div
            className={_cs(styles.institutionItem, className)}
        >
            <div className={styles.left}>
                <Avatar
                    className={styles.displayPicture}
                    src={institution?.logoUrl ?? undefined}
                    name={institution.name}
                />
            </div>
            <div className={styles.right}>
                <div
                    className={styles.name}
                >
                    {institution.name}
                </div>
                <div className={styles.buttons}>
                    <ButtonLikeLink
                        to={institution.websiteUrl ?? ''}
                        variant="primary"
                        icons={<IoHome />}
                    >
                        {strings.gotoWebSiteLabel}
                    </ButtonLikeLink>
                    <ButtonLikeLink
                        to={institution.libraryUrl ?? ''}
                        icons={<IoBook />}
                    >
                        {strings.gotoElibraryLink}
                    </ButtonLikeLink>
                </div>
            </div>
        </div>
    );
}

export default InstitutionItem;
