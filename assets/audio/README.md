# 音声ファイルについて

以下の音声ファイルをこのディレクトリに配置してください。

## BGM

| ファイル名 | 用途 | 推奨仕様 |
|---|---|---|
| `bgm_calm.mp3` | ホーム画面・日記閲覧中のBGM | 60秒ループ可能な環境音・アンビエント |

Soundraw 生成プロンプト例:
`Soft ambient piano 75BPM, gentle and introspective, loop 60 seconds, no percussion, suitable for voice journaling app`

## SE（効果音）

| ファイル名 | 用途 |
|---|---|
| `se_start.mp3` | 録音開始（柔らかいチャイム音） |
| `se_stop.mp3` | 録音停止（落ち着いた終了音） |
| `se_save.mp3` | 日記保存完了（達成感のある短音） |
| `se_streak.mp3` | ストリーク達成（喜びを表す音） |

## 注意

- 音声ファイルが未配置の場合、アプリはサイレントモードで動作します（クラッシュしません）。
- expo-av の try/catch でエラーをハンドリングしているため、ファイル未配置でもゲームは続行できます。
