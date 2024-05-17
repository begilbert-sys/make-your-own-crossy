import Header from "@/app/components/header";

import styles from '@/styles/Home.module.css';

export default function Page() {
    return (
        <>
            <Header />
            <div className={styles.aboutWrapper}>
                <h1>
                    About
                </h1>
                <hr />
                <h2>Credits</h2>
                <p>
                    This app is heavily influenced by the <a href="https://www.nytimes.com/crosswords/game/mini">NYT Mini Crossword.</a>
                    <br />
                    All of the code for the application was written by yours truly. If you'd like to view the source yourself, visit <a href="https://github.com/begilbert-sys/make-your-own-crossy"> my github.</a>
                </p>

                <h2>Contact</h2>
                The app is still in beta, so you may encounter bugs. If you'd like to contact me about bugs or suggestions, you may email me: <br/> <a href="mailto:begilbert238@gmail.com" target="_blank">begilbert238@gmail.com</a>
                <br />
                If you'd like to see what else I'm working on, visit my <a href="https://bengilbert.net/">website.</a>
            </div>
        </>
    )
}