import express from 'express';
import {
  runTest,
  getResults,
  getAnalytics,
  getModels,
  searchModels  // Add this import
} from '../controllers/testController.js';

const router = express.Router();

router.post('/run', runTest);
router.get('/results', getResults);
router.get('/analytics', getAnalytics);
router.get('/models', getModels);
router.get('/search-models', searchModels);  // Add this route

export default router;