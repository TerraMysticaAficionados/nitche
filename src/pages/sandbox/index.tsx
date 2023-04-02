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
                    <Link href="/sandbox/socket-to-dash/stream">- Stream from webcam to MPEG-DASH via socket</Link>
                </div>
                <div className={styles.experimentListItemDescription}>
                    <ul>
                        <li>Websockets</li>
                        <li>Promises</li>
                    </ul>
                </div>
            </li>

            <li className={styles.experimentListItem}>
                <div className={styles.experimentListItemLink}>
                    <Link href="/sandbox/socket-to-dash/client">- Read MPEG-DASH files created via data from webcam socket</Link>
                </div>
                <div className={styles.experimentListItemDescription}>
                    <ul>
                        <li>Shaka Player</li>
                        <li>Dynamic Imports (avoid SSR)</li>

                    </ul>
                </div>
            </li>

            <li className={styles.experimentListItem}>
                <div className={styles.experimentListItemLink}>
                    <Link href="/sandbox/webrtc/broadcaster">- Stream webcam via WebRTC to server recording</Link>
                </div>
                <div className={styles.experimentListItemDescription}>
                    <ul>
                        <li>WebRTC & SDP</li>
                    </ul>
                </div>
            </li>

            <li className={styles.experimentListItem}>
                <div className={styles.experimentListItemLink}>
                    <Link href="/sandbox/webrtc/viewer">- Watch webcam via WebRTC to server recording</Link>
                </div>
                <div className={styles.experimentListItemDescription}>
                    <ul>
                        <li>WebRTC & SDP</li>
                    </ul>
                </div>
            </li>

            <li className={styles.experimentListItem}>
                <div className={styles.experimentListItemLink}>
                    <Link href="/sandbox/socket-to-socket/stream">- Stream webcam via socket to raw data</Link>
                </div>
                <div className={styles.experimentListItemDescription}>
                    <ul>
                        <li>WebSockets</li>
                        <li>MediaRecorder API</li>
                    </ul>
                </div>
            </li>
        </ul>
    </div>
}