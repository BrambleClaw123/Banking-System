const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(`[ERROR] ${err.message}`);
    res.status(statusCode).json({
        status: "error",
        message: err.message || "Lỗi hệ thống nội bộ"
    });
};

module.exports = globalErrorHandler;