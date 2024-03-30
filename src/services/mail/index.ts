import createSlice from "../../helpers/create-slice";
require('dotenv').config()
import {ApiError} from "../../exceptions/api-error";
import {IMailAuth, mailAuthModel} from "../../models/user/mail-auth-model";
import {v4} from 'uuid'
import nodemailer from 'nodemailer'

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
  
  create = createSlice<{
    item:IMailAuth
  }>(async ({options}) => {
    const transaction = options?.transaction
    
    const url = v4()
    const mailauth = await mailAuthModel.create({url}, {transaction: transaction.data})
    if (!mailauth) {
      throw ApiError.BadRequest(`Ошибка при создании пользователя`)
    }
    return {item:mailauth}
    
  })
  
  get = createSlice<{
    item:IMailAuth
  },Pick<IMailAuth, 'id'>>(async ({data,options}) => {
    const transaction = options?.transaction
    
    const url = v4()
    const mailauth = await mailAuthModel.findOne({where:{id:data.id},transaction: transaction.data})
    if (!mailauth) {
      throw ApiError.BadRequest(`Ошибка при поиске авторизации почты`)
    }
    return {item:mailauth}
    
  })
  
  sendActivationLink = createSlice<void,{to: string, url: string}>(async ({data, options}) => {
    const transaction = options?.transaction
    
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to:data.to,
        subject: `Активация аккаунта на ${process.env.API_URL}`,
        transaction: transaction.data,
        text: '',
        html:
          `
							<div>
								<h1>Для активации перейдите по ссылке</h1>
								<a href="${data.url}">${data.url}</a>
							</div>
						`
      })
    } catch (error) {
      throw ApiError.BadRequest('Несуществующий email', [error])
    }
  })
  
  destroy = createSlice<number, Pick<IMailAuth, 'id'>>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const mailauth = await mailAuthModel.destroy({where: data, transaction: transaction.data})
    if (!mailauth) {
      throw ApiError.BadRequest(`Ошибка при удалении пользователя`)
    }
    return 1
    
  })
  
}

export default new mailService()