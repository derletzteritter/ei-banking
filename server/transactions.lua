function CreateTransaction(amount, toAccount, fromAccount, actionType) 
  local result = MySQL.insert.await("INSERT INTO custom_bank_accounts_transactions (amount, type, toAccount, fromAccount) VALUES (?, ?, ?, ?)", { amount, actionType, toAccount, fromAccount })
  
  local transaction = GetTransaction(result.insertId)
  return transaction
end

function GetTransaction(transactionId)
  local result = MySQL.query.await("SELECT * FROM custom_bank_accounts_transactions WHERE id = ?", { transactionId })
  
  return result[1]
end

function GetAllTransactions(accountId)
  local result = MySQL.query.await("SELECT * FROM custom_bank_accounts_transactions WHERE accountId = ?", { accountId })
  
  return result
end
