import sql from 'mssql'

const dbSettings = {
    user: process.env.USER ,
    password: process.env.DB_PASSWORD ,
    server: process.env.DB_SERVER ,
    database: process.env.DB_DATABASE,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
      },
    options: {
        encrypy: false,
        trustServerCertificate: true,
    }
}

export const getConnection = async () => {
    console.log(dbSettings)
    try {
        const pool = await sql.connect(dbSettings);
        return pool;       
    } catch (error) {
        console.error(error)
    }
};
