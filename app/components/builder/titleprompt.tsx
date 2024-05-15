import { useContext } from 'react';
import TextField from '@mui/material/TextField';

import styles from '@/styles/Builder.module.css';

import { CrossyJSONContext, ICrossyJSONContext } from '@/app/contexts/crossyjsoncontext';

export default function TitlePrompt() {
    const {crossyJSON, setCrossyJSON} = useContext<ICrossyJSONContext>(CrossyJSONContext);
    return (
        <div className={styles.titlePromptWrapper}>
            <h3>Title</h3>
            <TextField
                value = {crossyJSON.title}
                onChange = {(e) => {
                    crossyJSON.title = e.target.value;
                    setCrossyJSON({...crossyJSON});
                }}
                className={styles.titlePrompt}
                label="Enter a Title" 
                variant="outlined" 
                InputProps={{className: styles.titlePrompt }}
                InputLabelProps={{className: styles.titlePrompt }}
            />

            <h3>Author </h3>
            <TextField
                value = {crossyJSON.author}
                onChange = {(e) => {
                    crossyJSON.author = e.target.value;
                    setCrossyJSON({...crossyJSON});
                }}
                className={styles.titlePrompt}
                label="Enter an Author" 
                variant="outlined" 
                InputProps={{className: styles.titlePrompt }}
                InputLabelProps={{className: styles.titlePrompt }}
            />
        </div>
    )
}