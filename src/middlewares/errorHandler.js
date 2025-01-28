export const errorHandler = (error, res) => {
    console.error('Error en el servidor:', error);
    res.status(500).send(error.message);
};
