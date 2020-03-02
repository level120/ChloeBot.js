import { RichEmbed } from 'discord.js';
import Message from './message';

/**
 * bot의 명령어 집합입니다
 * 일반 사용자용 명령어 집합은 등록하지 않습니다
 * @param { CLient } client class in discord.js
 */
export default function registrationCommand(client) {
    const prefix = '!';

    // bot이 가입될 때 보내는 메세지(이벤트)
    client.on('guildCreate', guild => {
        const embed = new RichEmbed()
            .setTitle(`안녕하세요! ${client.user.username} 입니다! 반가워요~!`)
            .setColor(0xFFACAC)
            .setDescription('자세한 소개를 보려면 `!help`를 입력해주세요!');

        let defaultChannel = '';

        guild.channels.forEach((channel) => {
            if (channel.type === 'text' && defaultChannel === '' && channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
                defaultChannel = channel;
            }
        });

        if (defaultChannel !== '')
            defaultChannel.send(embed);

        console.log(`[Registered] ${guild.name} - ${defaultChannel.name}`);
    });

    client.on('guildDelete', guild => {
        console.log(`[Terminated] ${guild.name}`);
    });

    client.on('message', msg => {
        if (!msg.content.startsWith(prefix))
            return;

        if (msg.content.startsWith(prefix + 'help')) {
            const embed = new RichEmbed()
                .setTitle('소울워커의 새로운 게시글을 감시합니다!')
                .setColor(0xFFACAC)
                .setDescription('그 이외 다른 기능은 없습니다!\n문의 및 버그제보는 여기로 주세요, jinheedo19@gmail.com')
                .setImage('https://i.imgur.com/hsV3Tk1.png');

            msg.channel.send(embed);
        }
    });

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