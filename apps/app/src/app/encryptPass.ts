import { encryptPassword } from './encryption'

console.log(`Encrypting ${process.argv[2]}`)
console.log(encryptPassword(process.argv[2]))
