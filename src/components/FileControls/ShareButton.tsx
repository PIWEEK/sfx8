import { useContext, useState } from "react";
import { ShareAndroid } from "iconoir-react";

import Button from "../ui/Button";
import SfxContext from "../../context/sfx-context";
import styles from "./ShareButton.module.css";

export default function ShareButton() {
  const { serialize } = useContext(SfxContext);
  const [showFlashMessage, setShowFlashMessage] = useState(false);

  const handleShareClick = () => {
    const sfx = serialize();
    const url = `${window.location.origin}?sfx=${sfx}`;
    navigator.clipboard.writeText(url);

    setShowFlashMessage(true);
    // Hide flash message after 2 seconds
    setTimeout(() => {
      setShowFlashMessage(false);
    }, 2000);
  };

  return (
    <>
      <span
        className={styles.flashMessage}
        style={{ display: showFlashMessage ? "block" : "none" }}
      >
        URL copied to clipboard!
      </span>
      <Button icon={ShareAndroid} onClick={handleShareClick}>
        Share
      </Button>
    </>
  );
}
