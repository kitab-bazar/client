import { Button } from '@the-deep/deep-ui';
import React from 'react';

import {
    homePage,
} from '#base/configs/lang';
import useTranslation from '#base/hooks/useTranslation';

import styles from './styles.css';

function Footer() {
    const homePageStrings = useTranslation(homePage);

    return (
        <div className={styles.footer}>
            <div className={styles.footerButtons}>
                <Button
                    name={undefined}
                    onClick={undefined}
                    variant="primary"
                >
                    {homePageStrings.faqButtonLabel}
                </Button>
                <Button
                    name={undefined}
                    onClick={undefined}
                    variant="primary"
                >
                    {homePageStrings.blogsButtonLabel}
                </Button>
                <Button
                    name={undefined}
                    onClick={undefined}
                    variant="primary"
                >
                    {homePageStrings.whyKitabBazarLabel}
                </Button>
                <Button
                    name={undefined}
                    onClick={undefined}
                    variant="primary"
                >
                    {homePageStrings.contactUsButtonLabel}
                </Button>
            </div>
        </div>
    );
}

export default Footer;
