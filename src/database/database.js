/* eslint-disable no-undef */
import dotenv from "dotenv";
import path from "path";
import logger from "../util/logger.js";
import mysql from "mysql2/promise";

dotenv.config({ path: path.resolve(".env"), override: true });

class Database {
  static instance = null;

  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    Database.instance = this;
    this._pool = null;
    this._eventLog = logger("Events");
    this._initPool();
  }

  /**
   * Retrieves the database connection pool configuration from environment variables.
   *
   * @returns {object} - The database connection pool configuration.
   */
  _getPoolConfig() {
    const requiredEnvVars = [
      "MYSQL_HOST",
      "MYSQL_NAME",
      "MYSQL_PORT",
      "MYSQL_USER",
      "MYSQL_PASS",
    ];
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

  /**
   * Initializes the database connection pool.
   */
  _initPool() {
    const config = this._getPoolConfig();
    this._pool = mysql.createPool(config);
    this._eventLog.info("Created Database connection pool.");

    this._pool.on("error", async (err) => {
      this._eventLog.error("Database pool error:", err);
      await this.reconnect();
    });
  }

  /**
   * Reconnects to the database by ending the current pool and creating a new one.
   */
  async reconnect() {
    try {
      await this._pool.end();
    } catch (err) {
      this._eventLog.error("Error ending pool:", err);
    } finally {
      this._initPool();
    }
  }

  /**
   * Checks if the database connection is active.
   *
   * @returns {boolean} - True if connected, false otherwise.
   */
  async isConnected() {
    try {
      await this._pool.query("SELECT 1");
      return true;
    } catch (error) {
      this._eventLog.error("Database connection check failed:", error);
      return false;
    }
  }

  /**
   * Retrieves the user configuration from the database.
   * Converts the `Setting` column (stored as a CSV string) into an array.
   *
   * @param {snowflake} userID - The user ID to retrieve the config for.
   * @returns {object} - The user config object with `Setting` as an array.
   */
  async getUserConfig(userID) {
    // Validate userID
    if (!userID || userID.length > 19) {
      throw new Error(
        `Invalid User ID: Must be 19 characters or less. Received: ${userID}`
      );
    }

    try {
      const [results] = await this._pool.query(
        "SELECT Lang, Setting FROM UserConfig WHERE UserID = ?",
        [userID]
      );

      if (results.length === 0) {
        return null; // Return null if no matching user is found
      }

      const config = results[0];
      config.Setting = config.Setting ? config.Setting.split(",") : []; // Convert CSV to array
      return config;
    } catch (error) {
      this._eventLog.error(
        `Error retrieving config for user: ${userID}`,
        error
      );
      throw error;
    }
  }

  /**
   * Updates the user configuration in the database.
   *
   * @param {snowflake} userID - The user ID to update the config for.
   * @param {string} lang - The language to set.
   * @param {array} setting - The setting to set.
   * @returns {object} - The result of the update operation.
   */
  async updateUserConfig(userID, lang, setting) {
    // Validate userID
    if (!userID || userID.length > 19) {
      throw new Error(
        `Invalid User ID: Must be 19 characters or less. Received: ${userID}`
      );
    }
    // Validate lang
    if (!lang || lang.length > 5) {
      throw new Error(
        `Invalid Lang: Must be 5 characters or less. Received: ${lang}`
      );
    }
    // Validate setting
    if (!Array.isArray(setting)) {
      throw new Error(
        `Invalid Setting: Must be an array. Received: ${typeof setting}`
      );
    }

    const settingCsv = setting.join(",");

    this._eventLog.info({
      action: "DB Insert",
      message: "Updating UserConfig",
      user: userID,
      lang: lang,
      setting: setting
    });

    try {
      const [results] = await this._pool.query(
        "INSERT INTO UserConfig (UserID, Lang, Setting) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE Lang = VALUES(Lang), Setting = VALUES(Setting)",
        [userID, lang, settingCsv]
      );
      return results;
    } catch (error) {
      this._eventLog.error(`Error updating config for user ${userID}:`, error);
      throw error;
    }
  }

  /**
   * Retrieves the guild role configuration from the database.
   *
   * @param {snowflake} guildID - The guild ID to retrieve the config for.
   * @returns {array} - The roles array.
   */
  async getGuildConfig(guildID) {
    if (!guildID || guildID.length > 19) {
      throw new Error("Invalid Guild Id");
    }

    try {
      const [results] = await this._pool.query(
        "SELECT Roles FROM GuildConfig WHERE GuildID = ?",
        [guildID]
      );

      if (results.length === 0) {
        return null;
      }

      const rolesCsv = results[0].Roles;
      const rolesArray = rolesCsv ? rolesCsv.split(",") : [];
      return rolesArray;
    } catch (error) {
      this._eventLog.error(
        `Error retrieving config for guild: ${guildID}`,
        error
      );
      return [];
    }
  }

  /**
   * Updates the guild role configuration in the database.
   *
   * @param {snowflake} guildID - The guild ID to update the config for.
   * @param {array} roles - The roles array to set.
   * @returns {object} - The result of the update operation.
   */
  async updateGuildConfig(guildID, roles) {
    if (!guildID || guildID.length > 19) {
      throw new Error("Invalid input for guild Id");
    }

    if (!Array.isArray(roles)) {
      throw new Error("Invalid input for roles. Must be an array.");
    }

    try {
      const rolesCsv = roles.join(","); // Convert role array to CSV
      await this._pool.query(
        "INSERT INTO GuildConfig (GuildID, Roles) VALUES (?, ?) ON DUPLICATE KEY UPDATE Roles = VALUES(Roles)",
        [guildID, rolesCsv]
      );
      this._eventLog.info({
        action: "DB Insert",
        message: "Updated GuildConfig",
        guild: guildID,
        roles: rolesCsv
      });
    } catch (error) {
      this._eventLog.error(
        `Error updating config for guild: ${guildID}`,
        error
      );
      throw error;
    }
  }
}

export default Database;
