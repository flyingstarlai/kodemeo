## 🧍 Player Entity

| Komponen         | Tipe Data / Nilai Default                                         | Deskripsi                        |
|------------------|------------------------------------------------------------------|----------------------------------|
| `Position`        | `{ x: number, y: number }`                                        | Posisi absolut di world (pixel) |
| `GridPosition`    | `{ col: number, row: number }`                                    | Posisi di grid tile              |
| `GridMovement`    | `{ startCol, startRow, destCol, destRow, progress, duration }`   | Informasi gerakan grid          |
| `SpriteAnimation` | `{ name: "idle", frames: 20, isPlaying: false }`                  | Animasi saat ini                |
| `Rotation`        | `{ angle: number }`                                               | Sudut rotasi sprite (radian)    |
| `Facing`          | `{ direction: "up" | "down" | "left" | "right" }`                | Arah menghadap player           |
| `Bag`             | `{ coins: 0 }`                                                    | Koin yang dikumpulkan           |
| `PlayerTag`       | `Tag`                                                             | Penanda entitas sebagai player  |

---

## 🧠 Manager Entity

| Komponen         | Tipe Data / Nilai Default                          | Deskripsi                             |
|------------------|---------------------------------------------------|---------------------------------------|
| `LevelProgress`   | `{ isOver: false, onGoal: false }`                | Status akhir level                    |
| `Score`           | `{ stars: 0 }`                                    | Jumlah bintang yang didapatkan        |
| `PlaySession`     | `{ session: string }`                             | ID sesi permainan (UUID)              |
| `ManagerTag`      | `Tag`                                             | Penanda entitas sebagai manager       |

---

## 💰 Collectible Entity (Coin)

| Komponen         | Tipe Data / Nilai Default                          | Deskripsi                        |
|------------------|---------------------------------------------------|----------------------------------|
| `Position`        | `{ x: number, y: number }`                         | Posisi absolut                   |
| `GridPosition`    | `{ col: number, row: number }`                     | Posisi di grid tile              |
| `SpriteAnimation` | `{ name: "rotate", frames: 8, isPlaying: false }` | Animasi berputar                 |
| `CollectibleTag`  | `Tag`                                              | Penanda collectible item         |

---

## 🎯 Treasure Entity (Goal)

| Komponen         | Tipe Data / Nilai Default             | Deskripsi                             |
|------------------|--------------------------------------|---------------------------------------|
| `Position`        | `{ x: number, y: number }`            | Posisi absolut                        |
| `GridPosition`    | `{ col: number, row: number }`        | Posisi di grid                        |
| `Elapsed`         | `{ value: 0 }`                        | Waktu sejak spawn                     |
| `GoalTag`         | `Tag`                                 | Penanda lokasi tujuan                 |

---

## 📦 Komponen Khusus (Tambahan)

| Komponen         | Tipe Data / Nilai Default               | Digunakan oleh             |
|------------------|----------------------------------------|----------------------------|
| `Queue`           | `{ commands: QueuedCommand[] }`         | CommandSystem, InputSystem |
| `MarkAsDeletedTag`  | `Tag`                                   | DeleterSystem              |
| `SpriteAnimation` | `{ name, frames, isPlaying }`          | Player/Coin animation      |
| `Rotation`        | `{ angle: number }`                     | PlayerRenderSystem         |