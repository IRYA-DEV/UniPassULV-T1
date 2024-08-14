import sql from 'mssql'

const dbSettings = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || 'Trencole',
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_DATABASE || 'UniPassTest',
    options: {
        encrypy: false,
        trustServerCertificate: true,
    }
}

export const getConnection = async () => {
    try {
        const pool = await sql.connect(dbSettings);
        return pool;       
    } catch (error) {
        console.error(error)
    }
};
