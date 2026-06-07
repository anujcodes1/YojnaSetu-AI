class ApiResponse {
  constructor(success, message, data = null, meta = null) {
    this.success = success;
    this.message = message;
    if (data !== null) this.data = data;
    if (meta !== null) this.meta = meta;
  }

  static ok(res, message, data = null, meta = null) {
    return res.status(200).json(new ApiResponse(true, message, data, meta));
  }

  static created(res, message, data = null) {
    return res.status(201).json(new ApiResponse(true, message, data));
  }

  static error(res, statusCode, message) {
    return res.status(statusCode).json(new ApiResponse(false, message));
  }
}

module.exports = ApiResponse;
