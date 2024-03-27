import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';

import clsx from 'clsx';

import styles from '@/styles/Home.module.css';

export default function Tools() {
    const symbolClass = clsx(styles.keyboardKey, styles.keyboardSymbol)
    return (
        <div>
            <h3>Controls</h3>
            <ul className={styles.toolList}>
                <li>
                    Switch directions 
                </li>
                <li>
                    Move around 
                    <div className={styles.keyboardKeyWrapper}>
                        <div className={symbolClass}>
                            <KeyboardArrowDownOutlinedIcon fontSize="small" />
                        </div>
                        <div className={symbolClass}>
                            <KeyboardArrowLeftOutlinedIcon fontSize="small" />
                        </div>
                        <div className={symbolClass}>
                            <KeyboardArrowRightOutlinedIcon fontSize="small" />
                        </div>
                        <div className={symbolClass}>
                            <KeyboardArrowUpOutlinedIcon fontSize="small" />
                        </div>
                    </div>
                </li>
                <li>
                    Disable/Enable a Cell <div className={styles.keyboardKeyWrapper}><div className={styles.keyboardKey}>.</div></div>
                </li>
                <li>
                    Jump to next word <div className={styles.keyboardKeyWrapper}><div className={styles.keyboardKey}>Enter</div></div>
                </li>
            </ul>
        </div>
    )
}