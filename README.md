NW-Event-Caller
--------------

A discord bot to call buy times and skulls in invasions and respawn times in wars for the game New World.

USAGE
----------

Siege windows occur in a 30-minute time slot, such as 8:30-9:00 or 10:00-10:30.
- Wars have a 15-minute setup and last up to 30 minutes.
- Invasions have a 10-minute setup phase and last up to 25 minutes.
From this information, the bot can determine the siege window from when it is launched automatically. To allow for prep time a bot can be started up to 10 minutes prior to the start of the siege window. However, the trade-off is that you cannot start a bot in the last 10 minutes of a war or 5 minutes of an invasion.

To add an `Event Caller` bot use the slash command `/addcaller`, from there you will be prompted to choose the caller type. The two options for `type` are `Invasions` and `Respawns`.

The other command the bot has is `/voiceraffle`. Which prompts the user for the number of users to randomly select from your current voice channel and returns the bulleted list of names in an embed.

Currently, both commands require you to *use them in a text channel the bot has 'send messages' permissions and while you're in a voice channel it has access to*.

Warning: New World servers may have become desynchronization with real-time, therefore the bot may be slightly inaccurate from time to time.
All times are visible in the [config file](/src/config.js).

Dependencies 
--------------

[FFmpeg](https://ffmpeg.org/)

[Node](https://nodejs.org/)

[Yarn](https://yarnpkg.com/)