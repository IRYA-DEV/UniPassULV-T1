import { getConnection } from "../database/connection.js";
import { hashData, VerifyHashData } from '../util/hashData.js';
import sql from 'mssql';

export const getUsers = async (req, res) => {
    let pool;
    try {
        pool = await getConnection();
        const result = await pool.request().query('SELECT * FROM Users');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (pool) pool.close();
    }
};

export const getUser = async (req, res) => {
    let pool;
    try {
        console.log(req.params.Id);
        pool = await getConnection();
        const result = await pool
            .request()
            .input("Id", sql.Int, req.params.Id)
            .query("SELECT * FROM LoginUniPass WHERE IdLogin = @Id");
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Dato no encontrado" });
        }
        return res.json(result.recordset[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (pool) pool.close();
    }
};

export const endCargo = async (req, res) => {
    let pool;
    try {
        pool = await getConnection();

        // Obtener el IdCargoDelegado relacionado
        const getIdCargoResult = await pool
            .request()
            .input("Matricula", sql.VarChar, req.params.Matricula)
            .query(`SELECT IdCargoDelegado FROM LoginUniPass WHERE Matricula = @Matricula`);

        if (getIdCargoResult.recordset.length === 0) {
            return res.status(404).json({ message: "Matrícula no encontrada" });
        }

        const idCargoDelegado = getIdCargoResult.recordset[0].IdCargoDelegado;

        // Verificar si IdCargoDelegado tiene un valor válido
        if (!idCargoDelegado) {
            return res.status(400).json({ message: "El registro no tiene un IdCargoDelegado válido" });
        }

        // Actualizar el IdCargoDelegado a NULL
        await pool
            .request()
            .input("Matricula", sql.VarChar, req.params.Matricula)
            .query(`UPDATE LoginUniPass SET IdCargoDelegado = NULL WHERE Matricula = @Matricula`);

        // Eliminar el registro en la tabla Position
        const deleteResult = await pool
            .request()
            .input("IdCargo", sql.VarChar, idCargoDelegado.toString())
            .query(`DELETE FROM Position WHERE IdCargo = @IdCargo`);

        if (deleteResult.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "No se encontró un registro en Position con el IdCargo relacionado" });
        }

        return res.status(200).json({ message: "Estado actualizado y registro eliminado exitosamente" });
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).send(error.message);
    } finally {
        if (pool) {
            try {
                await pool.close();
            } catch (closeError) {
                console.error('Error al cerrar la conexión a la base de datos');
            }
        }
    }
};

