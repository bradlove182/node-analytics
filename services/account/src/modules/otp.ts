import { TimeSpan } from "oslo";
import { HMAC } from "oslo/crypto";
import { TOTPController } from "oslo/otp";

class OTPService {
    public static secret: ArrayBuffer;
    public static controller: TOTPController;
    public static expiration: TimeSpan;

    public static async initialize() {
        this.secret = await new HMAC("SHA-1").generateKey();
        this.expiration = new TimeSpan(15, "m");
        this.controller = new TOTPController({
            digits: 6,
            period: this.expiration,
        });
    }

    public static async generate() {
        return this.controller.generate(this.secret);
    }

    public static verify(totp: string) {
        return this.controller.verify(totp, this.secret);
    }
}

export { OTPService };
