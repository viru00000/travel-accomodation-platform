class ExpressError extends Error { 
    constructor(statuscode, message){
    super();
    this.satauscode =statuscode;
    this.message=message;
}
}

module.exports = ExpressError;
