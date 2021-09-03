# Smarthome Backend

## What's this?
家電の操作コマンドをWeb APIとして外部から叩けるようにしたもの

[USB赤外線リモコンアドバンス](https://bit-trade-one.co.jp/product/module/adir01p/)の利用を想定

## Setup

依存関係のインストール

```shell
$ npm install
```

ルートディレクトリに`config.json`を以下の内容で作成．

- `pass`：自分で設定するパスワード
- `irDataDir`：赤外線データの入ったディレクトリ

```
{
    "pass": "12345",
    "irDataDir": "$HOME/Documents"
}
```

## API一覧

| メソッド | パス              | 内容                              |
| -------- | ----------------- | --------------------------------- |
| `GET`    | `/api/v1/list`    | 操作できる家電の一覧              |
| `GET`    | `/api/v1/$name`   | `$name`の操作一覧           |
| `POST`   | `/api/v1/$name/$op` | `$op`を実行．bodyにpassphraseが必要 |

## dataの追加

`target.json`に家電を追加する．

`id`として指定した名前と同じファイル名のjsonファイルに操作を記載する．
