import express from 'express';
import { injectCtrl } from '../../controllers/inject';

const inject = express.Router();

inject.post('/', injectCtrl);

export default inject;
