import pg from 'pg'

const { Pool } = pg

export const pool = new Pool({
  connectionString: process.env.DB_URL
})

pool.on("connect", () => {
  console.log("connected to the Database");

});

export const createTables = async () => {

  const usersTable = ` 
  do $$
  begin
  if not exists (select 1 from pg_type where typname = 'user_status') then
     CREATE TYPE user_status AS ENUM ('Online','Offline');
  end if;
  end $$;

  do $$
  begin
  if not exists (select 1 from pg_type where typname = 'user_roles') then
     CREATE TYPE user_roles AS ENUM ('User','Admin');
  end if;
  end $$;

  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    status user_status,
    role user_roles
  );`

  await pool
    .query(usersTable)
    .then((res: any) => {
      console.log('res', res);
    })
    .catch((err: any) => {
      console.log('err', err);
    });


  const tokenTable = `CREATE TABLE IF NOT EXISTS token (
    token_id SERIAL PRIMARY KEY,
    user_id integer REFERENCES users (id),
    refresh_token VARCHAR(255)
  );`

  await pool
    .query(tokenTable)
    .then((res: any) => {
      console.log(res);
    })
    .catch((err: any) => {
      console.log(err);

    });

  const messagesTable = `
  do $$
  begin
  if not exists (select 1 from pg_type where typname = 'message_status') then
     CREATE TYPE message_status AS ENUM ('sending','sent','read');
  end if;
  end $$;

  CREATE TABLE IF NOT EXISTS messages (
      message_id SERIAL PRIMARY KEY,
      sender_id integer REFERENCES users (id),
      chat_id integer,
      payload VARCHAR(255),
      created_at VARCHAR(255),
      status message_status
    );`

  await pool
    .query(messagesTable)
    .then((res: any) => {
      console.log(res);
    })
    .catch((err: any) => {
      console.log(err);

    });

  const chatsTable = `
  do $$
  begin
  if not exists (select 1 from pg_type where typname = 'chat_types') then
     CREATE TYPE chat_types AS ENUM ('dm','group');
  end if;
  end $$;

  CREATE TABLE IF NOT EXISTS chats (
    chat_id SERIAL PRIMARY KEY,
    last_sent_message_id integer references messages(message_id),
    last_sent_user_id integer references users(id),
    type chat_types
  );`

  await pool
    .query(chatsTable)
    .then((res: any) => {
      console.log(res);
    })
    .catch((err: any) => {
      console.log(err);

    });

  const chatMembersTable = `CREATE TABLE IF NOT EXISTS chat_members (
    user_id integer references users(id),
    chat_id integer references chats(chat_id)
  );`

  await pool
    .query(chatMembersTable)
    .then((res: any) => {
      console.log(res);
    })
    .catch((err: any) => {
      console.log(err);

    });

}; 