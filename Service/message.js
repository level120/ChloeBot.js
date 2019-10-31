import { RichEmbed } from 'discord.js';

/**
 * 전체 서버에 message를 보내는 것을 담당합니다 
 */
export default class Message {
    /**
     * @param {Client} client Client class for discord.js 
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * 데이터로부터 메세지를 만들고 봇이 가입된 전체 서버에 메세지를 보냅니다
     * @param {string} type 게시판 유형
     * @param {*} msgObj 전송할 메세지가 담긴 객체
     */
    sendEmbedMessage(type, msgObj) {
        const msgEmbed = new RichEmbed()
            .setTitle(msgObj.title)
            .setURL(msgObj.url)
            .setColor(0xFF0000);

        if (type === 'event') {
            msgEmbed.setImage(msgObj.imgUrl);
        }

        this.sendMessage(msgEmbed);
    }

    /**
     * Bot이 가입된 전체 서버에 메세지를 보냅니다
     * @param { object } msg string 또는 RichEmbed
     */
    sendMessage(msg) {
        this.client.guilds.forEach((guild) => {
            let defaultChannel = '';

            guild.channels.forEach((channel) => {
                if (channel.type === 'text' && defaultChannel === '' && channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
                    defaultChannel = channel;
                }
            });

            defaultChannel.send(msg);
            console.log(`${guild.name} - ${defaultChannel.name} is sended message`);
        });
    }
}