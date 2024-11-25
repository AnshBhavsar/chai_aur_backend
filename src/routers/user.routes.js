import { Router } from 'express';
import registerUser from '../controllers/user.controller.js';
import upload from "../middlewares/multer.middleware.js"
const router = Router();

// Define routes
router.route('/register').post(
    upload.fields([
        {
            name : "avatar",
            maxCount : 1
        },
        {
            name : "coverImage",
            maxCount : 1
        }
    ])
    ,registerUser);
// router.post('/register', (req, res) => {
//     console.log('Test handler triggered');
//     res.send('Test handler response');
// });
// Export the router after all routes are defined




export default router;
// router.post('/register', registerUser);
