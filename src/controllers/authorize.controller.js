import { getConnection } from "../database/connection.js";
import sql from 'mssql';

export const createAuthorize = async (req, res) => {
    let pool;
    try {
        
        pool = await getConnection();
        const respuesta = await pool
            .request()
            .input('IdEmpleado', sql.Int, req.body.IdEmpleado)
            .input('NoDepto', sql.Int, req.body.NoDepto)
            .input('IdPermission', sql.Int, req.body.IdPermission)
            .input('StatusAuthorize', sql.VarChar, 'Pendiente')
            .query('INSERT INTO Authorize (IdEmpleado, NoDepto, IdPermission, StatusAuthorize) VALUES (@IdEmpleado, @NoDepto, @IdPermission, @StatusAuthorize); SELECT SCOPE_IDENTITY() AS IdAuthorize');
        if (respuesta.recordset.length === 0) {
            return res.status(404).json({ message: "No se puede guardar el archivo" });
        }
        console.log(respuesta);
        res.json({
            Id: respuesta.recordset[0].IdAuthorize,
            IdEmpleado: req.body.IdEmpleado,
            NoDepto: req.body.NoDepto,
            IdPermission: req.body.IdPermission,
            StatusAuthorize: 'Pendiente',
        });
    } catch (err) {
        console.error('Error en el servidor');
        res.status(500).json({ error: 'Error al crear el servicio'});
    } finally {
        if (pool) {
            try {
                await pool.close();
            } catch (closeError) {
                console.error('Error al cerrar la conexion a la base de datos:', closeError);
            }
            
        }
    }
}

export const asignarPreceptor = async (req, res) => {
    let pool;
    try {
        pool = await getConnection();
        const respuesta = await pool
            .request()
            .input('NivelDormitorio', sql.VarChar, req.params.Nivel)
            .input('Sexo', sql.VarChar, req.query.Sexo)
            .query('SELECT * FROM Bedroom WHERE NivelDormitorio = @NivelDormitorio AND Sexo = @Sexo')
        if (respuesta.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Dato no encontrado"});
        }
        return res.json(respuesta.recordset[0]);
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).send(error.message);
    }finally {
        if (pool) {
            try {
                await pool.close();
            } catch (closeError) {
                console.error('Error al cerrar la concexion a la base de datos', closeError);
            }
        }
    }
}