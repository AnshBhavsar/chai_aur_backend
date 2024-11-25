import { Router } from 'express';
import registerUser from '../controllers/user.controller.js';

const router = Router();

// Define routes
router.route('/register').post(registerUser);
// router.post('/register', (req, res) => {
//     console.log('Test handler triggered');
//     res.send('Test handler response');
// });
// Export the router after all routes are defined




export default router;
// router.post('/register', registerUser);
