# NW-Event-Caller

A Discord bot to call phases, skulls, and close spawns in invasions or respawn times in wars for the game New World: Aeternum.

## Invite Link

- [Main Bot](https://discord.com/oauth2/authorize?client_id=1171903368713744454)

### Additional Bots

> [!WARNING]
> *Only add after the main bot and if your server hosts multiple simultaneous events.*
- [NW Event Caller (2)](https://discord.com/oauth2/authorize?client_id=1173464789293469837)
- [NW Event Caller (3)](https://discord.com/oauth2/authorize?client_id=1173465231079522406)
- [NW Event Caller (4)](https://discord.com/oauth2/authorize?client_id=1337627489094340688)

## How It Works

Siege windows occur in a 30-minute time slot, such as 8:30-9:00 or 10:00-10:30.

- Wars have a 15-minute prep phase and have a 30-minute duration.
- Invasions have a 10-minute prep phase and have a 25-minute duration.

From this information, the bot can determine the siege window from when it is launched. To allow for prep time, the bot can be started up to 10 minutes prior to the start of the siege window (ex. XX:20 or XX:50); any sooner, it will register the previous siege window. However, this means the bot cannot be started in the last 10 minutes of a war or 5 minutes of an invasion.

> [!WARNING]
> *Host and/or game servers may have become desynchronized with real-time, therefore, the bot could become slightly inaccurate.*

## Commands

- `/addcaller <type>`
  - The two options for `type` are `Invasions` and `Respawns`. This will add the next available bot, if any, to your current voice channel.
- `/voiceraffle <number>`
  - Randomly selects `number` of users from your current voice channel. Replies with a bulleted list of randomly selected user(s) in an embed.
- `/allowroles`
  - Can only be used by admins of the guild. Will prompt the user to select roles that can interact with buttons they did not create.
---
Alternatively, typing `/` will bring up the command menu. From there, you can select `! NW Event Caller` and you will see all the commands for the bot, from which you can choose. `/addcaller` & `/voiceraffle` commands require: _To be used in a text channel the bot has 'send messages' permissions, and while you're in a voice channel the bot has access to_.

## Event Info Embeds
![Invasion Embed](https://imgur.com/Xd92RMd.png)
<img src="https://github.com/user-attachments/assets/ec157ae8-8554-40a4-9d23-0876177eb019" width="400" />

## Controls
### Common
 - **End Button**
   - Stops the bot. Leaves the voice channel and deletes the embed with associated buttons.
<img src="https://github.com/user-attachments/assets/de09d3a4-fe4a-4e23-bda1-a3c2804330e6" width="320" />

 - **Lang Button**
   - Prompts the user to select the voice/language of the bot to use.

<img src="https://github.com/user-attachments/assets/269b71fa-3bf2-4c99-a2b3-4d23db2b776d" width="320" />

### Invasion
 - **Settings Button**
   - Prompts the user to select the type(s) of invasion timings to be called. *Timings are visible in the [config file](/src/config.js)*
<img src="https://github.com/user-attachments/assets/608d8f53-37ac-4d58-8f08-0f54f372e3b4" width="240" />

### War
 - **Wave Button**
   - Changes the set of wave timings to be called. *Timings are visible in the [config file](/src/config.js)*
<img src="https://github.com/user-attachments/assets/508b8e70-be48-4fb0-8515-459c225a42cd" width="240" />

## Dependencies

[FFmpeg](https://ffmpeg.org/)

[Node](https://nodejs.org/)

[Yarn](https://yarnpkg.com/)

## License

This is completely free and released under the [MIT License](/LICENSE).
