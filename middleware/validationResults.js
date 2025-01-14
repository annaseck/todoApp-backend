import { validationResult } from 'express-validator';

export const validateResults = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()[0].msg
        });
    }
    next();
};