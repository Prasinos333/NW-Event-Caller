import mysql from "mysql2";

class Database {
    constructor(mySqlUrl) {
        this.connection = null;
        this.initialise(mySqlUrl);
    }

    async initialise(mySqlUrl) {
        try {
            this.connection = await mysql.createConnection(mySqlUrl);
        } catch (err) {
            console.log(err);
        }
    }

    async retrieveConfig(userID) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                'SELECT Lang, Setting FROM InvasionConfig WHERE UserID = ?',
                [userID],
                (err, results) => {
                    if (err) reject(err);
                    else resolve(results[0]);
                }
            );
        });
    } 

    async addConfig(userID, lang, setting) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                'INSERT INTO InvasionConfig (UserID, Lang, Setting) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE Lang = VALUES(Lang), Setting = VALUES(Setting)',
                [userID, lang, setting],
                (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                }
            );
        });
    }
}

export default Database;
