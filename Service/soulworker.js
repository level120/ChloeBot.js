import request from 'request-promise';
import cheerio from 'cheerio';
import voca from 'voca';
import async from 'async'
import Message from './message';

/**
 * Soulworker KR의 모니터링을 담당합니다
 */
export default class Soulworker {
    /**
     * @param {Client} client Client class for discord.js
     */
    constructor(client) {
        this.client = client;

        this.notices = [];
        this.updates = [];
        this.events = [];
        this.gm_magazines = [];

        this.msg = new Message(client);
    }

    /**
     * 파싱된 Link 앞에 붙여질 요소입니다
     */
    get prefix() {
        return 'http://soulworker.game.onstove.com';
    }

    get eventUrl() {
        return 'http://soulworker.game.onstove.com/Event';
    }

    /**
     * 파싱대상 url의 목록입니다
     */
    get urls() {
        return {
            notice: 'http://soulworker.game.onstove.com/Notice/List',
            update: 'http://soulworker.game.onstove.com/Update/List',
            event: 'http://soulworker.game.onstove.com/Event/List',
            gm_magazine: 'http://soulworker.game.onstove.com/GMMagazine/List'
        }
    }

    /**
     * 게시판 모니터링을 시작합니다
     */
    monitoring() {
        console.log(`Start monitoring on ${this.client.user.username}`);

        return setInterval(() => {
            async.forEachOf(this.urls, (url, type) => {
                try {
                    request(url).then((html) => {
                        const $ = cheerio.load(html);
                        const context = this.getBoardSelector(type, $);

                        context.each((_, element) => {
                            const data = this.getData(type, $, element);

                            switch (type) {
                                case 'notice':
                                    const isNewNotice = this.notices.every(n => n.title !== data.title);
                                    if (isNewNotice && this.notices.length > 0) {
                                        console.log(`[notice] title: ${data.title},\turl: ${data.url}`);
                                        this.msg.sendMessage(data.url);
                                        this.notices.push(data);
                                    }
                                    break;

                                case 'update':
                                    const isNewUpdate = this.updates.every(n => n.title !== data.title);
                                    if (isNewUpdate && this.updates.length > 0) {
                                        console.log(`[update] title: ${data.title},\turl: ${data.url}`);
                                        this.msg.sendMessage(data.url);
                                        this.updates.push(data);
                                    }
                                    break;

                                case 'event':
                                    const isNewEvent = this.events.every(n => n.title !== data.title);
                                    if (isNewEvent && this.events.length > 0) {
                                        console.log(`[event] title: ${data.title},\turl: ${data.url}`);
                                        this.msg.sendEmbedMessage(type, { title: data.title, url: data.url, imgUrl: data.imgUrl });
                                        this.events.push(data);
                                    }
                                    break;

                                case 'gm_magazine':
                                    const isNewGM = this.gm_magazines.every(n => n.title !== data.title);
                                    if (isNewGM && this.gm_magazines.length > 0) {
                                        console.log(`[gm magazine] title: ${data.title},\turl: ${data.url}`);
                                        this.msg.sendMessage(data.url);
                                        this.gm_magazines.push(data);
                                    }
                                    break;
                            }
                        });
                    })
                }
                catch (err) {
                    console.error(`[Success] Error Handler has detected\n${err}`);
                }
            })
        }, 30000);
    }

    /**
     * 게시글 타입에 맞는 selector를 반환합니다
     * @param {string} type board type
     * @returns selector
     */
    getBoardSelector(type, $) {
        if (type === 'notice' || type === 'update')
            return $('table.b-list-normal tbody').children('tr');

        return $('ul.b-list-event').children('li');
    }

    /**
     * 게시글 타입에 맞는 데이터를 반환합니다
     * @param {string} type board type
     * @returns parsing 된 데이터
     */
    getData(type, $, element) {
        if (type === 'notice' || type === 'update') {
            return {
                title: voca.trim($(element).find('td.t-subject p').text()),
                url: this.prefix + $(element).find('td.t-subject p a').attr('href')
            };
        }

        if (type === 'event') {
            return {
                title: voca.trim($(element).find('div.t-subject a span').text()),
                imgUrl: 'http:' + $(element).find('div.thumb a img').attr('src'),
                url: this.eventUrl
            };
        }

        return {
            title: voca.trim($(element).find('div.t-subject a span.ellipsis').text()),
            url: this.prefix + $(element).find('div.thumb a').attr('href')
        };
    }
}