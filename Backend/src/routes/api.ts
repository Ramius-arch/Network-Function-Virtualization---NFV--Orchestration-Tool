import express from 'express';
import { allocate, scale } from '../controllers/resourceAllocatorController.js';
import { getAll, add, update } from '../controllers/networkFunctionController.js';
import { deploy, remove } from '../controllers/virtualizationLayerController.js';
import { logMetrics, getMetrics } from '../controllers/monitoringController.js';
import { configure, getState, updateState } from '../controllers/controlPlaneController.js';
import { route, clear } from '../controllers/dataPlaneController.js';
import { wrap, test } from '../controllers/legacyIntegrationController.js';
import { updateVersion, rollbackVersion, patch } from '../controllers/updateMaintenanceController.js';
import { deployRedundant, failover, loadBalance } from '../controllers/redundancyFaultToleranceController.js';

const router = express.Router();

// Resource Allocator Routes
router.post('/resource-allocator/allocate', allocate);
router.post('/resource-allocator/scale', scale);

// Network Function Catalog Routes
router.get('/network-function', getAll);
router.post('/network-function', add);
router.put('/network-function', update);

// Virtualization Layer Routes
router.post('/virtualization-layer/deploy', deploy);
router.post('/virtualization-layer/remove', remove);

// Monitoring Routes
router.post('/monitoring/log', logMetrics);
router.get('/monitoring/metrics/:functionName', getMetrics);

// Control Plane Routes
router.post('/control-plane/configure', configure);
router.get('/control-plane/state/:functionName', getState);
router.put('/control-plane/state', updateState);

// Data Plane Routes
router.post('/data-plane/route', route);
router.post('/data-plane/clear', clear);

// Legacy Integration Routes
router.post('/legacy-integration/wrap', wrap);
router.post('/legacy-integration/test', test);

// Update and Maintenance Routes
router.put('/update-maintenance/version', updateVersion);
router.put('/update-maintenance/rollback', rollbackVersion);
router.put('/update-maintenance/patch', patch);

// Redundancy and Fault Tolerance Routes
router.post('/redundancy/deploy', deployRedundant);
router.post('/redundancy/failover', failover);
router.post('/redundancy/load-balance', loadBalance);

export default router;
