const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const BASE = BigInt(ALPHABET.length);

function encodeBase62(numStr) {
    let num = BigInt(numStr);
    if (num === 0n) return ALPHABET[0];
    let result = '';
    while (num > 0n) {
        result = ALPHABET[Number(num % BASE)] + result;
        num = num / BASE;
    }
    return result;
}

function decodeBase62(encodedStr) {
    let num = 0n;
    for (let i = 0; i < encodedStr.length; i++) {
        const value = ALPHABET.indexOf(encodedStr[i]);
        if (value === -1) throw new Error('Недопустимый символ Base62');
        num = num * BASE + BigInt(value);
    }
    return num;
}

module.exports = { encodeBase62, decodeBase62 };