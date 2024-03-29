local QBCore = exports["qb-core"]:GetCoreObject()

-- Welcome to hell, enter with caution.

RegisterNetEvent("ei-banking:getCredentials")
AddEventHandler("ei-banking:getCredentials", function()
	local src = source
	local player = QBCore.Functions.GetPlayer(src)

	local data = {
		charName = "" .. player.PlayerData.charinfo.firstname .. " " .. player.PlayerData.charinfo.lastname,
		citizenId = player.PlayerData.citizenid,
	}

	TriggerClientEvent("ei-banking:onCredentials", src, data)
end)

RegisterNetEvent("QBCore:Server:PlayerLoaded")
AddEventHandler("QBCore:Server:PlayerLoaded", function(player)
	GetOrCreateDefaultAccount(player.PlayerData)
end)

RegisterNetEvent(EiBankingEvents.GetAccounts)
AddEventHandler(EiBankingEvents.GetAccounts, function()
	local src = source

	local player = QBCore.Functions.GetPlayer(src)
	local citizen_id = player.PlayerData.citizenid

	MySQL.query(
		"SELECT custom_bank_accounts.id, custom_bank_accounts.is_default as isDefault, custom_bank_accounts.balance, custom_bank_accounts_members.type AS type, custom_bank_accounts.name as accountName FROM custom_bank_accounts INNER JOIN custom_bank_accounts_members on custom_bank_accounts.id = custom_bank_accounts_members.account_id WHERE custom_bank_accounts_members.citizen_id = ?",
		{ citizen_id },
		function(result)
			TriggerClientEvent(EiBankingEvents.SendAccounts, src, result)
		end
	)
end)

RegisterNetEvent(EiBankingEvents.CreateAccount)
AddEventHandler(EiBankingEvents.CreateAccount, function(accountData)
	local src = source
	local player = QBCore.Functions.GetPlayer(src)
	local citizen_id = player.PlayerData.citizenid

	local InsertId

	-- Insert account
	MySQL.insert(
		"INSERT INTO custom_bank_accounts (name, balance, is_default) VALUES (?, ?, ?)",
		{ accountData.name, 0, false },
		function(insertId)
			InsertId = insertId
			MySQL.insert(
				"INSERT INTO custom_bank_accounts_members (account_id, citizen_id, type) VALUES (?, ?,?)",
				{ insertId, "personal", citizen_id },
				function(insertId)
					MySQL.query(
						"SELECT custom_bank_accounts.id, custom_bank_accounts.is_default as isDefault, custom_bank_accounts.balance, custom_bank_accounts_members.type AS type, custom_bank_accounts.name as accountName FROM custom_bank_accounts INNER JOIN custom_bank_accounts_members on custom_bank_accounts.id = custom_bank_accounts_members.account_id WHERE custom_bank_accounts_members.citizen_id = ? AND custom_bank_accounts_members.account_id = ?",
						{ citizen_id, InsertId },
						function(result)
							TriggerClientEvent(EiBankingEvents.CreateAccountSuccess, src, result[1])
						end
					)
				end
			)
		end
	)
end)

RegisterNetEvent(EiBankingEvents.DepositMoney)
AddEventHandler(EiBankingEvents.DepositMoney, function(deposit)
	local src = source
	local player = QBCore.Functions.GetPlayer(src)
	if deposit.account.type == "shared" then
		local member = GetAccountMember(deposit.account.id, player.PlayerData.citizenid)
		if member.canDeposit == 0 then
			TriggerClientEvent(
				EiBankingEvents.SetNotification,
				src,
				{ type = "error", message = "You don't have permission to deposit to this account." }
			)
			return
		end
	end

	local currentCash = player.PlayerData.money["cash"]
	local currentBank = player.PlayerData.money["bank"]

	if currentCash >= deposit.amount then
		-- If we have enough cash

		local newBalance = deposit.account.balance + deposit.amount

		if deposit.account.isDefault == 1 then
			local newBalance = tonumber(currentBank) + tonumber(deposit.amount)
			player.Functions.RemoveMoney("cash", tonumber(deposit.amount))

			if deposit.account.isDefault then
				player.Functions.AddMoney("bank", tonumber(deposit.amount))
			end

			MySQL.query.await(
				"UPDATE custom_bank_accounts SET balance = ? WHERE id = ?",
				{ newBalance, deposit.account.id }
			)

			TriggerClientEvent(EiBankingEvents.DepositMoneySuccess, src, newBalance)
		else
			MySQL.query.await(
				"UPDATE custom_bank_accounts SET balance = ? WHERE id = ?",
				{ newBalance, deposit.account.id }
			)

			TriggerClientEvent(EiBankingEvents.DepositMoneySuccess, src, newBalance)
		end

		local transaction = CreateTransaction(deposit.amount, deposit.account.id, deposit.account.id, "deposit")
		local participants = GetParticipantsFromAccountId(deposit.account.id)
		for k, v in pairs(participants) do
			local player = QBCore.Functions.GetPlayerByCitizenId(v)

			if player ~= nil then
				TriggerClientEvent(
					EiBankingEvents.TransactionBroadcast,
					player.PlayerData.source,
					{ accountId = deposit.account.id, transaction = transaction }
				)
			end
		end
	else
		print("We do not have enough money")
	end
end)

