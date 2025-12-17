import dotenv from 'dotenv'
import {Sequelize} from "sequelize";

dotenv.config();


const sequelize = new Sequelize(
    process.env.DB_NAME || 'test',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false
    });


//test connection
const dbConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to Database established');
    } catch (err) {
        console.log('Unable to connect to the database: ', err);
    }
};

export  {dbConnection,sequelize};