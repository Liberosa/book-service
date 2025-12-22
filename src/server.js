import dotenv from 'dotenv'
import {dbConnection} from './config/database.js'
import {syncModels} from './model/index.js'
import app from "./app.js";

dotenv.config();

const port = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await dbConnection();
        await syncModels();
        app.listen(port, () => {
            console.log(`Server started on port ${port}. Press Ctrl+C to stop`)
        })
    } catch (error) {
        console.error("Failed to start server:", error);
    }
};

startServer();