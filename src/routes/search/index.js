import express from 'express';
import { searchCtrl } from '../../controllers/search';

const search = express.Router();

search.post('/', searchCtrl);

export default search;
