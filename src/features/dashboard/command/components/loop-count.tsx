import React from "react";
import { IconRepeat } from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LoopCountProps {
  count: number;
  onChange: (newCount: number) => void;
}

export const LoopCount: React.FC<LoopCountProps> = ({ count, onChange }) => {
  const repeats = [2, 3, 4, 5];
  return (
    <Select
      value={count.toString()}
      onValueChange={(value) => onChange(Number(value))}
    >
      <SelectTrigger className="w-16">
        <SelectValue placeholder={<IconRepeat />} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Count</SelectLabel>
          {repeats.map((item) => (
            <SelectItem key={item} value={item.toString()}>
              {item}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
