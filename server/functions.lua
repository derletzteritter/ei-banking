function GetOrCreateDefaultAccount(playerData)
	local bankAmount = playerData.money['bank']
	local citizenId = playerData.citizenid

	print(bankAmount, citizenId)

	local account = MySQL.query.await("SELECT custom_bank_accounts.id, custom_bank_accounts.is_default as isDefault, custom_bank_accounts.balance, custom_bank_accounts.type, custom_bank_accounts.name as accountName FROM custom_bank_accounts INNER JOIN custom_bank_accounts_members on custom_bank_accounts.id = custom_bank_accounts_members.account_id WHERE custom_bank_accounts.is_default = 1 AND custom_bank_accounts_members.citizen_id = ?", { citizenId })
	print("trying to get the account", account[1])

	if (account[1] == nil) then
		print("Found no account...creating account")
		local accountId = MySQL.insert.await("INSERT INTO custom_bank_accounts (name, type, balance, is_default) VALUES (?, ?, ?, ?)", { "Default Account", "personal", bankAmount, true })
		MySQL.insert.await("INSERT INTO custom_bank_accounts_members (account_id, citizen_id) VALUES (?, ?)", { accountId, citizenId })
		print("Created default account for:", citizenId)
	end
end