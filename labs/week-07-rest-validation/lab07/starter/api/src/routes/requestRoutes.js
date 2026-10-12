import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  listRequests,
  getRequest,
  createRequest,
  updateRequestStatus,
  deleteRequest
} from '../controllers/requestController.js';

const router = express.Router();

router.get('/', listRequests);
router.get('/:id', getRequest);
router.post('/', createRequest);
router.put('/:id', updateRequestStatus);
router.delete('/:id', deleteRequest);

export default router;