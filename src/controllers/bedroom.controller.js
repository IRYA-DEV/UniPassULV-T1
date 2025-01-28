import { getConnection } from "../configs/connectionDB.js";
import sql from 'mssql';

export const getBedroomStudent = async (req, res) => {
    console.log(req.params)
    console.log(req.query)
    let pool;
    try {
        pool = await getConnection();
        const result = await pool
            .request()
            .input('Sexo', sql.VarChar, req.params.Sexo) // Asumiendo que Sexo es VARCHAR en la base de datos
            .input('Nivel', sql.VarChar, req.params.NivelAcademico)
            .query('SELECT * FROM Bedroom WHERE NivelDormitorio = @Nivel AND Sexo = @Sexo');
        res.json(result.recordset[0]);
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).send(error.message);
    } finally {
        if (pool) {
            try {
                await pool.close();
            } catch (closeError) {
                console.error('Error al cerrar la conexión a la base de datos:', closeError);
            }
        }
    }
};
