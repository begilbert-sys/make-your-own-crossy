import GitHubIcon from '@mui/icons-material/GitHub';

import styles from '@/styles/Home.module.css';

export default function Header() {
    return (
        <>
        <header>
            <div className={styles.headerWrapper}>
                <a href="/">
                    <div className={styles.logo}>
                        <img src="https://static.thenounproject.com/png/2699735-200.png" height={40}/>
                        <h2>Build Your Own Mini</h2>
                    </div>
                </a>
                <a className={styles.link} href="/">
                    <div className={styles.linkWrapper}>
                        Create
                    </div>
                </a>
                <a className={styles.link} href="/about">
                    <div className={styles.linkWrapper}>
                        About
                    </div>
                </a>
            </div>
            <div className={styles.githubWrapper}>
                <a href="https://github.com/begilbert-sys/make-your-own-crossy">
                    <GitHubIcon fontSize="large"/>
                </a>
            </div>
        </header>
        <hr />
        </>
    )
}