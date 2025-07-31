export const catchAsyncError = (method) => {
    return (req, res, next) => {
        Promise.resolve(method(req, res, next)).catch(next)
    }
}
