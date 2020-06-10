import cheerio from 'cheerio';
import voca from 'voca';
import async from 'async'
import Message from './message';
import axios from 'axios'

/**
 * Soulworker KR의 모니터링을 담당합니다
 */
export default class Soulworker {
    /**
     * @param {Client} client Client class for discord.js
     */
    constructor(client) {
        this.initialized = {
            notice: false,
            update: false,
            event: false,
            gm_magazine: false
        };

        this.max_count = 50;
        this.time_interval = 30000;
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
        };
    }

    /**
     * 게시판 모니터링을 시작합니다
     */
    monitoring() {
        console.log(`Start monitoring on ${this.client.user.username}`);

        return setInterval(() => {
            async.forEachOf(this.urls, (url, type) => {
                axios.get(url)
                    .then((response) => this.process(response.data, type))
                    .catch((err) => console.error(`[Exception] Throwing error by handler\n${err}`));
            });
        }, this.time_interval);
    }

    process(html, type) {
        async.series([
            (callback) => {
                this.parse(html, type);
                callback(null, '');
            },
            () => this.reverseData(type)
        ]);
    }

    /**
     * html 태그를 이용해 데이터를 parse 합니다.
     * @param {*} html html tag
     */
    parse(html, type) {
        const $ = cheerio.load(html);
        const context = this.getBoardSelector(type, $);

        context.each((_, element) => {
            const data = this.getData(type, $, element);

            switch (type) {
                case 'notice':
                    const isNewNotice = this.notices.every(n => n.title !== data.title);
                    if (isNewNotice && this.initialized[type]) {
                        console.log(`[notice] title: ${data.title},\turl: ${data.url}`);
                        this.msg.sendMessage(data.url);
                        this.notices.push(data);

                        if (this.notices.length > this.max_count) {
                            this.notices.splice(0, (this.notices.length - this.max_count));
                        }
                    }
                    else if (!this.initialized[type]) {
                        this.notices.push(data);
                    }
                    break;

                case 'update':
                    const isNewUpdate = this.updates.every(n => n.title !== data.title);
                    if (isNewUpdate && this.initialized[type]) {
                        console.log(`[update] title: ${data.title},\turl: ${data.url}`);
                        this.msg.sendMessage(data.url);
                        this.updates.push(data);

                        if (this.updates.length > this.max_count) {
                            this.updates.splice(0, (this.updates.length - this.max_count));
                        }
                    }
                    else if (!this.initialized[type]) {
                        this.updates.push(data);
                    }
                    break;

                case 'event':
                    const isNewEvent = this.events.every(n => n.title !== data.title);
                    if (isNewEvent && this.initialized[type]) {
                        console.log(`[event] title: ${data.title},\turl: ${data.url}`);
                        this.msg.sendEmbedMessage(type, { title: data.title, url: data.url, imgUrl: data.imgUrl });
                        this.events.push(data);

                        if (this.events.length > this.max_count) {
                            this.events.splice(0, (this.events.length - this.max_count));
                        }
                    }
                    else if (!this.initialized[type]) {
                        this.events.push(data);
                    }
                    break;

                case 'gm_magazine':
                    const isNewGM = this.gm_magazines.every(n => n.title !== data.title);
                    if (isNewGM && this.initialized[type]) {
                        console.log(`[gm magazine] title: ${data.title},\turl: ${data.url}`);
                        this.msg.sendMessage(data.url);
                        this.gm_magazines.push(data);

                        if (this.gm_magazines.length > this.max_count) {
                            this.gm_magazines.splice(0, (this.gm_magazines.length - this.max_count));
                        }
                    }
                    else if (!this.initialized[type]) {
                        this.gm_magazines.push(data);
                    }
                    break;
            }
        });
    }

    /**
     * 첫 크롤러 동작 시 최신글이 맨 마지막에 배치되도록 만드는 작업
     * @param {string} type list 구분자
     */
    reverseData(type) {
        // set condition for initialization
        if (!this.initialized[type]) {
            this.initialized[type] = true;

            switch (type) {
                case 'notice':
                    this.notices.reverse();
                    break;

                case 'update':
                    this.updates.reverse();
                    break;

                case 'event':
                    this.events.reverse();
                    break;

                case 'gm_magazine':
                    this.gm_magazines.reverse();
                    break;
            }
        }
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
                imgUrl: $(element).find('div.thumb a img').attr('src'),
                url: this.eventUrl
            };
        }

        return {
            title: voca.trim($(element).find('div.t-subject a span.ellipsis').text()),
            url: this.prefix + $(element).find('div.thumb a').attr('href')
        };
    }
}