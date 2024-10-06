export const handleError = (res, statusCode, message) => {
    res.status(statusCode).json({ message });
};