import path from "path";
import fs from "fs";
import { createRequire } from "module";
import logger from "../util/Logger.js";
import { Default_Lang, AUDIO, Respawns, InvasionTimings } from "../config.js";

const {
    createAudioPlayer,
    NoSubscriberBehavior,
    AudioPlayerStatus,
    createAudioResource,
    VoiceConnectionStatus
} = createRequire(import.meta.url)("@discordjs/voice");

class Timer
{
    constructor(name, guildID, connection, bot, type, buttonData) {
        this.logger = logger(`${ path.resolve('logs') }/${ name }.log`);
        this.guildID = guildID;
        this.bot = bot;
        this.audio = AUDIO(Default_Lang);
        this.interval = null;
        this.buttonData = buttonData;
        
        this.player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play
            }
        }); 

        connection.on(VoiceConnectionStatus.Ready, () => {
            connection.subscribe(this.player);
            switch (type) {
                case 'war':
                    this.callRespawns();
                    break;
                case 'invasion':
                    this.callInvasion();
                    break;
            }
        });
    }

    clearTimerInterval = () => {
        clearInterval(this.interval);
    }

    stopTimer = () => {
        this.clearTimerInterval();
        this.bot.stopCommand(this.guildID);
    }

    changeLang = (lang) => {
        this.audio = AUDIO(lang);
    }

    getStartTime = () => { 
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

    getCurrentTime = () => {
        const time = new Date();
        time.setMilliseconds(0);

        return time;
    }

    playAudio = (path) => {
        const status = this.player?.state?.status || AudioPlayerStatus.Idle;
        if (status === AudioPlayerStatus.Idle) {
            this.player.play(createAudioResource(fs.createReadStream(path)));
        }
    }

    getNextTiming = (chrono) => {  
        return InvasionTimings.find((timing) => chrono > timing.value);
    }

    callInvasion = () => { 
        if(this.interval !== null) { // TODO - Bandaid - Function is being called while interval is running. 
            return;
        }

        const startTime = this.getStartTime();
        this.logger.info(`Start time: ${ startTime }`);

        this.playAudio(this.audio["Invasion Notice"]);

        this.interval = setInterval(() => {
            try {
                const chrono = 1500 - (this.getCurrentTime() - startTime) / 1000;
                const nextTiming = this.getNextTiming(chrono);

                if(chrono === 1501) {
                    this.playAudio(this.audio["Invasion Start"]);
                } else if (chrono <= 0) {
                    this.logger.log('Stopping timer (chrono: %s).', chrono);
                    this.stopTimer();
                    this.bot.deleteButton(this.buttonData);
                    return;
                } 

                if((chrono - nextTiming?.value) === 1) {
                    this.logger.log(`Playing "${ nextTiming.name }" (chrono: ${ chrono })`);
                    this.playAudio(this.audio[nextTiming.name]);
                } 
            } catch (e) {
                console.error(e);
            }
        }, 1000);
    }

    getNextRespawn = (chrono) => {
        return Respawns.find((respawn) => chrono > respawn);
    }

    callRespawns = () => {
        if(this.interval !== null) { // TODO - Bandaid - Function is being called while interval is running. 
            return;
        }

        const startTime = this.getStartTime();
        this.logger.info(`Start time: ${ startTime }`);

        this.playAudio(this.audio["War Notice"]);

        this.interval = setInterval(() => {
            try {
                const chrono = 1800 - (this.getCurrentTime() - startTime) / 1000; 

                if(chrono === 1801) {
                    this.playAudio(this.audio["War Start"]);
                } else if (chrono <= 0) {
                    this.logger.log('Stopping timer (chrono: %s).', chrono);
                    this.stopTimer();
                    this.bot.deleteButton(this.buttonData);
                    return;
                }

                switch (chrono - this.getNextRespawn(chrono)) {
                    case 11:
                        this.logger.log('10 seconds remaining (chrono: %s).', chrono);
                        this.playAudio(this.audio["10_second_countdown"]);
                        break;
                    
                    case 16:
                        this.logger.log('15 seconds remaining (chrono: %s).', chrono);
                        this.playAudio(this.audio["15_seconds"]);
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
            } catch (e) {
                console.error(e);
            }
        }, 1000);
    }
}

export default Timer;