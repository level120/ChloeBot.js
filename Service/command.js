import { RichEmbed } from 'discord.js';
import Message from './message';

/**
 * bot의 명령어 집합입니다
 * 일반 사용자용 명령어 집합은 등록하지 않습니다
 * @param { CLient } client class in discord.js
 */
export function registrationCommand(client) {
    const prefix = '!';

    client.on('message', msg => {
        if (!msg.content.startsWith(prefix))
            return;

        if (msg.content.startsWith(prefix + 'bc') && msg.author.id === '275540899973300225') {
            const [cmd, title, ...description] = msg.content.split(' ');
            const embed = new RichEmbed()
                .setTitle(title)
                .setColor(0xFFACAC)
                .setDescription(description.join(' '));

            const message = new Message(client);
            message.sendMessage(embed);
        }
    });

    client.on('message', msg => {
        if (!msg.content.startsWith(prefix))
            return;

        if (msg.content.startsWith(prefix + 'reg') && msg.author.id === '275540899973300225') {
            let regList = [];

            client.guilds.forEach((guild) => {
                let defaultChannel = '';

                guild.channels.forEach((channel) => {
                    if (channel.type === 'text' && defaultChannel === '' && channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
                        defaultChannel = channel;
                    }
                });

                regList.push(`${guild.name} - ${defaultChannel.name}`);
            });

            const embed = new RichEmbed()
                .setTitle(`${client.user.username}에 가입된 서버 목록. Count: ${client.guilds.size}`)
                .setColor(0xFFACAC)
                .setDescription(regList.join('\n'));

            msg.channel.send(embed);
        }
    });
}