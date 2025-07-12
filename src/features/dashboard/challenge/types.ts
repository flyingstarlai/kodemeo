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
  challengeId: string;
  level: number;
  title: string;
  stars: number;
  isLocked: boolean;
  levelData: LevelData;
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
  commands: Array<"up" | "down" | "left" | "right" | "scratch" | "loop">;
  guides: Array<"up" | "down" | "left" | "right" | "scratch">;
}
