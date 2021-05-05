const AuthRequestService = require("../../services/AuthRequestService");
const ResponseHandler = require("../../utils/ResponseHandler");

const validateDniState = async (req, res) => {
    const operationId = req.body.operationId;
    try {
        const authRequest = await AuthRequestService.getByOperationId(operationId);
        return ResponseHandler.sendRes(res, {
            status: authRequest.status,
            operationId: authRequest.operationId,
            message: authRequest.errorMessage
        });
    } catch (err) {
        return ResponseHandler.sendErr(res, err);
    }
};

module.exports = {
    validateDniState,
}