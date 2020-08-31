import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
    errors: ValidationError[];

    statusCode = 400;

    constructor(errors: ValidationError[]) {
        super();
        this.errors = errors;

        // only because we extend the built in class
        // The JavaScript prototype property allows you to add new properties to object constructors
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors() {
        return this.errors.map((error) => {
            return { message: error.msg, field: error.param };
        });
    }
}
