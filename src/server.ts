import { sequelize } from "./config/db.js";
import app from "./app.js";

const port = process.env.port || 5000;
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("database connected successfully")
        app.listen(port, () => {
            console.log(`server running on port ${port}`)
        })
    } catch (err) {
        console.log(err);
    }
};
startServer();
