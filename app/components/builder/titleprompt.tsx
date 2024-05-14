import TextField from '@mui/material/TextField';

import styles from '@/styles/Home.module.css';

export default function TitlePrompt() {
    return (
        <div className={styles.titlePromptWrapper}>
            <h3>Title</h3>
            <TextField
                className={styles.titlePrompt}
                label="Enter a Title" 
                variant="outlined" 
                InputProps={{className: styles.titlePrompt }}
                InputLabelProps={{className: styles.titlePrompt }}
            />

            <h3>Author </h3>
            <TextField
                className={styles.titlePrompt}
                label="Enter an Author" 
                variant="outlined" 
                InputProps={{className: styles.titlePrompt }}
                InputLabelProps={{className: styles.titlePrompt }}
            />
        </div>
    )
}