export const updateCargo = async (req, res) => {
    let pool;
    try {
        pool = await getConnection();
        const result = await pool
            .request()
            .input("Matricula", sql.VarChar, req.params.Matricula)
            .input("Delegado", sql.Int, req.body.IdCargoDelegado)
            .query(`UPDATE LoginUniPass SET IdCargoDelegado = @Delegado WHERE Matricula = @Matricula`);

        if (result.rowsAffected[0] > 0) {
            return res.status(200).json({ message: "Estado actualizado exitosamente" });
        } else {
            return res.status(404).json({ message: "Registro no encontrado" });
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
}


export const createUser = async (req, res) => {
    let pool;
    try {
        console.log(req.body);

        // Encripta la contraseña antes de enviarla a la base de datos
        const hashedPassword = await hashData(req.body.Contraseña);

        pool = await getConnection();
        const result = await pool
            .request()
            .input('Matricula', sql.VarChar, req.body.Matricula)
            .input('Contraseña', sql.VarChar, hashedPassword) // Usa la contraseña encriptada
            .input('Correo', sql.VarChar, req.body.Correo)
            .input('Nombre', sql.VarChar, req.body.Nombre)
            .input('Telefono', sql.VarChar, req.body.Telefono)
            .input('Celular', sql.VarChar, req.body.Celular)
            .input('Sexo', sql.VarChar, req.body.Sexo)
            .input('Domicilio', sql.VarChar, req.body.Domicilio)
            .input('TipoUser', sql.VarChar, req.body.TipoUser)
            .input('IdTutor', sql.Int, req.body.IdTutor)
            .input('IdTrabajo', sql.Int, req.body.IdTrabajo)
            .query(
                'INSERT INTO Users (Matricula, Contraseña, Correo, Nombre, Telefono, Celular, Sexo, Domicilio, TipoUser, IdTutor, IdTrabajo) ' +
                'VALUES (@Matricula, @Contraseña, @Correo, @Nombre, @Telefono, @Celular, @Sexo, @Domicilio, @TipoUser, @IdTutor, @IdTrabajo); ' +
                'SELECT SCOPE_IDENTITY() AS IdUser'
            );

        console.log(result);

        res.json({
            Id: result.recordset[0].Id,
            Matricula: req.body.Matricula,
            Correo: req.body.Correo,
            Nombre: req.body.Nombre,
            Telefono: req.body.Telefono,
            Celular: req.body.Celular,
            Sexo: req.body.Sexo,
            Domicilio: req.body.Domicilio,
            TipoUser: req.body.TipoUser,
            IdTutor: req.body.IdTutor,
            IdTrabajo: req.body.IdTrabajo,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (pool) pool.close();
    }
};


export const updateUser = async (req, res) => {
    let pool;
    try {
        pool = await getConnection();
        const result = await pool
            .request()
            .input("Id", sql.Int, req.params.Id)
            .input('Matricula', sql.VarChar, req.body.Matricula)
            .input('Contraseña', sql.VarChar, req.body.Contraseña)
            .input('Correo', sql.VarChar, req.body.Correo)
            .input('Nombre', sql.VarChar, req.body.Nombre)
            .input('Telefono', sql.VarChar, req.body.Telefono)
            .input('Celular', sql.VarChar, req.body.Celular)
            .input('Sexo', sql.VarChar, req.body.Sexo)
            .input('Domicilio', sql.VarChar, req.body.Domicilio)
            .input('TipoUser', sql.VarChar, req.body.TipoUser)
            .input('IdTutor', sql.Int, req.body.IdTutor)
            .input('IdTrabajo', sql.Int, req.body.IdTrabajo)
            .query("UPDATE Tutors SET Matricula = @Matricula, Contraseña = @Contraseña, Correo = @Correo, Nombre = @Nombre, Telefono = @Telefono, Celular = @Celular, Domicilio = @Domicilio, TipoUser = @TipoUser, IdTutor = @IdTutor, IdTrabajo = @IdTrabajo WHERE IdUser = @Id");
        console.log(result);
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Dato no encontrado" });
        }
        res.json("Dato Actulizado");
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (pool) pool.close();
    }
};

export const deleteUser = async (req, res) => {
    let pool;
    try {
        pool = await getConnection();
        const result = await pool
            .request()
            .input("Id", sql.Int, req.params.Id)
            .query("DELETE FROM Users WHERE IdUser = @Id");
        console.log(result);
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Dato no encontrado" });
        }
        return res.json({ message: "Dato Eliminado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (pool) pool.close();
    }
};

export const loginUser = async (req, res) => {
    let pool;
    try {
        const { Matricula, Contraseña, Correo } = req.body;
        console.log(req.body);
        pool = await getConnection();

        let result;

        // Intentar con matrícula
        if (Matricula) {
            result = await pool
                .request()
                .input('Matricula', sql.VarChar, Matricula)
                .query('SELECT * FROM LoginUniPass WHERE Matricula = @Matricula');
        } 
        // Intentar con correo
        else if (Correo) {
            result = await pool
                .request()
                .input('Correo', sql.VarChar, Correo)
                .query('SELECT * FROM LoginUniPass WHERE Correo = @Correo');
        } else {
            return res.status(400).json({ success: false, message: 'Debe proporcionar matrícula o correo' });
        }

        // Verificar si se encontró un usuario
        if (result.recordset.length === 0) {
            return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }

        const user = result.recordset[0];

        // Comparar la contraseña ingresada con el hash almacenado
        const isPasswordValid = await VerifyHashData(Contraseña, user.Contraseña);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }

        // Contraseña válida, enviar respuesta exitosa
        return res.json({ success: true, user });

    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (pool) pool.close();
    }
};

export const putPassword = async (req, res) => {
    let pool;
    try {
        const { Correo } = req.params; // Correo del usuario
        const { NewPassword } = req.body; // Nueva contraseña enviada en la petición

        // Hashear la nueva contraseña
        const hashedPassword = await hashData(NewPassword);

        pool = await getConnection();
        const result = await pool
            .request()
            .input('Correo', sql.VarChar, Correo)
            .input('Password', sql.VarChar, hashedPassword) // Contraseña hasheada
            .input('TipoUser', sql.VarChar, "DEPARTAMENTO")
            .query('UPDATE LoginUniPass SET Contraseña = @Password WHERE Correo = @Correo AND TipoUser != @TipoUser');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Contraseña no actualizada" });
        }

        res.json({ message: "Contraseña actualizada correctamente" });
    } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
        res.status(500).json({ error: 'Error al actualizar la contraseña' });
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


export const BuscarUserMatricula = async (req, res) => {
    let pool;
    try {
        console.log(req.params.Matricula);
        pool = await getConnection();
        const result = await pool
            .request()
            .input("Matricula", sql.VarChar, req.params.Matricula)
            .query("SELECT * FROM LoginUniPass WHERE Matricula = @Matricula");
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Dato no encontrado" });
        }
        return res.json(result.recordset[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (pool) pool.close();
    }
};

export const getBuscarCheckers = async (req, res) => {
    let pool;
    try {
        console.log(req.params.EmailAsignador)
        pool = await getConnection();
        const result = await pool
            .request()
            .input("EmailEncargado", sql.VarChar, req.params.EmailAsignador)
            .query(`SELECT * FROM LoginUniPass WHERE TipoUser = 'DEPARTAMENTO' AND Correo = @EmailEncargado`)
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({message: "No hay datos registrados"})
        }
        return res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: error.message});
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

export const buscarPersona = async (req, res) => {
    let pool;
    try {
        pool = await getConnection();
        const result = await pool
            .request()
            .input('Nombre', sql.VarChar, req.params.Nombre)
            .query(`SELECT 
                lp.*, 
                CASE 
                    WHEN p.MatriculaEncargado IS NOT NULL THEN 'Existe en Position' 
                    ELSE 'No existe en Position' 
                END AS ExisteEnPosition
            FROM 
                LoginUniPass AS lp
            LEFT JOIN 
                Position AS p ON lp.Matricula = p.Asignado
            WHERE 
                (lp.Nombre = @Nombre OR lp.Apellidos = @Nombre)
                `);
        
        if (result.rowsAffected[0] === 0) {
            // Retornar un null explícito si no hay registros
            return res.status(404).json(null);
        }

        return res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: error.message });
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


