import { Router } from 'express';
import registerUser , {loginUser , logoutUser} from '../controllers/user.controller.js';
import upload from "../middlewares/multer.middleware.js"
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { refreshAccessToken } from '../controllers/user.controller.js';
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

router.post("/logout",verifyJWT,logoutUser)
router.post("/login",loginUser)
router.post("/refresh-token" ,refreshAccessToken)
// router.post('/register', (req, res) => {
//     console.log('Test handler triggered');
//     res.send('Test handler response');
// });
// Export the router after all routes are defined




export default router;
// router.post('/register', registerUser);
