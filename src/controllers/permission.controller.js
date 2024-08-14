import { getConnection } from "../database/connection.js";
import sql from 'mssql';

export const getPermissionsByUser = async (req, res) => {
    let pool;
    try {
        pool = await getConnection();
        const result = await pool
            .request()
            .input('Id', sql.Int, req.params.Id)
            .query('SELECT * FROM Permission JOIN TypeExit ON Permission.IdTipoSalida = TypeExit.IdTypeExit JOIN LoginUniPass ON Permission.IdUser = LoginUniPass.IdLogin WHERE IdLogin = @Id');
        res.json(result.recordset);
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

export const getPermission = async (req, res) => {
    let pool;
    try {
        console.log(req.params.Id);
        pool = await getConnection();
        const result = await pool
            .request()
            .input("Id", sql.Int, req.params.Id)
            .query("SELECT * FROM Permission WHERE IdPermission = @Id");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Dato no encontrado" });
        }
        return res.json(result.recordset[0]);
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

export const createPermission = async (req, res) => {
    let pool;
    try {
        console.log(req.body);
        pool = await getConnection();

        // Verifica si el IdUsuario existe en dbo.Users
        const userResult = await pool.request()
            .input('IdUser', sql.Int, req.body.IdUser)
            .query('SELECT 1 FROM dbo.LoginUniPass WHERE IdLogin = @IdUser');

        if (userResult.recordset.length > 0) {
            // Inserta en la tabla Permission
            const result = await pool
                .request()
                .input('FechaSolicitada', sql.DateTime, req.body.FechaSolicitada)
                .input('StatusPermission', sql.VarChar, req.body.StatusPermission)
                .input('FechaSalida', sql.DateTime, req.body.FechaSalida)
                .input('FechaRegreso', sql.DateTime, req.body.FechaRegreso)
                .input('Motivo', sql.VarChar, req.body.Motivo)
                .input('IdUser', sql.Int, req.body.IdUser)
                .input('IdTipoSalida', sql.Int, req.body.IdTipoSalida)
                .input('Observaciones', sql.VarChar, 'Ninguna')
                .query('INSERT INTO Permission (FechaSolicitada, StatusPermission, FechaSalida, FechaRegreso, Motivo, IdUser, IdTipoSalida, Observaciones) VALUES (@FechaSolicitada, @StatusPermission, @FechaSalida, @FechaRegreso, @Motivo, @IdUser, @IdTipoSalida, @Observaciones); SELECT SCOPE_IDENTITY() AS IdPermission');

            console.log(result);
            res.json({
                Id: result.recordset[0].IdPermission,
                FechaSolicitada: req.body.FechaSolicitada,
                StatusPermission: req.body.StatusPermission,
                FechaSalida: req.body.FechaSalida,
                FechaRegreso: req.body.FechaRegreso,
                Motivo: req.body.Motivo,
                MedioSalida: req.body.MedioSalida,
                IdUser: req.body.IdUser,
                IdTipoSalida: req.body.IdTipoSalida,
            });
        } else {
            res.status(400).json({ error: 'El IdUsuario no existe en dbo.Users' });
        }
    } catch (err) {
        console.error('Error en el servidor:', err);
        res.status(500).json({ error: 'Error al crear el permiso' });
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

export const cancelPermission = async (req, res) => {
    let pool;
    try {
        pool = await getConnection();
        const result = await pool
            .request()
            .input("Id", sql.Int, req.params.Id)
            .input("StatusPermission", sql.VarChar, "Cancelado")
            .query("UPDATE Permission SET StatusPermission = @StatusPermission WHERE IdPermission = @Id");

        console.log(result);
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

export const deletePermission = async (req, res) => {
    let pool;
    try {
        pool = await getConnection();
        const result = await pool.request()
            .input("Id", sql.Int, req.params.Id)
            .query("DELETE FROM Permission WHERE IdPermission = @Id");

        console.log(result);
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Dato no encontrado" });
        }
        return res.json({ message: "Dato Eliminado" });
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

export const getPermissionForAutorizacion = async (req, res) => {
    let pool;
    try {
        pool = await getConnection();
        const result = await pool.request()
            .input("Id", sql.Int, req.params.Id)
            .query("SELECT Permission.*, TypeExit.*, LoginUniPass.* FROM Permission INNER JOIN Authorize ON Permission.IdPermission = Authorize.IdPermission JOIN TypeExit ON Permission.IdTipoSalida = TypeExit.IdTypeExit JOIN LoginUniPass ON Permission.IdUser = LoginUniPass.IdLogin WHERE Authorize.IdEmpleado = @Id")

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
};
