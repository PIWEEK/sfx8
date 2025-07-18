import { useContext, useState, useCallback } from "react";
import { Download } from "iconoir-react";

import Button from "../ui/Button";
import SynthContext from "../../context/synth-context";
import { mergeNotes } from "../../utils";
import SfxContext from "../../context/sfx-context";

function DownloadButton() {
  const { exportToWav } = useContext(SynthContext);
  const [isExporting, setIsExporting] = useState(false);
  const { notes, speed } = useContext(SfxContext);

  const handleDownloadClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      if (isExporting) return;

      setIsExporting(true);

      try {
        const mergedNotes = mergeNotes(notes);

        const blob = await exportToWav(mergedNotes, speed);

        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `sfx8-export-${new Date()
          .toISOString()
          .slice(0, 19)
          .replace(/:/g, "-")}.wav`;

        // Virtually click the link to trigger the download
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Export failed:", error);
        alert("Failed to export audio. Please try again.");
      } finally {
        setIsExporting(false);
      }
    },
    [exportToWav, notes, speed, isExporting]
  );

  return (
    <Button
      icon={Download}
      onClick={handleDownloadClick}
      disabled={isExporting}
    >
      {isExporting ? "Exporting..." : "Download"}
    </Button>
  );
}

export default DownloadButton;
