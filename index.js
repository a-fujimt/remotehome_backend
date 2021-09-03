// expressモジュールを読み込む
const express = require('express');

// expressアプリを生成する
const app = express();

// POSTで送信されたJSONを解釈する
app.use(express.json());

// 設定ファイル読み込み
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

// データファイル読み込み
const targets = JSON.parse(fs.readFileSync('./data/targets.json', 'utf8'));
var allData = [];
targets.forEach(target => {
    const filename = './data/' + target.id + '.json';
    const operations = JSON.parse(fs.readFileSync(filename, 'utf8'));
    const element = {
        id: target.id,
        name: target.name,
        operations: operations
    }
    allData.push(element);
});

// apiエンドポイントの設定
app.get('/api/v1/list', (req, res) => {
    res.json(targets)
});

app.get('/api/v1/:id', (req, res) => {
    if (!allData.some(target => target.id == req.params.id)) {
        res.status(404);
        res.json(
            { error: { message: 'appliciance not found' } }
        )
        return
    }
    target = allData.find(target => target.id == req.params.id)
    res.json(target.operations)
});

const exec = require('child_process').exec; // 外部プログラムを起動する
app.post('/api/v1/:id/:op', (req, res) => {
    if (!allData.some(target => target.id == req.params.id)) {
        res.status(404);
        res.json(
            { error: { message: 'appliciance not found' } }
        )
        return
    }
    target = allData.find(target => target.id == req.params.id)
    if (!target['operations'].some(op => op.id == req.params.op)) {
        res.status(404);
        res.json(
            { error: { message: 'operation not found' } }
        )
        return
    }
    if (config.passphrase != req.body.passphrase) {
        res.status(403);
        res.json(
            { error: { message: 'wrong pass phrase' } }
        )
        return
    }

    const command = 'bto_advanced_USBIR_cmd -d `cat '+ config.irDataDir + req.params.id + '_' + req.params.op + '`';
    exec(command, (err, stdout, stderr) => {
        if (err) {
            res.status(500)
            res.json(
                {
                    error: {
                        message: 'cannot execute command',
                        stderr: stderr,
                        detail: err
                    }
                }
            )
            return
        }
        res.send('OK')
    });
});

// エラーハンドリング
// 存在しないパスにアクセスした時404を返す
var errorhandler = require('errorhandler');
app.use(function (req, res, next) {
    res.status(404)
    res.json(
        { error: { message: 'not found' } }
    )
});
app.use(errorhandler());

// ポート3000でサーバを立てる
app.listen(3000, () => console.log('Listening on port 3000'));
