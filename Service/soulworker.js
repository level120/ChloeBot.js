import request from 'request-promise';
import cheerio from 'cheerio';
import voca from 'voca';
import { compareLists } from 'compare-lists';
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

        this.notices_old = [];
        this.updates_old = [];
        this.events_old = [];
        this.gm_magazines_old = [];

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
            for (const type in this.urls) {
                const url = this.urls[type];

                request(url).then((html) => {
                    const $ = cheerio.load(html);
                    const context = this.getBoardSelector(type, $);

                    context.each((_, element) => {
                        const data = this.getData(type, $, element);

                        switch (type) {
                            case 'notice':
                                this.notices.push(data);
                                break;
                            case 'update':
                                this.updates.push(data);
                                break;
                            case 'event':
                                this.events.push(data);
                                break;
                            case 'gm_magazine':
                                this.gm_magazines.push(data);
                                break;
                        }
                    });
                }).then(() => {
                    if (this.notices.length > 0) {
                        this.notices.forEach(item => {
                            const res = this.notices_old.every(n => n.title !== item.title);
                            if (res && this.notices.length > 0 && this.notices_old.length > 0) {
                                console.log(`[notice] title: ${item.title},\turl: ${item.url}`);
                                this.msg.sendMessage(item.url);
                            }
                        });

                        this.notices_old = this.notices;
                        this.notices = [];
                        this.notices_old.splice(0, 1);
                    }

                    if (this.updates.length > 0) {
                        this.updates.forEach(item => {
                            const res = this.updates_old.every(n => n.title !== item.title);
                            if (res && this.updates.length > 0 && this.updates_old.length > 0) {
                                console.log(`[update] title: ${item.title},\turl: ${item.url}`);
                                this.msg.sendMessage(item.url);
                            }
                        });

                        this.updates_old = this.updates;
                        this.updates = [];
                    }

                    if (this.events.length > 0) {
                        this.events.forEach(item => {
                            const res = this.events_old.every(n => n.title !== item.title);
                            if (res && this.events.length > 0 && this.events_old.length > 0) {
                                console.log(`[event] url: ${item.url},\t img url: ${item.imgUrl}`);
                                this.msg.sendEmbedMessage(type, { url: item.url, imgUrl: item.imgUrl });
                            }
                        });

                        this.events_old = this.events;
                        this.events = [];
                    }

                    if (this.gm_magazines.length > 0) {
                        this.gm_magazines.forEach(item => {
                            const res = this.gm_magazines_old.every(n => n.title !== item.title);
                            if (res && this.gm_magazines.length > 0 && this.gm_magazines_old.length > 0) {
                                console.log(`[gm magazine] title: ${item.title},\turl: ${item.url}`);
                                this.msg.sendMessage(item.url);
                            }
                        });

                        this.gm_magazines_old = this.gm_magazines;
                        this.gm_magazines = [];
                    }
                });
            }
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