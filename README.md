# NW-Event-Caller

A discord bot to call buy times and skulls in invasions and respawn times in wars for the game New World.

## Invite Link

- [Main Bot](https://discord.com/oauth2/authorize?client_id=1171903368713744454)

### Copies 
> [!WARNING]
> *Only add after the main bot and if your server hosts multiple simultaneous events.*
- [NW Event Caller (2)](https://discord.com/oauth2/authorize?client_id=1173464789293469837)
- [NW Event Caller (3)](https://discord.com/oauth2/authorize?client_id=1173465231079522406)

## How It Works

Siege windows occur in a 30-minute time slot, such as 8:30-9:00 or 10:00-10:30.
- Wars have a 15-minute setup and last up to 30 minutes.
- Invasions have a 10-minute setup phase and last up to 25 minutes.

From this information, the bot can determine the siege window from when it is launched automatically. To allow for prep time a bot can be started up to 10 minutes prior to the start of the siege window (ex. XX:20 or XX:50), any sooner and it will register the previous siege window. However, this means that you cannot start a bot in the last 10 minutes of a war or 5 minutes of an invasion.

All timings are visible in the [config file](/src/config.js).

## Commands

- `/addcaller <type>`
  - The two options for `type` are `Invasions` and `Respawns`. This will add the next available bot if any, to your current voice channel. 
- `/voiceraffle <number>`
  - Randomly selects `number` of users from your current voice channel. Replies with a bulleted list of randomly selected user(s) in an embed.

## Controls

After starting there will be a string select menu to change the voice and a button below it to `Stop` the bot. for invasions to `Change Setting`. 

### Invasion Specific Controls
For invasions an additional button titled `Change Setting` loops through upon pressing `Buy&Skulls` , `Buy`, and `Skull`. The default, `Buy&Skulls` calls both buy phases and skulls, `Buy` will only call buy phases, and `Skull` will only call skulls.

--------------

Alternatively, typing just `/` will bring up the command menu. From there you can select `! NW Caller` and you will see all the commands for the bot, from which you can choose. Currently, both commands require: *To be used in a text channel the bot has 'send messages' permissions and while you're in a voice channel it has access to*.

> [!WARNING]
> *New World and/or host servers may have become desynchronized with real-time, therefore the bot could be slightly inaccurate at times.*

## Dependencies 

[FFmpeg](https://ffmpeg.org/)

[Node](https://nodejs.org/)

[Yarn](https://yarnpkg.com/)

## License

This is completely free and released under the [MIT License](/LICENSE).
