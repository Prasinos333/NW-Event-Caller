import mysql from "mysql2/promise";
import logger from "../util/Logger.js";

dotenv.config({ path: path.resolve('.env'), override: true });

class Database {
    constructor() {
        this.pool = null;
        this.lastConnected = new Date();
        this.eventLog = logger(`${ path.resolve('logs', 'bots') }/Events.log`);
        this.initPool();
    }

    initPool() {
        const config = {
            host: process.env.MYSQL_HOST,
            database: process.env.MYSQL_NAME,
            port: process.env.MYSQL_PORT,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASS,
            waitForConnections: true,
            connectionLimit: 4,
        };

        this.pool = mysql.createPool(config);
        this.lastConnected = new Date(); 
        this.eventLog.log(`Created Database connection pool.`);
        
        this.pool.on('error', async (err) => {
            this.eventLog.error('MySQL pool error:', err);
            const now = new Date();
            if ((now - this.lastConnected) / (1000 * 60 * 60) < 8) { // Check if within 8 hours
                this.eventLog.warn('Attempting to recreate the pool due to error...');
                await this.reconnect();
            }
        });
    }

    async reconnect() {
        await this.pool.end();
        this.initPool();
    }

    isConnected() {
        const now = new Date();
        return (now - this.lastConnected) / (1000 * 60 * 60) < 4; // Check if within 8 hours
    }

    async retrieveConfig(userID) {
        try {
            const [results] = await this.pool.query(
                'SELECT Lang, Setting FROM InvasionConfig WHERE UserID = ?',
                [userID]
            );
            return results[0];
        } catch (err) {
            this.eventLog.error(`Error retrieving config:`, err);
            throw err;
        }
    }

    async addConfig(userID, lang, setting) {
        try {
            const [results] = await this.pool.query(
                'INSERT INTO InvasionConfig (UserID, Lang, Setting) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE Lang = VALUES(Lang), Setting = VALUES(Setting)',
                [userID, lang, setting]
            );
            return results;
        } catch (err) {
            this.eventLog.error(`Error updating config:`, err);
            throw err;
        }
    }
}

export default Database;
