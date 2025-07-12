import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function MobileAlertDialog() {
  const [open, setOpen] = useState(false);

  const checkOrientation = () => {
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;
    return isPortrait;
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setOpen(checkOrientation());
      };

      handleResize(); // check on mount
      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const handleOk = () => {
    if (!checkOrientation()) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rotate Your Device</DialogTitle>
          <DialogDescription>
            This game is best experienced in landscape mode. Please rotate your
            device horizontally for the best experience.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleOk}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