RegisterNetEvent(EiBankingEvents.WithdrawMoney)
AddEventHandler(EiBankingEvents.WithdrawMoney, function(withdraw)
	local src = source
	local player = QBCore.Functions.GetPlayer(src)

	if withdraw.account.type == "shared" then
		local member = GetAccountMember(withdraw.account.id, player.PlayerData.citizenid)
		if member.canDeposit == 0 then
			TriggerClientEvent(
				EiBankingEvents.SetNotification,
				src,
				{ type = "error", message = "You don't have permission to withdraw from this account." }
			)
			return
		end
	end
	local currentBank = player.PlayerData.money["bank"]

	if withdraw.amount <= currentBank then
		print("Trying to withdraw", withdraw.amount)
		if withdraw.account.isDefault == 1 then
			print("This is a default account")
			player.Functions.RemoveMoney("bank", tonumber(withdraw.amount))
			local newBalance = tonumber(currentBank) - tonumber(withdraw.amount)

			MySQL.query.await(
				"UPDATE custom_bank_accounts SET balance = ? WHERE id = ?",
				{ newBalance, withdraw.account.id }
			)

			player.Functions.AddMoney("cash", tonumber(withdraw.amount))

			TriggerClientEvent(EiBankingEvents.WithdrawMoneySuccess, src, newBalance)
		else
			print("This is not a default account")
			-- remove money
			local newBalance = tonumber(withdraw.account.balance) + tonumber(withdraw.amount)

			MySQL.query.await(
				"UPDATE custom_bank_accounts SET balance = ? WHERE id = ?",
				{ newBalance, withdraw.account.id }
			)

			TriggerClientEvent(EiBankingEvents.WithdrawMoneySuccess, src, newBalance)
		end

		local transaction = CreateTransaction(withdraw.amount, withdraw.account.id, withdraw.account.id, "withdraw")
		local participants = GetParticipantsFromAccountId(withdraw.account.id)
		for k, v in pairs(participants) do
			local player = QBCore.Functions.GetPlayerByCitizenId(v)

			if player ~= nil then
				TriggerClientEvent(
					EiBankingEvents.TransactionBroadcast,
					player.PlayerData.source,
					{ accountId = withdraw.account.id, transaction = transaction }
				)
			end
		end
	else
		print("Not enough money")
	end
end)

RegisterNetEvent(EiBankingEvents.SyncDefaultAccount)
AddEventHandler(EiBankingEvents.SyncDefaultAccount, function()
	local src = source
	player = QBCore.Functions.GetPlayer(src)
	local citizenId = player.PlayerData.citizenid

	local currentBank = player.PlayerData.money["bank"]

	MySQL.query.await(
		"UPDATE custom_bank_accounts INNER JOIN custom_bank_accounts_members on custom_bank_accounts.id = custom_bank_accounts_members.account_id SET balance = ? WHERE custom_bank_accounts.is_default = 1 AND custom_bank_accounts_members.citizen_id = ?",
		{ currentBank, citizenId }
	)

	TriggerClientEvent(EiBankingEvents.SyncDefaultAccountSuccess, src, currentBank)
end)

