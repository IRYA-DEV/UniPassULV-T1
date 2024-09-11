import { getConnection } from "../database/connection.js";
import sql from 'mssql';

export const createChecksPermission = async (req, res) => {
    let pool;
    try {
        pool = await getConnection();
        const result = await pool
            .request()
            //.input('FechaCheck', sql.DateTime, req.body.FechaCheck)
            .input('StatusCheck', sql.VarChar, 'Pendiente')
            .input('Accion', sql.VarChar, req.body.Accion)
            .input('IdPoint', sql.Int, req.body.IdPoint)
            .input('IdPermission', sql.Int, req.body.IdPermission)
            .input('Observaciones', sql.VarChar, 'Ninguna')
            .query('INSERT INTO CheckPoints (Estatus, Accion, IdPoint, IdPermission) VALUES (@StatusCheck, @Accion, @IdPoint, @IdPermission); SELECT SCOPE_IDENTITY() AS IdCheck;')

        console.log(result);
        res.json({
            Id: result.recordset[0].IdCheck,
            //FechaCheck: req.body.FechaCheck,
            StatusCheck: 'Pendiente',
            Accion: req.body.Accion,
            IdPoint: req.body.IdPoint,
            IdPermission: req.body.IdPermission,
            Observaciones: 'Ninguna'
        })
    } catch (error) {
        console.error('Error en el servidor');
        res.status(500).json({error: 'Error al crear el servico'})
    } finally {
        if(pool){
            try {
                await pool.close();
            } catch (closeError) {
                console.error('Error al cerrar la conexion a la base de datos:, closeError')
            }
        }
    }
}

export const getChecksDormitorio = async (req, res) => {
    let pool;
    try {
        pool = await getConnection()
        const result = await pool
            .request()
            .input('StatusPermission', sql.VarChar, 'Aprobada')
            .input('PuntoName', sql.VarChar, 'Dormitorio')
            .input('Dormitorio', sql.Int, req.params.Id)
            .query('SELECT Permission.*, TypeExit.*, LoginUniPass.*, CheckPoints.*, Point.* FROM Permission JOIN TypeExit ON Permission.IdTipoSalida = TypeExit.IdTypeExit JOIN LoginUniPass ON Permission.IdUser = LoginUniPass.IdLogin JOIN CheckPoints ON Permission.IdPermission = CheckPoints.IdPermission JOIN Point ON CheckPoints.IdPoint = Point.IdPoint WHERE Permission.StatusPermission = @StatusPermission AND Point.NombrePunto = @PuntoName AND LoginUniPass.Dormitorio = @Dormitorio')
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Dato no encontrado" });
        }
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
}

export const getChecksVigilancia = async (req, res) => {
    let pool;
    try {
        pool = await getConnection()
        const result = await pool
            .request()
            .input('StatusPermission', sql.VarChar, 'Aprobada')
            .input('PuntoName', sql.VarChar, 'Caseta')
            .input('CheckEstado', sql.VarChar, 'Pendiente')
            .query('SELECT Permission.*, TypeExit.*, LoginUniPass.*, CheckPoints.*, Point.* FROM Permission JOIN TypeExit ON Permission.IdTipoSalida = TypeExit.IdTypeExit JOIN LoginUniPass ON Permission.IdUser = LoginUniPass.IdLogin JOIN CheckPoints ON Permission.IdPermission = CheckPoints.IdPermission JOIN Point ON CheckPoints.IdPoint = Point.IdPoint WHERE Permission.StatusPermission = @StatusPermission AND Point.NombrePunto = @PuntoName and CheckPoints.Estatus = @CheckEstado')
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Dato no encontrado" });
        }
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
}

// Controlador para actualizar el estado y la fecha/hora de un CheckPoint
export const putCheckPoint = async (req, res) => {
    let pool;
    try {
        const { id } = req.params; // El ID del checkpoint a actualizar
        const { FechaCheck, Estatus } = req.body; // Los datos enviados en la petición
        
        pool = await getConnection();
        const result = await pool
            .request()
            .input('IdCheck', sql.Int, id)
            .input('FechaCheck', sql.DateTime, FechaCheck) // La fecha y hora que quieres asignar
            .input('Estatus', sql.VarChar, Estatus) // El nuevo estado
            .query('UPDATE CheckPoints SET FechaCheck = @FechaCheck, Estatus = @Estatus WHERE IdCheck = @IdCheck');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "CheckPoint no encontrado" });
        }

        res.json({ message: "CheckPoint actualizado correctamente" });
    } catch (error) {
        console.error('Error al actualizar el CheckPoint:', error);
        res.status(500).json({ error: 'Error al actualizar el CheckPoint' });
    } finally {
        if (pool) {
            try {
                await pool.close();
            } catch (closeError) {
                console.error('Error al cerrar la conexión a la base de datos:', closeError);
            }
        }
    }
}

