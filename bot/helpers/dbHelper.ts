import { Connection, createConnection } from "mysql";

export const connectToMySql = async () => {
  const connection = createConnection({
    host: process.env.MYSQL_HOST,
    port: +process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER_ID,
    password: process.env.MYSQL_USER_PASSWORD,
    database: process.env.MYSQL_DB,
  });
  return new Promise<Connection>((resolve, reject) => {
    connection.connect((error) => {
      if (error) {
        reject(error);
      } else {
        resolve(connection);
      }
    });
  });
};

export const setApiKey = async (fromId: string, apiKey: string) => {
  const conn = await connectToMySql();
  return new Promise((resolve, reject) => {
    conn.query(
      "INSERT INTO user_api_key (user_id, api_key) VALUES(?, ?) ON DUPLICATE KEY UPDATE api_key=?",
      [fromId, apiKey, apiKey],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
};

export const deleteApiKey = async (fromId: string) => {
  const conn = await connectToMySql();
  return new Promise((resolve, reject) => {
    conn.query(
      "DELETE FROM user_api_key WHERE user_id = ?",
      [fromId],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
};

export const getApiKey = async (fromId: string) => {
  const conn = await connectToMySql();
  return new Promise<{ api_key: string }[]>((resolve, reject) => {
    conn.query(
      "SELECT api_key FROM user_api_key WHERE user_id = ?",
      [fromId],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
};

export const clearChatHistory = async (
  fromId: string,
  conversionId: string
) => {
  const conn = await connectToMySql();
  return new Promise<string[]>((resolve, reject) => {
    conn.query(
      "DELETE FROM user_chat_history WHERE user_id = ? AND conversion_id = ?",
      [fromId, conversionId],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
};

export const getChatHistory = async (fromId: string, conversionId: string, model = 'text-davinci-003') => {
  const conn = await connectToMySql();
  return new Promise<string[]>((resolve, reject) => {
    conn.query(
      "SELECT message FROM user_chat_history WHERE user_id = ? AND conversion_id = ? AND ai_model = ? ORDER BY id DESC LIMIT 20",
      [fromId, conversionId, model],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(
            (results as { message: string }[]).reverse().map((r) => r.message)
          );
        }
      }
    );
  });
};

export const addChatHistory = async (
  fromId: string,
  conversionId: string,
  message: string,
  model = 'text-davinci-003'
) => {
  const conn = await connectToMySql();
  return new Promise<string[]>((resolve, reject) => {
    conn.query(
      "INSERT INTO user_chat_history(user_id, conversion_id, ai_model, message) VALUES(?, ?, ?, ?)",
      [fromId, conversionId, model, message],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
};
