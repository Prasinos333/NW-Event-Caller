import mysql from "mysql2";

class Database {
    constructor(mySqlUrl) {
        this.connection = null;
        this.initialise(mySqlUrl);
    }

    async initialise(mySqlUrl) {
        this.connection = await mysql.createConnection(mySqlUrl)
        .then(() => console.log('Connected to database'))
        .catch(err => console.log(`Error connecting to database: ${ err }`));
    }

    async retrieveConfig(userID)  {
        return new Promise((resolve, reject) => {
            this.connection.query(
                `SELECT Lang, Setting FROM InvasionConfig WHERE UserID = ${ userID }`,
                (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                }
            );
        });
    } 

    async addConfig(userID, lang, type) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                `INSERT INTO InvasionConfig (UserID, Lang, Setting) VALUES (${ userID }, ${ lang } , ${ type }) ON DUPLICATE KEY UPDATE Lang = VALUES(Setting), Type = VALUES(Setting)`,
                (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                }
            );
        });
    }
}

