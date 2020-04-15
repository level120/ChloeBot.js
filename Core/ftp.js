import ftpClient from 'ftp-client';
import fs from 'fs';
import { resolve } from 'path';

const config = {
    host: '192.168.0.5',
    port: 21,
    user: 'anonymous',
    password: 'anonymous@'
};

const option = {
    logging: 'none',
    overwrite: 'none'
};

const ftp = new ftpClient(config, option);

/**
 * 모든 .token 파일을 삭제합니다
 */
function removeToken() {
    const path = '.';
    const regex = /[.]token$/;
    fs.readdirSync(path)
        .filter(f => regex.test(f))
        .map(f => fs.unlinkSync(resolve(f)));
}

/**
 * ftp로부터 token 파일을 받은 후 name과 일치하는 파일의 값을 반환합니다
 * @param {string} name url or path to filename
 */
function connect(name) {
    return new Promise((done) => {
        ftp.connect(() => {
            const ftpTokenPath = '/';
            const downloadPath = '.';

            ftp.download(ftpTokenPath, downloadPath, { overwrite: 'all' }, () => {
                fs.readFile(name, 'utf8', (err, token) => {
                    if (!err) {
                        removeToken();
                        done(token);
                    }
                });
            });
        })
    });
}

/**
 * ftp로 접근해 token 파일을 받아 그 값을 받습니다
 * 다운받은 파일은 값 저장과 동시에 삭제됩니다
 * @param {string} path ftp에서의 token 파일 경로
 * @param {string} name token 파일명
 * @param {function} callback token 값 반환
 */
function downloadToken(name, callback) {
    connect(name).then((result) => {
        callback(result);
    });
}

/**
 * 봇의 token 값을 확인합니다
 * 만약 해당하는 값이 없다면 undefined 혹은 에러를 띄웁니다
 * @param {string} type bot type, [chloe, lovelyLily]
 * @param {function} callback token 값 반환
 * @throws when type is undefined
 * @throws when token file not found
 */
export default function (type, callback) {
    const name =
        type === 'chloe' ? 'Bot.token' :
        type === 'lovelyLily' ? 'debug.token' : undefined;

    if (name == undefined)
        throw 'Not found bot type';

    downloadToken(name, (token) => {
        if (token == undefined)
            throw 'Couldn\'t download or read a token file';

        callback(token);
    });
}