import { Howl } from "howler";

import hoverMp3Url from "@/assets/game/sounds/flag-hover.mp3?url";
import selectMp3Url from "@/assets/game/sounds/flag-select.mp3?url";
import collectCoinMp3Url from "@/assets/game/sounds/collect_coin.mp3?url";
import onGoalMp3Url from "@/assets/game/sounds/on_goal.mp3?url";
import failedMp3Url from "@/assets/game/sounds/failed.mp3?url";
import bgMusicMp3Url from "@/assets/game/sounds/bg_sound.mp3?url";
import runningMp3Url from "@/assets/game/sounds/running_in_grass.mp3?url";
import tickMp3Url from "@/assets/game/sounds/tick.mp3?url";
import rejectedMp3Url from "@/assets/game/sounds/rejected.mp3?url";
import destroyMp3Url from "@/assets/game/sounds/destroy.mp3?url";

type SoundKey =
  | "hover"
  | "select"
  | "collectCoin"
  | "onGoal"
  | "onFailed"
  | "bgMusic"
  | "onMoving"
  | "onDrop"
  | "onRejected"
  | "onDestroy";

type SoundOptions = {
  volume?: number;
  loop?: boolean;
  rate?: number;
};

const soundSources: Record<SoundKey, string> = {
  hover: hoverMp3Url,
  select: selectMp3Url,
  collectCoin: collectCoinMp3Url,
  onGoal: onGoalMp3Url,
  onFailed: failedMp3Url,
  bgMusic: bgMusicMp3Url,
  onMoving: runningMp3Url,
  onDrop: tickMp3Url,
  onRejected: rejectedMp3Url,
  onDestroy: destroyMp3Url,
};

const sounds: Partial<Record<SoundKey, Howl>> = {};

export function preloadSounds() {
  for (const key in soundSources) {
    const k = key as SoundKey;
    sounds[k] = new Howl({
      src: [soundSources[k]],
      volume: k === "bgMusic" ? 0.2 : 0.5,
      loop: k === "bgMusic",
    });
  }
}

export function playSound(key: SoundKey, opts: SoundOptions = {}) {
  const sound = sounds[key];
  if (!sound) return;

  if (opts.volume !== undefined) {
    sound.volume(opts.volume);
  }

  if (opts.loop !== undefined) {
    sound.loop(opts.loop);
  }

  if (opts.rate !== undefined) {
    sound.rate(opts.rate);
  }

  sound.play();
}
export function stopSound(key: SoundKey) {
  sounds[key]?.stop();
}

export function fadeOutSound(key: SoundKey, duration = 1000) {
  const s = sounds[key];
  if (s) s.fade(s.volume(), 0, duration);
}

export function isSoundPlaying(key: SoundKey) {
  const sound = sounds[key];
  return sound ? sound.playing() : false;
}
