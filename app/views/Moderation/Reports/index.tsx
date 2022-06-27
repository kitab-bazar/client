import React from 'react';
import { Container } from '@the-deep/deep-ui';
import styles from './styles.css';
import District from './District/index';
import Overall from './Overall/index';
import Books from './Books/index';
import Window from './Window/index';

function Reports() {
    return (
        <>
            <Container
                className={styles.reports}
                heading="Reports"
                headingSize="small"
            >
                <>
                    <Overall />
                    <District />
                    <Window />
                    <Books />
                </>
            </Container>
        </>
    );
}

export default Reports;
