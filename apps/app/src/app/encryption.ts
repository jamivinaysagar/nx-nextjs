import * as CryptoJS from 'crypto-js'

const PASSPHRASE = 'kKvVmtV08uxx4R3o'

class AesEncryption {
  _keySize = 256
  _ivSize = 128
  _iterationCount = 1989

  generateKey(salt: string, passPhrase: string) {
    return CryptoJS.PBKDF2(passPhrase, CryptoJS.enc.Hex.parse(salt), {
      keySize: this._keySize / 32,
      iterations: this._iterationCount
    })
  }

  encryptWithIvSalt(
    salt: string,
    iv: string,
    passPhrase: string,
    plainText: string
  ) {
    const key = this.generateKey(salt, passPhrase)
    const encrypted = CryptoJS.AES.encrypt(plainText, key, {
      iv: CryptoJS.enc.Hex.parse(iv)
    })
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64)
  }

  decryptWithIvSalt(salt, iv, passPhrase, cipherText) {
    const key = this.generateKey(salt, passPhrase)
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(cipherText)
    })
    const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
      iv: CryptoJS.enc.Hex.parse(iv)
    })
    return decrypted.toString(CryptoJS.enc.Utf8)
  }

  encrypt(passPhrase: string, plainText: string) {
    const iv = CryptoJS.lib.WordArray.random(this._ivSize / 8).toString(
      CryptoJS.enc.Hex
    )
    const salt = CryptoJS.lib.WordArray.random(this._keySize / 8).toString(
      CryptoJS.enc.Hex
    )
    const cipherText = this.encryptWithIvSalt(salt, iv, passPhrase, plainText)
    return salt + iv + cipherText
  }

  decrypt(passPhrase: string, cipherText: string) {
    const ivLength = this._ivSize / 4
    const saltLength = this._keySize / 4
    const salt = cipherText.substr(0, saltLength)
    const iv = cipherText.substr(saltLength, ivLength)
    const encrypted = cipherText.substring(ivLength + saltLength)
    const decrypted = this.decryptWithIvSalt(salt, iv, passPhrase, encrypted)
    return decrypted
  }

  get keySize() {
    return this._keySize
  }

  set keySize(value) {
    this._keySize = value
  }

  get iterationCount() {
    return this._iterationCount
  }

  set iterationCount(value) {
    this._iterationCount = value
  }
}

export const encryptPasswordPBE = (PASS: string) => {
  const password = CryptoJS.enc.Utf8.parse(PASS)
  const salt = CryptoJS.enc.Hex.parse('RANDOMSALT')
  const iterations = 31

  // PBE according to PKCS#5 v1.5 (in other words: PBKDF1)
  const md5 = CryptoJS.algo.MD5.create()
  md5.update(password)
  md5.update(salt)
  let result = md5.finalize()
  md5.reset()
  for (let i = 1; i < iterations; i++) {
    md5.update(result)
    result = md5.finalize()
    md5.reset()
  }

  // splitting key and IV
  // var key = CryptoJS.lib.WordArray.create(result.words.slice(0, 2));
  // var iv = CryptoJS.lib.WordArray.create(result.words.slice(2, 4));
  const key = CryptoJS.enc.Hex.parse(
    CryptoJS.SHA1(password).toString().substring(0, 32)
  )
  const iv = CryptoJS.lib.WordArray.random(128 / 8)

  const encrypted = CryptoJS.AES.encrypt(PASS, key, {
    iv: iv
  })

  return encrypted.toString()
  // return iv.concat(encrypted.ciphertext).toString()
}

// function encrypt(plaintext, password){
//   var ct = CryptoJS.AES.encrypt(plaintext, key, { iv: iv });
//   return iv.concat(ct.ciphertext).toString();
// }

export const encryptPassword = (password: string) => {
  const aes = new AesEncryption()
  return aes.encrypt(PASSPHRASE, password).toString()
}

export const decryptPassword = (password: string) => {
  const aes = new AesEncryption()
  return aes.decrypt(PASSPHRASE, password).toString()
}

export default AesEncryption
