import mysql from 'mysql2';

// Create the connection to database
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

    const personTable = `CREATE TABLE IF NOT EXISTS
      person(
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(255) UNIQUE,
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255)
      );`

    pool
        .query(personTable)
        .then((res: any) => {
            console.log('res', res);
        })
        .catch((err: any) => {
            console.log('err', err);
        });


    const tokenTable = `CREATE TABLE IF NOT EXISTS
      token(
        token_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        refresh_token VARCHAR(255),
        FOREIGN KEY (user_id) REFERENCES person(id)
      );`

    pool
        .query(tokenTable)
        .then((res: any) => {
            console.log(res);
        })
        .catch((err: any) => {
            console.log(err);

        });

};

// const func2 = async () => {
//     try {
//         const result =await pool.query("SELECT * FROM person;")
//         console.log(result[0].constructor === Array);

//     } catch (e) {
//         console.log(e);
//     }
// }
// func2()