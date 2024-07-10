import express from 'express';
import tutorsRoutes from "./routes/tutor.routes.js";
import usersRoutes from "./routes/user.routes.js";
import permissionRoutes from "./routes/permission.routes.js";
import doctosRoutes from "./routes/doctos.routes.js";

const app = express();

app.use(express.json());

app.use(tutorsRoutes);

app.use(usersRoutes);

app.use(permissionRoutes);

app.use(doctosRoutes);

export default app;
