import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { Link } from '@the-deep/deep-ui';

import { FooterGradeOptionsQuery, BookGradeEnum } from '#generated/types';
import Ecd from '#resources/img/ecd.png';
import Grade1 from '#resources/img/grade1.png';
import Grade2 from '#resources/img/grade2.png';
import Grade3 from '#resources/img/grade3.png';
import Grade4 from '#resources/img/grade4.png';
import Grade5 from '#resources/img/grade5.png';

import routes from '#base/configs/routes';

import styles from './styles.css';

const gradePreviewMap: {
    [key in BookGradeEnum]: string;
} = {
    ECD: Ecd,
    GRADE_1: Grade1,
    GRADE_2: Grade2,
    GRADE_3: Grade3,
    GRADE_4: Grade4,
    GRADE_5: Grade5,
};

export interface Props {
    className?: string;
    grade: NonNullable<NonNullable<FooterGradeOptionsQuery['gradeList']>['enumValues']>[number];
}

function GradeItem(props: Props) {
    const {
        grade,
        className,
    } = props;

    return (
        <Link
            to={{
                pathname: routes.bookList.path,
                state: { grade: grade.name },
            }}
            className={_cs(styles.gradeItem, className)}
            linkElementClassName={styles.link}
        >
            <img
                className={styles.preview}
                src={gradePreviewMap[grade.name as BookGradeEnum] ?? undefined}
                alt={grade.name}
            />
            <div className={styles.description}>
                {grade.description}
            </div>
        </Link>
    );
}

export default GradeItem;
