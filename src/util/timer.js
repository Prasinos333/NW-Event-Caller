import path from "path";
import fs from "fs";
import logger from "../util/logger.js";
import { Default_Lang } from "../config.js";
import { AUDIO, Respawns, InvasionTimings } from "../config.js";
import { createAudioPlayer, NoSubscriberBehavior, AudioPlayerStatus, createAudioResource } from "@discordjs/voice";

const settings = ["Buy&Skulls", "Buy", "Skull"];

class Timer {
    constructor(name, guildId, userId, bot) {
        this.logger = logger(`${ path.resolve('logs', 'bots') }/${ name }.log`);
        this.guildId = guildId;
        this.userId = userId;
        this.bot = bot;
        this.lang = Default_Lang;
        this.setting = 0;
        this.audio = AUDIO(this.lang);
        this.interval = null;
        this.buttonData = null;
        this.modifiedConfig = false;
        this.wave = 1;
        
        this.player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play
            }
        }); 
    }

    updateConfig(options) {
        this.audio = AUDIO(options.Lang);
        this.lang = options.Lang;
        this.setting = options.Setting;
    }

    changeButtonData(buttonData) {
        this.buttonData = buttonData;
    }

    subscribeTimer(connection) {
        connection.subscribe(this.player);
    }

    clearTimerInterval() {
        clearInterval(this.interval);
    }

    changeLang(lang) {
        this.audio = AUDIO(lang);
        this.lang = lang;
        this.modifiedConfig = true;
    }

    changeWave() {
        switch (this.wave) {
            case 1:
                this.wave = 2;
                break;
            case 2:
                this.wave = 1;
                break;
        }
        return this.wave;
    }

    changeSetting() {
        this.setting++;
        if(this.setting >= 3) {
            this.setting = 0;
        }
        this.modifiedConfig = true;
        return settings[this.setting];
    }

    getStartTime() { 
        const time = new Date();
        time.setSeconds(0);
        time.setMilliseconds(0);
        const windowMinutes = time.getMinutes();
        
        if(windowMinutes < 20 ) { // 0-19 Minutes
            time.setMinutes(0);
        } else if(20 <= windowMinutes && windowMinutes < 50 ) { // 20-49
            time.setMinutes(30);
        } else if (50 <= windowMinutes) { // 50-59
            time.setMinutes(0);
            time.setTime(time.getTime() + (1*60*60*1000));
        } 

        return time;
    }

    getCurrentTime() {
        const time = new Date();
        time.setMilliseconds(0);

        return time;
    }

    playAudio(path) {
        const status = this.player?.state?.status || AudioPlayerStatus.Idle;
        if (status === AudioPlayerStatus.Idle) {
            this.player.play(createAudioResource(fs.createReadStream(path)));
        }
    }

    stopTimer() {
        this.clearTimerInterval();
        this.bot.stopCommand(this.guildId);
        this.bot.deleteButton(this.buttonData);
    }

    getNextTiming(chrono) {  
        const nextInvasionTiming = InvasionTimings.find((timing) => chrono > timing.value);
        return nextInvasionTiming;
    }

    callInvasion() {  
        if (this.interval !== null) { // TODO - Function is being called while interval is running. 
            return;
        }
    
        const startTime = this.getStartTime();
        this.logger.log(`Start time: ${startTime.toLocaleString('en-US', { timeZone: "America/New_York", timeStyle: 'short' })}`);
        setTimeout(() => {
            this.playAudio(this.audio["Invasion Notice"]);
        }, 500);
    
        let nextTiming = null;
    
        this.interval = setInterval(() => {
            try {
                const chrono = 1500 - (this.getCurrentTime() - startTime) / 1000;
    
                if (chrono === 1501) {
                    this.playAudio(this.audio["Invasion Start"]);
                } else if (chrono <= 0) {
                    this.logger.log('Stopping timer (chrono: %s).', chrono);
                    this.stopTimer();
                    return;
                }
    
                if (!nextTiming || chrono - nextTiming.value < 0) {
                    nextTiming = this.getNextTiming(chrono);
                }
    
                if (nextTiming && (chrono - nextTiming.value) === 1) {
                    if (this.setting === 0 || (this.setting > 0 && nextTiming.name.includes(settings[this.setting]))) {
                        this.logger.log(`Playing "${nextTiming.name}" (chrono: ${chrono})`);
                        this.playAudio(this.audio[nextTiming.name]);
                    }
                }
            } catch (error) {
                this.logger.error(`Error calling invasion:`, error);
            }
        }, 1000);
    }

    getNextRespawn(chrono) {
        const nextRespawn = Respawns.find((respawn) => chrono > respawn.value && (respawn.wave == 0 || respawn.wave == this.wave));
        return nextRespawn;
    }

    callRespawns() { 
        if (this.interval !== null) { // TODO - Function is being called while interval is running. 
            return;
        }
    
        const startTime = this.getStartTime();
        this.logger.log(`Start time: ${startTime.toLocaleString('en-US', { timeZone: "America/New_York", timeStyle: 'short' })}`);
        setTimeout(() => {
            this.playAudio(this.audio["War Notice"]);
        }, 500);
    
        let currentRespawn = null;
    
        this.interval = setInterval(() => {
            try {
                const chrono = 1800 - (this.getCurrentTime() - startTime) / 1000;
    
                if (chrono === 1801) {
                    this.playAudio(this.audio["War Start"]);
                } else if (chrono <= 0) {
                    this.logger.log('Stopping timer (chrono: %s).', chrono);
                    this.stopTimer();
                    return;
                }
    
                if (!currentRespawn || chrono - currentRespawn.value < 0) {
                    currentRespawn = this.getNextRespawn(chrono);
                }
    
                if (chrono <= 1800 && currentRespawn) {
                    switch (chrono - currentRespawn.value) {
                        case 11:
                            this.logger.log('10 seconds remaining (chrono: %s).', chrono);
                            this.playAudio(this.audio["10_second countdown"]);
                            break;
    
                        case 21:
                            this.logger.log('20 seconds remaining (chrono: %s).', chrono);
                            this.playAudio(this.audio["20_seconds"]);
                            break;
    
                        case 31:
                            this.logger.log('30 seconds remaining (chrono: %s).', chrono);
                            this.playAudio(this.audio["30_seconds"]);
                            break;
    
                        case 41:
                            this.logger.log('40 seconds remaining (chrono: %s).', chrono);
                            this.playAudio(this.audio["40_seconds"]);
                            break;
    
                        case 51:
                            this.logger.log('50 seconds remaining (chrono: %s).', chrono);
                            this.playAudio(this.audio["50_seconds"]);
                            break;
                    }
                }
            } catch (error) {
                this.logger.error(`Error calling respawns:`, error);
            }
        }, 1000);
    }
}

export default Timer;
