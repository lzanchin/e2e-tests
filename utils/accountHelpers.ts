import crypto from 'crypto'
import fs from 'fs'

import { config as dotenvConfig } from 'dotenv'

dotenvConfig()

const TEST_ACCOUNTS_PATH = 'e2e/utils/auth/testAccounts.json'

const encryptText = (text: string): { encrypted: string; iv: string } => {
	const key = process.env.TEST_ACCOUNTS_KEY

	if (!key) {
		throw new Error('TEST_ACCOUNTS_KEY environment variable not set')
	}

	const iv = crypto.randomBytes(16)
	const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
	const encrypted = cipher.update(text)

	return {
		encrypted: Buffer.concat([encrypted, cipher.final()]).toString('hex'),
		iv: iv.toString('hex'),
	}
}

const decryptText = (encryptedHex: string, ivHex: string): string => {
	const key = process.env.TEST_ACCOUNTS_KEY

	if (!key) {
		throw new Error('Encryption key is not set')
	}

	const iv = Buffer.from(ivHex, 'hex')
	const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
	const encrypted = Buffer.from(encryptedHex, 'hex')
	const decrypted = decipher.update(encrypted)

	return Buffer.concat([decrypted, decipher.final()]).toString()
}

const addAccount = (
	email: string,
	password: string,
	description?: string,
	username?: string,
	userId?: string,
	jsonPath = TEST_ACCOUNTS_PATH
): void => {
	const accounts = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
	const encryptedDetails = encryptText(password)

	fs.writeFileSync(
		jsonPath,
		JSON.stringify(
			{
				...accounts,
				[email]: {
					description: description ?? undefined,
					username: username ?? undefined,
					userId: userId ?? undefined,
					...encryptedDetails,
				},
			},
			null,
			2
		)
	)
}

const getAccount = (
	email: string,
	jsonPath = TEST_ACCOUNTS_PATH
): { email: string; password: string; username: string; userId: string; description: string } => {
	const accounts = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
	const account = accounts[email]

	if (!account) {
		throw new Error(`Account ${email} does not exist`)
	}

	return {
		email,
		password: decryptText(account.encrypted, account.iv),
		username: account.username as string,
		userId: account.userId as string,
		description: account.description as string,
	}
}

export { addAccount, decryptText, encryptText, getAccount }
