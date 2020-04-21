export const constraints = {
    email: {
        presence: true,
        email: true
    },
    username: {
        presence: true,
        length: {
            minimum: 8,
            maximum: 16
        },
        format: {
            pattern: /^[a-z0-9_]{1,100}$/i,
            message: "can only contain a-z, A-Z, 0-9 and _"
        }
    },
    password: {
        presence: true,
        length: {
            minimum: 6,
            maximun: 20
        },
        format: {
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/,
            message: "should at least contain a capital letter, a lowercase letter and a number"
        }
    },
    confirmPassword: {
        presence: true,
        equality: {
            attribute: "password",
            message: "^Two passwords do not match"
        }
    },
    //Add simple phone number validation - DY 4/14/2020
    phoneNumber: {
        format: {
            pattern: /^[^a-wA-WyzYZ]{10,}$/,
            message: "must not contain letters, except 'x' for extensions. Include area code, and if outside US, also country code"
        }
    },
    firstName: {
        presence: true
    },
    lastName:{
        presence: true
    },
    userType: {
        presence: true
    }
};