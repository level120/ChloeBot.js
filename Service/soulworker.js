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
                        let notice_temp = [];

                        compareLists({
                            left: this.notices_old.url,
                            right: this.notices.url,
                            compare: (left, right) => left.localeCompare(right),
                            onMissingInLeft: (right) => notice_temp.push(right)
                        });

                        if (this.notices.length > 0 && this.notices_old.length > 0 && notice_temp.length > 0) {
                            notice_temp.forEach((url) => {
                                this.msg.sendMessage(url);
                            });
                        }

                        this.notices_old = this.notices;
                        this.notices = [];
                    }

                    if (this.updates.length > 0) {
                        let update_temp = [];

                        compareLists({
                            left: this.updates_old.url,
                            right: this.updates.url,
                            compare: (left, right) => left.localeCompare(right),
                            onMissingInLeft: (right) => update_temp.push(right)
                        });

                        if (this.updates.length > 0 && this.updates_old.length > 0 && update_temp.length > 0) {
                            update_temp.forEach((url) => {
                                this.msg.sendMessage(url);
                            });
                        }

                        this.updates_old = this.updates;
                        this.updates = [];
                    }

                    if (this.events.length > 0) {
                        let event_temp = [];

                        compareLists({
                            left: this.events_old.imgUrl,
                            right: this.events.imgUrl,
                            compare: (left, right) => left.localeCompare(right),
                            onMissingInLeft: (right) => event_temp.push(right)
                        });

                        if (this.events.length > 0 && this.events_old.length > 0 && event_temp.length > 0) {
                            event_temp.forEach((imgUrl) => {
                                this.msg.sendEmbedMessage(type, {url: this.eventUrl, imgUrl: imgUrl});
                            });
                        }

                        this.events_old = this.events;
                        this.events = [];
                    }

                    if (this.gm_magazines > 0) {
                        let gm_magazines_temp = [];

                        compareLists({
                            left: this.gm_magazines_old.url,
                            right: this.gm_magazines.url,
                            compare: (left, right) => left.localeCompare(right),
                            onMissingInLeft: (right) => gm_magazines_temp.push(right)
                        });

                        if (this.gm_magazines.length > 0 && this.gm_magazines_old.length > 0 && gm_magazines_temp.length > 0) {
                            gm_magazines_temp.forEach((url) => {
                                this.msg.sendMessage(url);
                            });
                        }

                        this.gm_magazines_old = this.gm_magazines;
                        this.gm_magazines = [];
                    }
                });
            }
        }, 60000);
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