exports.asyncHandler = (cb) => {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (error) {
            // Forward error to global error handler
            next(error);
        };
    };
};