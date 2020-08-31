import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
// handle callbacks on scrypt lib
const scryptAsync = promisify(scrypt);

export class Password {
    //static methods are accessible without creating an instance of the class (no need to call new Password())
    static async toHash(password: string) {
        const salt = randomBytes(8).toString("hex");
        // scrypt returns te Buffer, we need to let TS know about it
        const buf = (await scryptAsync(password, salt, 64)) as Buffer;

        return `${buf.toString("hex")}.${salt}`;
    }

    static async compare(storedPassword: string, providedPassword: string) {
        // retrive stored hash and salt
        const [hash, salt] = storedPassword.split(".");
        //hash provided password with same params as while hashing
        const buf = (await scryptAsync(providedPassword, salt, 64)) as Buffer;
        // return comparation result
        return hash === buf.toString("hex");
    }
}
