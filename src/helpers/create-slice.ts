import {MyTransactionType, TransactionSuccessCreateType} from "./transaction";

const t: MyTransactionType = require('./transaction')


export type OptionsType = {
  transaction:TransactionSuccessCreateType
}
interface ParsedQs {
  [key: string]: undefined
    | string
    | string[]
    | ParsedQs
    | ParsedQs[]
}

type acceptProps<DATA,OPTIONS,QUERIES> = {
  data?:DATA,
  options?:OPTIONS,
  queries?:QUERIES
}
/**
 * Создание Slice // Использовать только Pick<>
 */
export default function createSlice<T = void, DATA = {}>(callback: (props: acceptProps<DATA, OptionsType, ParsedQs>) => Promise<T>):(props: acceptProps<DATA, OptionsType, ParsedQs>) => Promise<T> {
  return async function(props) {
    try {
      return await callback(props)
    } catch (error) {
      console.log(error)
      await t.rollback(props.options.transaction.data)
      return Promise.reject(error)
    }
  }
}