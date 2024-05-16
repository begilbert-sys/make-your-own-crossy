import { useContext } from 'react';

import styles from '@/styles/Solver.module.css';

import { CrossyJSONContext, ICrossyJSONContext } from '@/app/contexts/crossyjsoncontext';
export default function Title () {
    const {crossyJSON, setCrossyJSON} = useContext<ICrossyJSONContext>(CrossyJSONContext);
    return (
        <div className={styles.crossyTitle}>
        <h1>
            {crossyJSON.title}
        </h1>
        <span className={styles.crossyAuthor}>by {crossyJSON.author}</span>
        </div>

    );
}