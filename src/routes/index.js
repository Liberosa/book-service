import express from 'express';
import bookRouter from './book.routes.js';
import authorRouter from './author.routes.js';
import publisherRouter from './publisher.routes.js';

const router = express.Router();

router.use(bookRouter);
router.use(authorRouter);
router.use(publisherRouter);

export default router;
