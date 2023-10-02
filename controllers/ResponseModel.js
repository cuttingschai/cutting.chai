class ResponseModel {
    constructor(status, message, data = null, error = null) {
      this.status = status;
      this.message = message;
      this.data = data;
      this.error = error;
    }
  }
  
  module.exports = ResponseModel;
  