import styles from '@/styles/List.module.css'
import Link from "next/link"

// @todo: move all this into a sandbox/playground folder
export default () => {
    return <div className={styles.experimentListContainer}>
        <ul className={styles.experimentList}>
            <li className={styles.experimentListItem}>
                <div className={styles.experimentListItemLink}>
                    <Link href="/mirror">- Mirror</Link>
                </div>
                <div className={styles.experimentListItemDescription}>
                    <ul>
                        <li>getUserMedia</li>
                        <li>React Refs</li>
                    </ul>
                </div>
            </li>
            <li className={styles.experimentListItem}>
                <div className={styles.experimentListItemLink}>
                    <Link href="/stream/socket-prototype">- Stream socket prototype</Link>
                </div>
                <div className={styles.experimentListItemDescription}>
                    <ul>
                        <li>Websockets</li>
                        <li>Promises</li>
                    </ul>
                </div>
            </li>
        </ul>
    </div>
}