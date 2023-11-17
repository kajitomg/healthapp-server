import {MyTransactionType} from "./transaction";

const t: MyTransactionType = require('./transaction')

export default async function (callback, error) {
  const transaction = await t.create()
  
  if (t.isTransactionError(transaction)) {
    throw error(transaction.error)
  }
  
  const res = await callback(transaction)
  
  const commit = await t.commit(transaction.data)
  if (t.isTransactionError(commit)) {
    throw error(commit.error)
  }
  
  return res
}