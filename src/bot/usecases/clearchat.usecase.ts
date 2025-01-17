import { inject, injectable } from 'inversify'
import { LogHandler } from '../../handlers'
import { TYPES } from '../../types'
import { BotComands } from '../interfaces'

@injectable()
export default class BotComandClearChat implements BotComands {
  private logHandler: LogHandler
  constructor(@inject(TYPES.LogHandler) logHandler: LogHandler) {
    this.logHandler = logHandler
  }

  public execute = async (message: any) => {
    try {
      if (!message.member.hasPermission('ADMINISTRATOR')) {
        return message.reply('Não tem permissão para executar esse comando!')
      }

      try {
        message.delete()
        const fetched = await message.channel.fetchMessages({
          limit: 99,
        })
        message.channel
          .bulkDelete(fetched)
          .then(() => {
            message.reply('Efetuada a limpeza do chat!')
          })
          .catch((erro: any) => {
            this.logHandler.log(erro)
          })
      } catch (error) {
        this.logHandler.log(error)
        message.reply('Erro ao tentar limpar chat!')
      }
    } catch (error) {
      this.logHandler.log(`Erro inesperado: ${error}`)
      return message.reply('Erro inesperado')
    }
  }
}
