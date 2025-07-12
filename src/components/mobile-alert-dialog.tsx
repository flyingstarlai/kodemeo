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

  useEffect(() => {
    // check on mount
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      setOpen(true);
    }

    // optional: re-check on resize
    const onResize = () => {
      if (window.innerWidth < 640) setOpen(true);
      else setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Device Not Supported</DialogTitle>
          <DialogDescription>
            This interactive coding-learning game is optimized for tablets and
            desktops only. For the best experience and full functionality,
            please play on a tablet or desktop device.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
