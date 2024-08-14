import { getConnection } from "../database/connection.js";
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

export const createUser = async (req, res) => {
    let pool;
    try {
        console.log(req.body);
        pool = await getConnection();
        const result = await pool
            .request()
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
            .query('INSERT INTO Users (Matricula ,Contraseña ,Correo ,Nombre ,Telefono ,Celular ,Sexo ,Domicilio ,TipoUser ,IdTutor ,IdTrabajo ) VALUES (@Matricula ,@Contraseña ,@Correo ,@Nombre ,@Telefono ,@Celular ,@Sexo ,@Domicilio ,@TipoUser ,@IdTutor ,@IdTrabajo); SELECT SCOPE_IDENTITY() AS IdUser');
        console.log(result);
        res.json({
            Id: result.recordset[0].Id,
            Matricula: req.body.Matricula,
            Contraseña: req.body.Contraseña,
            Correo: req.body.Correo,
            Nombre: req.body.Nombre,
            Telefono: req.body.Telefono,
            Celular: req.body.Celular,
            Sexo: req.body.Celular,
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

        // Intentar con matrícula y contraseña
        let result = await pool
            .request()
            .input('Matricula', sql.VarChar, Matricula)
            .input('Contraseña', sql.VarChar, Contraseña)
            .query('SELECT * FROM LoginUniPass WHERE Matricula = @Matricula AND Contraseña = @Contraseña');
        if (result.recordset.length > 0) {
            return res.json({ success: true, user: result.recordset[0] });
        }

        // Intentar con correo y contraseña
        result = await pool
            .request()
            .input('Correo', sql.VarChar, Correo)
            .input('Contraseña', sql.VarChar, Contraseña)
            .query('SELECT * FROM LoginUniPass WHERE Correo = @Correo AND Contraseña = @Contraseña');
        if (result.recordset.length > 0) {
            return res.json({ success: true, user: result.recordset[0] });
        }

        res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (pool) pool.close();
    }
};
