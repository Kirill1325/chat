import mysql from 'mysql2';

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD
}).promise();

pool.on('connection', () => {
  console.log('connected to the Database')
})

export const createTables = () => {

  const usersTable = ` CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    status ENUM('Online','Offline'),
    role ENUM('User','Admin')
  );`

  pool
    .query(usersTable)
    .then((res: any) => {
      console.log('res', res);
    })
    .catch((err: any) => {
      console.log('err', err);
    });


  const tokenTable = `CREATE TABLE IF NOT EXISTS token (
    token_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user_id INTEGER,
    refresh_token VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );`

  pool
    .query(tokenTable)
    .then((res: any) => {
      console.log(res);
    })
    .catch((err: any) => {
      console.log(err);

    });

  const messagesTable = `CREATE TABLE IF NOT EXISTS messages (
    message_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    sender_id INTEGER,
    chat_id INTEGER,
    payload VARCHAR(255),
    created_at VARCHAR(255),
    status ENUM('sending','sent','read'),
    FOREIGN KEY (sender_id) REFERENCES users(id)
  );`

  pool
    .query(messagesTable)
    .then((res: any) => {
      console.log(res);
    })
    .catch((err: any) => {
      console.log(err);

    });

  const chatsTable = `CREATE TABLE IF NOT EXISTS chats (
    chat_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    last_sent_message_id INTEGER,
    last_sent_user_id INTEGER,
    FOREIGN KEY (last_sent_message_id) REFERENCES messages(message_id),
    FOREIGN KEY (last_sent_user_id) REFERENCES users(id)
  );`

  pool
    .query(chatsTable)
    .then((res: any) => {
      console.log(res);
    })
    .catch((err: any) => {
      console.log(err);

    });

  const chatMembersTable = `CREATE TABLE IF NOT EXISTS chat_members (
    user_id INTEGER,
    chat_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (chat_id) REFERENCES chats(chat_id)
  );`

  pool
    .query(chatMembersTable)
    .then((res: any) => {
      console.log(res);
    })
    .catch((err: any) => {
      console.log(err);

    });

};
// 