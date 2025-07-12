import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet.tsx";
import { Button } from "@/components/ui/button.tsx";
import { IconTerminal2 } from "@tabler/icons-react";
import { CommandContainer } from "@/features/dashboard/command/components/command-container.tsx";
import { useCommandSheetStore } from "@/features/dashboard/command/store/use-command-sheet-store.ts";

export const CommandSheetContainer: React.FC = () => {
  const { isOpen, toggle } = useCommandSheetStore();
  return (
    <div className="show-on-short">
      <Sheet open={isOpen} onOpenChange={toggle}>
        <SheetTrigger asChild>
          <Button variant="secondary">
            <IconTerminal2 size={24} />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="max-h-[300vh] overflow-y-auto [&>button:first-of-type]:hidden"
        >
          <SheetHeader className="hidden">
            <SheetTitle className="hidden">Edit profile</SheetTitle>
            <SheetDescription className="hidden">
              Make changes to your profile here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          <CommandContainer />
        </SheetContent>
      </Sheet>
    </div>
  );
};
