import {MailAuthI} from "../../models/mail-auth-model";

require('dotenv').config()
const uuid = require('uuid')
const {mailAuthModel} = require('../../models');
const nodemailer = require('nodemailer')

class mailService {
  public transporter
  
  constructor() {
    this.transporter = nodemailer.createTransport({
      host:process.env.SMTP_HOST,
      port:process.env.SMTP_PORT,
      secure:true,
      auth:{
        user:process.env.SMTP_USER,
        pass:process.env.SMTP_PASSWORD
      }
    })
  }
  async create():Promise<MailAuthI> {
    const url = uuid.v4()
    return await mailAuthModel.create({url})
  }
  
  async sendActivationLink(to, url):Promise<undefined>{
    await this.transporter.sendMail({
      from:process.env.SMTP_USER,
      to,
      subject:`Активация аккаунта на ${process.env.API_URL}`,
      text:'',
      html:
        `
          <div>
            <h1>Для активации перейдите по ссылке</h1>
            <a href="${url}">${url}</a>
          </div>
        `
    })
  }
  
}
export default new mailService()