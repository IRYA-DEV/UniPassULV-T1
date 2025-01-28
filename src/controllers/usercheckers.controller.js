import { getConnection } from "../configs/connectionDB.js";
import sql from 'mssql';

export const buscarCheckers = async (req, res) => {
    let pool;
    try {
        pool = await getConnection();
        const result = await pool
            .request()
            .input('CorreoCheck', sql.VarChar, req.params.CorreoEmpleado)
            .input('User', sql.VarChar, 'DEPARTAMENTO')
            .input('Activo', sql.Int, 1)
            .query(`
                SELECT * FROM LoginUniPass 
                WHERE Correo = @CorreoCheck AND TipoUser = @User AND StatusActividad = @Activo
            `);
        
        // Verifica si se encontraron registros
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Dato no encontrado" });
        }
        
        // Devuelve todos los registros encontrados
        return res.json(result.recordset);
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


export const cambiarActividad = async (req, res) => {
    let pool;
    try {
        pool = await getConnection();
        const result = await pool
            .request()
            .input('IdLogin', sql.Int, req.params.IdLogin)
            .input('Actividad', sql.Int, req.body.StatusActividad)
            .input('Credencial', sql.VarChar, req.body.Matricula)
            .query(`UPDATE LoginUniPass SET StatusActividad = @Actividad WHERE IdLogin= @IdLogin AND Matricula = @Credencial`)
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Dato no encontrado" });
        }
        res.json("Dato Actualizado");
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

export const EliminarChecker = async (req, res) => {
    let pool;
    try {
        pool = await getConnection();
        const result = await pool
            .request()
            .input('IdLogin', sql.Int, req.params.IdLogin)
            .query(`DELETE FROM  LoginUniPass WHERE IdLogin = @IdLogin`)
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Dato no encontrado" });
        }
        res.json("Dato Eliminado");
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