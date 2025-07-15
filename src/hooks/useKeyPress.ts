import { useEffect } from "react";

interface UseKeyPressOptions {
  key: string;
  callback: () => void;
  preventDefault?: boolean;
}

export const useKeyPress = ({
  key,
  callback,
  preventDefault = true,
}: UseKeyPressOptions) => {
  useEffect(() => {
    const handleKeyEvent = (event: KeyboardEvent) => {
      if (event.code === key) {
        if (preventDefault) {
          event.preventDefault();
        }
        callback();
      }
    };

    document.addEventListener("keyup", handleKeyEvent);

    return () => {
      document.removeEventListener("keyup", handleKeyEvent);
    };
  }, [key, callback, preventDefault]);
};
