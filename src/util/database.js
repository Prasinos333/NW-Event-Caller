import dotenv from 'dotenv';
import path from 'path';
import mysql from 'mysql2/promise';
import logger from './logger.js';

dotenv.config({ path: path.resolve('.env'), override: true });

class Database {
    static instance = null;

    constructor() {
        if (Database.instance) {
            return Database.instance;
        }
        Database.instance = this;
        this.pool = null;
        this.eventLog = logger(`${path.resolve('logs', 'bots')}/Events.log`);
        this.initPool();
    }

    getPoolConfig() {
        const requiredEnvVars = ['MYSQL_HOST', 'MYSQL_NAME', 'MYSQL_PORT', 'MYSQL_USER', 'MYSQL_PASS'];
        requiredEnvVars.forEach((envVar) => {
            if (!process.env[envVar]) {
                throw new Error(`Missing required environment variable: ${envVar}`);
            }
        });

        return {
            host: process.env.MYSQL_HOST,
            database: process.env.MYSQL_NAME,
            port: process.env.MYSQL_PORT,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASS,
            waitForConnections: true,
            connectionLimit: 4,
            queueLimit: 10,
            idleTimeout: 60000,
        };
    }

    initPool() {
        const config = this.getPoolConfig();
        this.pool = mysql.createPool(config);
        this.eventLog.log('Created Database connection pool.');

        this.pool.on('error', async (err) => {
            this.eventLog.error('Database pool error:', err);
            await this.reconnect();
        });
    }

    async reconnect() {
        try {
            await this.pool.end();
        } catch (err) {
            this.eventLog.error('Error ending pool:', err);
        } finally {
            this.initPool();
        }
    }

    async isConnected() {
        try {
            await this.pool.query('SELECT 1');
            return true;
        } catch (error) {
            this.eventLog.error('Database connection check failed:', error);
            return false;
        }
    }

    async retrieveConfig(userID) {
        // TODO - Placeholder
        if (!userID) {
            throw new Error('Invalid userID');
        }

        try {
            const [results] = await this.pool.query(
                'SELECT Lang, Setting FROM InvasionConfig WHERE UserID = ?',
                [userID]
            );
            return results[0];
        } catch (error) {
            this.eventLog.error(`Error retrieving config for user ${userID}:`, error);
            throw error;
        }
    }

    async addConfig(userID, lang, setting) {
        // TODO - Placeholder
        if (!userID || !lang || !setting) {
            throw new Error(`Invalid input parameters: ${userID}, ${lang}, ${setting}`);
        }

        this.eventLog.log(`Updating config for user: '${userID}' | Lang: '${lang}' | Setting: '${setting}'`);
        try {
            const [results] = await this.pool.query(
                'INSERT INTO InvasionConfig (UserID, Lang, Setting) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE Lang = VALUES(Lang), Setting = VALUES(Setting)',
                [userID, lang, setting]
            );
            return results;
        } catch (error) {
            this.eventLog.error(`Error updating config for user ${userID}:`, error);
            throw error;
        }
    }
}

export default Database;
