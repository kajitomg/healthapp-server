import { ApiError } from "../../exceptions/api-error";
import { MyTransactionType, TransactionOptionsType } from "../../helpers/transaction";
import { MailAuthI } from "../../models/mail-auth-model";

require('dotenv').config()
const uuid = require('uuid')
const { mailAuthModel } = require('../../models');
const nodemailer = require('nodemailer')
const t: MyTransactionType = require('../../helpers/transaction')

class mailService {
	public transporter

	constructor() {
		this.transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: process.env.SMTP_PORT,
			secure: true,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASSWORD
			}
		})
	}
	async create(options?: TransactionOptionsType): Promise<MailAuthI> {
		const transaction = options?.transaction

		const url = uuid.v4()
		const mailauth = await mailAuthModel.create({ url }, { transaction: transaction.data })
		if (!mailauth) {
			await t.rollback(transaction.data)
			throw ApiError.BadRequest(`Ошибка при создании пользователя`)
		}
		return mailauth

	}

	async sendActivationLink(to: string, url: string, options?: TransactionOptionsType): Promise<void> {
		const transaction = options?.transaction

		try {
			await this.transporter.sendMail({
				from: process.env.SMTP_USER,
				to,
				subject: `Активация аккаунта на ${process.env.API_URL}`,
				transaction: transaction.data,
				text: '',
				html:
					`
							<div>
								<h1>Для активации перейдите по ссылке</h1>
								<a href="${url}">${url}</a>
							</div>
						`
			})
		} catch (error) {
			await t.rollback(transaction.data)
			throw ApiError.BadRequest('Несуществующий email', [error])
		}


	}

}
export default new mailService()