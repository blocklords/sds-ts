import * as ecies from 'ecies-geth';
import { ethers } from 'ethers-ts';

// Decrypts the cipher text by the user account.
export let decrypt = async function(account: ethers.Wallet, cipher_hex: string): Promise<Buffer> {
    var private_key = Buffer.from(account.privateKey.substring(2), "hex");
    var cipher_text = Buffer.from(cipher_hex.substring(2), "hex")

    var new_plain = await ecies.decrypt(private_key, cipher_text)

    return new_plain;
}