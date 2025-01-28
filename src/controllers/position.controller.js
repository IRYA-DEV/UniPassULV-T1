import { getConnection } from "../configs/connectionDB.js";
import sql from 'mssql';

export const getInfoCargo = async (req, res) => {
    let pool;
    try {
        console.log(req.params.Id)
        pool = await getConnection();
        const result = await pool
            .request()
            .input("Id", sql.VarChar, req.params.Id)
            .query(`SELECT * FROM LoginUniPass INNER JOIN 
                Position ON LoginUniPass.IdCargoDelegado = Position.IdCargo 
                WHERE LoginUniPass.Matricula = @Id`);
            if (result.rowsAffected[0] === 0) {
                return res.json(null);
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
                console.error('Error al cerrar la conexion a la base de datos')
            }
        }
    }
};

export const getInfoDelegado = async (req, res) => {
    let pool;
    try {
        console.log(req.params.Id)
        pool = await getConnection();
        const result = await pool
            .request()
            .input("Id", sql.VarChar, req.params.Id)
            .query(`SELECT * FROM LoginUniPass INNER JOIN 
Position ON LoginUniPass.IdCargoDelegado = Position.IdCargo
WHERE Position.MatriculaEncargado = @Id`);
            if (result.rowsAffected[0] === 0) {
                return res.json(null);
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
                console.error('Error al cerrar la conexion a la base de datos')
            }
        }
    }
};

export const createPosition = async (req, res) => {
    let pool;
    try {
        pool = await getConnection();
        
        // Ejecuta la inserción en la base de datos
        const result = await pool
            .request()
            .input("MatriculaEncargado", sql.VarChar, req.body.MatriculaEncargado)
            .input("ClassUser", sql.VarChar, req.body.ClassUser)
            .input("Asignado", sql.VarChar, req.body.Asignado)
            .input("Activo", sql.Int, 0)
            .query(`INSERT INTO Position (MatriculaEncargado, ClassUser, Asignado, Activo) 
                    VALUES (@MatriculaEncargado, @ClassUser, @Asignado, @Activo);
                    SELECT SCOPE_IDENTITY() AS id;`);

        if (result.rowsAffected[0] > 0) {
            const newId = result.recordset[0].id;

            // Obtener el registro recién creado
            const createdData = await pool
                .request()
                .input("id", sql.Int, newId)
                .query(`SELECT * FROM Position WHERE IdCargo = @id`);

            return res.status(201).json({
                message: "Registro creado exitosamente",
                data: createdData.recordset[0]
            });
        } else {
            return res.status(400).json({ message: "No se pudo crear el registro" });
        }
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).send(error.message);
    } finally {
        if (pool) {
            try {
                await pool.close();
            } catch (closeError) {
                console.error('Error al cerrar la conexion a la base de datos');
            }
        }
    }
};

export const cambiarActivo = async (req, res) => {
    console.log(req.params.Id);
    console.log(req.body.Activo);

    if (!req.params.Id) {
        return res.status(400).json({ message: "El parámetro 'Id' es obligatorio" });
    }

    if (typeof req.body.Activo !== 'number') {
        return res.status(400).json({ message: "El valor de 'Activo' debe ser un número" });
    }

    let pool;
    try {
        pool = await getConnection();
        const result = await pool
            .request()
            .input("Id", sql.VarChar, req.params.Id)
            .input("Activo", sql.Int, req.body.Activo)
            .query(`UPDATE Position SET Activo = @Activo WHERE IdCargo = @Id`);

        if (!result || !result.rowsAffected || result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "No se encontró el IdCargo o no se actualizó" });
        }

        return res.status(200).json({ message: "Estado actualizado exitosamente" });
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
