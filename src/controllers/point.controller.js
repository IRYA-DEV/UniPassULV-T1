import { getConnection } from "../configs/connectionDB.js";
import sql from 'mssql';

export const getPointsChecks = async (req, res) => {
    let pool;
    try {
        pool = await getConnection();
        const result = await pool
            .request()
            .input('IdSalida', sql.Int, req.params.Id)
            .query('SELECT * FROM Point WHERE IdExit = @IdSalida')
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({error: error.message});
    }finally {
        if (pool) {
            try {
                await pool.close();
            } catch (closeError) {
                console.error('Error al cerrar la conexion a la base de datos:, closeError')
            }
        }
    }
}