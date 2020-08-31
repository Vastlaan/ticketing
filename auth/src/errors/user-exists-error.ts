import { CustomError } from "./custom-error";

export class UserExistsError extends CustomError {
    statusCode = 409;
    error = "User already exists";
    constructor() {
        super();
        Object.setPrototypeOf(this, UserExistsError.prototype);
    }
    serializeErrors() {
        return [{ message: this.error }];
    }
}
