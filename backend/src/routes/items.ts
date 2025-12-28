import { Router } from 'express';
import { authMiddleware } from '../utils/authMiddleware';
import {
  createItem,
  listItems,
  getItem,
  updateItem,
  deleteItem,
  stockIn,
  stockOut,
  lowStock,
} from '../controllers/itemsController';

const router = Router();

router.use(authMiddleware);

router.post('/', createItem);
router.get('/', listItems);
router.get('/low-stock', lowStock);
router.get('/:id', getItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);
router.post('/:id/stock-in', stockIn);
router.post('/:id/stock-out', stockOut);

export default router;
