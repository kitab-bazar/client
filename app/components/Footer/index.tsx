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
                        autoFocus
                    >
                        FAQs
                    </Button>
                    <Button
                        name={undefined}
                        onClick={undefined}
                        variant="primary"
                        autoFocus
                    >
                        Blogs
                    </Button>
                    <Button
                        name={undefined}
                        onClick={undefined}
                        variant="primary"
                        autoFocus
                    >
                        Why Kitab Bazar
                    </Button>
                    <Button
                        name={undefined}
                        onClick={undefined}
                        variant="primary"
                        autoFocus
                    >
                        Contact Us
                    </Button>
                </div>
            </div>
        </>
    );
}

export default Footer;