RegisterNetEvent(EiBankingEvents.TransferMoney)
AddEventHandler(EiBankingEvents.TransferMoney, function(transfer)
	local src = source
	local player = QBCore.Functions.GetPlayer(src)
	if transfer.sourceAccount.type == "shared" then
		local member = GetAccountMember(transfer.sourceAccount .. id, player.PlayerData.citizenid)
		if member.canDeposit == 0 then
			TriggerClientEvent(
				EiBankingEvents.SetNotification,
				src,
				{ type = "error", message = "You don't have permission to transfer from this account." }
			)
			return
		end
	end

	local sourceAccount = transfer.sourceAccount
	-- this can either just be a uid (string) or an account table
	local targetAccount = transfer.targetAccount

	local participants = GetParticipantsFromAccountId(targetAccount.id or targetAccount)

	if sourceAccount.balance < transfer.amount or transfer.amount == 0 then
		TriggerClientEvent(EiBankingEvents.TransferMoneyFailed, src, { errorMessage = "You do not have enough money" })
		return
	end
	-- We also need to get the acccount, if we just have an accountId
	if sourceAccount.balance >= transfer.amount then
		local newBalance = tonumber(sourceAccount.balance) - tonumber(transfer.amount)
		-- if sourceAccount is default
		if sourceAccount.isDefault == 1 then
			player.Functions.RemoveMoney("bank", tonumber(transfer.amount))

			local player = QBCore.Functions.GetPlayer(src)

			MySQL.query.await(
				"UPDATE custom_bank_accounts SET balance = ? WHERE id = ?",
				{ player.PlayerData.money["bank"], tonumber(sourceAccount.id) }
			)
		elseif sourceAccount.isDefault == 0 then
			-- update custom account with new balance
			MySQL.query.await(
				"UPDATE custom_bank_accounts SET balance = ? WHERE id = ?",
				{ newBalance, tonumber(sourceAccount.id) }
			)
		end
		-- update source account
		TriggerClientEvent(EiBankingEvents.TransferMoneySuccess, src, newBalance)
		--  check of default account
		--  is the player online
		--    if so, we need to update with qbcore aswell
		if targetAccount.isDefault == 1 then
			-- Default, so we don't care about the other participants, since there aren't any
			-- targetPlayer is the source, if the player is online
			local targetPlayer = QBCore.Functions.GetPlayerByCitizenId(participants[1].citizenId)

			if targetPlayer ~= nil then
				local newBalance = targetPlayer.PlayerData.money.bank + transfer.amount
				targetPlayer.Functions.AddMoney("bank", transfer.amount)

				MySQL.query.await(
					"UPDATE custom_bank_accounts SET balance = ? WHERE id = ?",
					{ newBalance, targetAccount.id or targetAccount }
				)
				TriggerClientEvent(
					EiBankingEvents.TransferMoneyBroadcast,
					targetPlayer.PlayerData.source,
					{ accountId = targetAccount.id or targetAccount, newBalance = newBalance }
				)
			else
				-- We don't actually have to update the custom bank. It will sync once the target player connects.
				local balance = GetDefaultBankAmountFromCitizenId(participants[1].citizenId)
				local query = "UPDATE players SET money = JSON_SET(money, '$.bank', ?)"

				MySQL.query.await(query, tonumber(balance))
			end
		end

		if targetAccount.isDefault == 0 then
			local targetPlayer = QBCore.Functions.GetPlayerByCitizenId(participants[1].citizenId)

			local customAccount = GetCustomAccount(targetAccount.id or targetAccount)
			local newTargetBalance = tonumber(customAccount.balance) + tonumber(transfer.amount)

			TriggerClientEvent(
				EiBankingEvents.TransferMoneyBroadcast,
				targetPlayer.PlayerData.source,
				{ accountId = targetAccount.id or targetAccount, newBalance = newTargetBalance }
			)
			MySQL.query.await(
				"UPDATE custom_bank_accounts SET balance = ? WHERE id = ?",
				{ newTargetBalance, targetAccount.id or targetAccount }
			)
		end

		local transaction = CreateTransaction(transfer.amount, targetAccount.id, sourceAccount.id, "transfer")
	end
end)

RegisterNetEvent(EiBankingEvents.GetTransactions, function(accountId)
	print("Trying to get transactions with id", accountId)
	local src = source
	local transactions = GetAllTransactions(accountId)
	print("Found transactions", json.encode(transactions))

	TriggerClientEvent(EiBankingEvents.GetTransactionsSuccess, src, transactions)
end)