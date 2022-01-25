import { Button } from '@the-deep/deep-ui';
import React from 'react';

import styles from './styles.css';

function Footer() {
    return (
        <>
            <div className={styles.footer}>
                <div className={styles.footerButtons}>
                    <Button
                        name={undefined}
                        onClick={undefined}
                        variant="primary"
                    >
                        FAQs
                    </Button>
                    <Button
                        name={undefined}
                        onClick={undefined}
                        variant="primary"
                    >
                        Blogs
                    </Button>
                    <Button
                        name={undefined}
                        onClick={undefined}
                        variant="primary"
                    >
                        Why Kitab Bazar
                    </Button>
                    <Button
                        name={undefined}
                        onClick={undefined}
                        variant="primary"
                    >
                        Contact Us
                    </Button>
                </div>
            </div>
        </>
    );
}

export default Footer;
