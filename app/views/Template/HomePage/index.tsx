import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { Button, SelectInput } from '@the-deep/deep-ui';
import Biralo from './Biralo.png';
import Chaad from './Chaad.png';
import Bahinee from './Bahinee.png';
import Riban from './Riban.png';
import Pooja from './Pooja.png';
import Aawaj from './Aawaj.png';
import Aalu from './Aalu.png';
import styles from './styles.css';

const optionLabelSelector = (d: any) => d.title;
const optionKeySelector = (d: any) => d.id;
const handleInputChange = (d: any) => d.value;

function HomePage() {
    return (
        <>
            <div className={styles.filter}>
                <SelectInput
                    className={styles.input}
                    name="sort"
                    keySelector={optionKeySelector}
                    labelSelector={optionLabelSelector}
                    value={undefined}
                    onChange={handleInputChange}
                    options={undefined}
                    label="Sort by"
                    placeholder="List of Projects"
                    nonClearable
                    onOptionsChange={handleInputChange}
                    onShowDropdownChange={handleInputChange}
                />
                <SelectInput
                    className={styles.input}
                    name="filter"
                    keySelector={optionKeySelector}
                    labelSelector={optionLabelSelector}
                    value={undefined}
                    onChange={handleInputChange}
                    options={undefined}
                    label="Filter by"
                    placeholder="List of Projects"
                    nonClearable
                    onOptionsChange={handleInputChange}
                    onShowDropdownChange={handleInputChange}
                />
            </div>
            <div className={styles.pageContent}>
                <div className={styles.coverImage}>
                    Cover Image Here
                </div>
                <div className={styles.bookSection}>
                    <div className={styles.bookList}>
                        <img
                            className={styles.bookImg}
                            src={Aalu}
                            alt="Aalu"
                        />
                        <div className={styles.bookLabel}>
                            Book Detail
                        </div>
                    </div>
                    <div className={styles.bookList}>
                        <img
                            className={styles.bookImg}
                            src={Biralo}
                            alt="birallo"
                        />
                        <div className={styles.bookLabel}>
                            Book Detail
                        </div>
                    </div>
                    <div className={styles.bookList}>
                        <img
                            className={styles.bookImg}
                            src={Chaad}
                            alt="chaad"
                        />
                        <div className={styles.bookLabel}>
                            Book Detail
                        </div>
                    </div>
                    <div className={styles.bookList}>
                        <img
                            className={styles.bookImg}
                            src={Bahinee}
                            alt="bahinee"
                        />
                        <div className={styles.bookLabel}>
                            Book Detail
                        </div>
                    </div>
                </div>
                <div className={styles.bookSection}>
                    <div className={styles.bookList}>
                        <img
                            className={styles.bookImg}
                            src={Riban}
                            alt="Riban"
                        />
                        <div className={styles.bookLabel}>
                            Book Detail
                        </div>
                    </div>
                    <div className={styles.bookList}>
                        <img
                            className={styles.bookImg}
                            src={Bahinee}
                            alt="Bahinee"
                        />
                        <div className={styles.bookLabel}>
                            Book Detail
                        </div>
                    </div>
                    <div className={styles.bookList}>
                        <img
                            className={styles.bookImg}
                            src={Aawaj}
                            alt="Aawaj"
                        />
                        <div className={styles.bookLabel}>
                            Book Detail
                        </div>
                    </div>
                    <div className={styles.bookList}>
                        <img
                            className={styles.bookImg}
                            src={Pooja}
                            alt="Pooja"
                        />
                        <div className={styles.bookLabel}>
                            Book Detail
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HomePage;
