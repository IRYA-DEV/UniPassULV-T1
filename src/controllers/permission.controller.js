import { getConnection } from "../database/connection.js";
import sql from 'mssql';

export const getPermissionsByUser = async (req, res) => {
    const pool = await getConnection();
    const result = await pool
    .request()
    .input('Id', sql.Int, req.params.Id)
    //.query('SELECT * FROM Permission WHERE IdUsuario = @Id');
    .query('SELECT * FROM Permission JOIN TypeExit ON Permission.IdTipoSalida = TypeExit.IdExit JOIN Users ON Permission.IdUsuario = Users.IdUser JOIN Workplaces ON Users.IdTrabajo = Workplaces.IdCentroTrabajo WHERE IdUsuario = @Id');
    res.json(result.recordset);
};

export const getPermission = async (req, res) => {
    console.log(req.params.Id);

    const pool = await getConnection();
    const result = await pool
        .request()
        .input("Id", sql.Int, req.params.Id)
        .query("SELECT * FROM Permission WHERE IdPermission = @Id");

    if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: "Dato no encontrado" });
    }
    return res.json(result.recordset[0]);
};

export const createPermission = async (req, res) => {
    try {
        console.log(req.body);
        const pool = await getConnection();

        // Verifica si el IdUsuario existe en dbo.Users
        const userResult = await pool.request()
            .input('IdUsuario', sql.Int, req.body.IdUsuario)
            .query('SELECT 1 FROM dbo.Users WHERE IdUser = @IdUsuario');

        if (userResult.recordset.length > 0) {
            // Inserta en la tabla Permission
            const result = await pool
                .request()
                .input('FechaSolicitada', sql.DateTime, req.body.FechaSolicitada)
                .input('StatusPermission', sql.VarChar, req.body.StatusPermission)
                .input('FechaSalida', sql.DateTime, req.body.FechaSalida)
                .input('FechaRegreso', sql.DateTime, req.body.FechaRegreso)
                .input('Motivo', sql.VarChar, req.body.Motivo)
                .input('MedioSalida', sql.VarChar, req.body.MedioSalida)
                .input('IdUsuario', sql.Int, req.body.IdUsuario) // Asegúrate de que este es el valor correcto
                .input('IdTipoSalida', sql.Int, req.body.IdTipoSalida)
                .query('INSERT INTO Permission (FechaSolicitada, StatusPermission, FechaSalida, FechaRegreso, Motivo, MedioSalida, IdUsuario, IdTipoSalida) VALUES (@FechaSolicitada, @StatusPermission, @FechaSalida, @FechaRegreso, @Motivo, @MedioSalida, @IdUsuario, @IdTipoSalida); SELECT SCOPE_IDENTITY() AS IdPermission');

            console.log(result);
            res.json({
                Id: result.recordset[0].IdPermission,
                FechaSolicitada: req.body.FechaSolicitada,
                StatusPermission: req.body.StatusPermission,
                FechaSalida: req.body.FechaSalida,
                FechaRegreso: req.body.FechaRegreso,
                Motivo: req.body.Motivo,
                MedioSalida: req.body.MedioSalida,
                IdUsuario: req.body.IdUsuario,
                IdTipoSalida: req.body.IdTipoSalida,
            });
        } else {
            res.status(400).json({ error: 'El IdUsuario no existe en dbo.Users' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear el permiso' });
    }
};

export const cancelpermission = async (req, res) => {
    const pool = await getConnection();
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
};



export const deletePermission = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input("Id", sql.Int, req.params.Id)
        .query("DELETE FROM Permission WHERE IdPermission = @Id");
    
    console.log(result);
    if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: "Dato no encontrado" });
    }
    return res.json({ message: "Dato Eliminado" });
};
