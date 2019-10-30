import { RichEmbed } from 'discord.js';

/**
 * bot의 명령어 집합입니다
 * @param { CLient } client class in discord.js
 */
export function registrationCommand(client) {
    client.on('message', msg => {
        if (msg.content === 'ping') {
            const embed = new RichEmbed()
                .setTitle('pong')
                .setColor(0xFF0000)
                .setDescription('test message');

            msg.channel.send(embed);
        }
    });
}