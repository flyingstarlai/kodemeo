import type { CommandType } from "@/ecs/components/logic/queue.ts";

export interface ChallengeScore {
  challengeId: string;
  level: number;
  title: string;
  stars: number;
  updatedAt: Date;
}

export interface BeginPayload {
  challengeId: string;
}

export interface BeginResponse {
  token: string;
  timestamp: string;
}

export interface CompleteChallengePayload {
  challengeId: string;
  stars: number;
  token: string;
  timestamp: string;
}

export interface CompleteChallengeResponse {
  signature: string;
}

export interface ChallengeResponse {
  id: string;
  week: number;
  level: number;
  title: string;
  stars: number;
  isLocked: boolean;
}

export interface LevelData {
  level: number;
  facing: "up" | "down" | "left" | "right";
  start: Array<{ col: number; row: number }>;
  collectible: Array<{ col: number; row: number }>;
  obstacle: Array<{ col: number; row: number }>;
  goal: Array<{ col: number; row: number }>;
  path: Array<{ col: number; row: number }>;
  maxStep: number;
  commands: Array<CommandType | "loop">;
  guides: Array<CommandType>;
}
