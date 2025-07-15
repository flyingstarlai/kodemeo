import animalSheet from "@/assets/game/animals.png?url";
import { Button } from "@/components/ui/button.tsx";
import { clsx } from "clsx";
import { IconLock } from "@tabler/icons-react";

interface SpriteButtonProps {
  frame: number;
  active: boolean;
  onClick?: () => void;
  disabled: boolean;
}

export const SpriteButton: React.FC<SpriteButtonProps> = ({
  frame,
  active,
  onClick,
  disabled,
}) => {
  const x = (frame % 4) * 64;
  const y = Math.floor(frame / 4) * 64;
  const backgroundPosition = `-${x}px -${y}px`;

  return (
    <Button
      disabled={disabled}
      variant="ghost"
      className={clsx(
        "relative opacity-90 cursor-pointer w-[64px] h-[64px] bg-no-repeat bg-[length:256px_128px] hover:bg-amber-100",
        active ? "bg-amber-100" : "bg-amber-100/20",
      )}
      onClick={onClick}
      style={{
        backgroundImage: `url(${animalSheet})`,
        backgroundPosition,
      }}
    >
      {disabled && <IconLock className="absolute top-1 right-1" />}
    </Button>
  );
};
