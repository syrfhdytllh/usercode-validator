const crypto = require("crypto")

const header = {
    "alg": "HS256",
    "typ": "JWT"
};

const secretKey = '3EK6FD+o0+c7tzBNVfjpMkNDi2yARAAKzQlk8O2IKoxQu4nF7EdAh8s3TwpHwrdWT6R'

const toBase64 = obj => {
    let str = JSON.stringify(obj);
    return Buffer.from(str).toString('base64');
};

const replaceSpecialChars = b64string => {
    return b64string.replace(/[=+/]/g, charToBeReplaced => {
        switch (charToBeReplaced) {
            case '=':
                return '';
            case '+':
                return '-';
            case '/':
                return '_';
        }
    });
};

const createSignature = (jwtB64Header, jwtB64Payload, secret) => {
    // create a HMAC(hash based message authentication code) using sha256 hashing alg
    let signature = crypto.createHmac('sha256', secret);

    // use the update method to hash a string formed from our jwtB64Header a period and
    //jwtB64Payload
    signature.update(jwtB64Header + '.' + jwtB64Payload);

    //signature needs to be converted to base64 to make it usable
    signature = signature.digest('base64');

    //of course we need to clean the base64 string of URL special characters
    signature = replaceSpecialChars(signature);
    return signature
}

const generateJWT = (payload) => {
    let b64Header = toBase64(header);
    let jwtB64Header = replaceSpecialChars(b64Header);
    let b64Payload = toBase64(payload);
    let jwtB64Payload = replaceSpecialChars(b64Payload);
    let signature = createSignature(jwtB64Header, jwtB64Payload, secretKey);
    return jwtB64Header + '.' + jwtB64Payload + '.' + signature;
}

module.exports = { generateJWT }
