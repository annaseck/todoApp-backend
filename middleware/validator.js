import { check } from "express-validator";

export const registerRules = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    check('age', 'Please enter a valid age').isInt()
];

export const loginRules = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
];

export const updateDetailsRules = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('age', 'Please enter a valid age').isInt()
];

export const updatePasswordRules = [
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    check('newPassword', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
];

export const createTodoRules = [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty()
];

export const updateTodoRules = [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('completed', 'Completed is required').isBoolean()
];