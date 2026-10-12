import express from 'express';
import { findAllUsers, findUserRequests } from '../services/requestService.js';

const router = express.Router();

// GET /api/users
router.get('/', (req, res) => {
  res.json(findAllUsers());
});

// GET /api/users/:id/requests
router.get('/:id/requests', (req, res) => {
  const requests = findUserRequests(req.params.id);
  res.json(requests);
});

export default router;

