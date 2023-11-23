const {Router} = require('express'); 
const {listUsers, 
        nameSearch,
        listUserByID, 
        addUser, 
        updateUser, 
        deleteUser 
        } = require('../controllers/users');


const router = Router();

// http://localhost:3000/api/v1/users/
router.get('/', listUsers);
router.get('/search/:author', nameSearch);
router.get('/:id', listUserByID);
router.put('/', addUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
