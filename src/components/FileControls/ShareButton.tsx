import { useContext } from "react";
import { ShareAndroid } from "iconoir-react";

import Button from "../ui/Button";
import SfxContext from "../../context/sfx-context";

export default function ShareButton() {
  const { serialize } = useContext(SfxContext);

  const handleShareClick = () => {
    const sfx = serialize();
    const url = `${window.location.origin}?sfx=${sfx}`;
    navigator.clipboard.writeText(url);
    console.log("Copied to clipboard:", url);
  };

  return (
    <Button icon={ShareAndroid} onClick={handleShareClick}>
      Share
    </Button>
  );
}
