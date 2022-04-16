import { Message } from 'discord.js'
import { inject, injectable } from 'inversify'
import { LogHandler } from '../../handlers'
import { TYPES } from '../../types'

@injectable()
export default class BotComandListarMusicas implements BotComands {
  private logHandler: LogHandler
  private songQueue: Map<any, any>
  constructor(
    @inject(TYPES.LogHandler) logHandler: LogHandler,
    @inject(TYPES.SongQueue) songQueue: Map<any, any>,
  ) {
    this.logHandler = logHandler
    this.songQueue = songQueue
  }

  /**
   *
   * @param {*} message
   * @returns
   */
  public execute = async (message: Message) => {
    try {
      const serverQueue = this.songQueue.get(message.guild.id)
      const defaultMessage = 'Nenhuma música na fila'
      if (!serverQueue || serverQueue.song?.length === 0)
        return message.reply(defaultMessage)

      let listaMusicas = '\n '
      serverQueue.songs.forEach((element, index) => {
        console.log(element, index)
        listaMusicas += `${index + 1} : ${element.title}\n`
      })
      return message.reply(`${listaMusicas}`)
    } catch (error) {
      this.logHandler.log(`Erro inesperado: ${error}`)
      return message.reply('Erro inesperado')
    }
  }
}