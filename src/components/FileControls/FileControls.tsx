import styles from "./FileControls.module.css";
import DownloadButton from "./DownloadButton";
import ShareButton from "./ShareButton";

export default function FileControls() {
  return (
    <footer className={styles.container}>
      <ShareButton />
      <DownloadButton />
    </footer>
  );
}
