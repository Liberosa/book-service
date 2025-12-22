import express from 'express'
import mainRouter from "./routes/index.js";

const app = express();

app.use(express.json());
app.use(mainRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({error: 'Something went wrong!', message: err.message});
});

export default app;
