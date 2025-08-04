import { Button } from "@/components/ui/button";

import { IconBulb, IconBulbOff } from "@tabler/icons-react";
import { useLevelStore } from "@/features/dashboard/game/store/use-level-store.ts";

export const AnswerToggle: React.FC = () => {
  const { showAnswer, setShowAnswer } = useLevelStore();
  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };
  return (
    <Button variant="outline" size="icon" onClick={toggleAnswer}>
      {showAnswer ? (
        <IconBulbOff className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <IconBulb className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle sound</span>
    </Button>
  );
};
