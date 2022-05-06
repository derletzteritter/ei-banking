local QBCore = exports['qb-core']:GetCoreObject()

-- Welcome to hell, enter with caution.

RegisterNetEvent('QBCore:Server:PlayerLoaded')
AddEventHandler('QBCore:Server:PlayerLoaded', function(player)
	GetOrCreateDefaultAccount(player.PlayerData)
end)

AddEventHandler(EiBankingEvents.GetAccounts)
RegisterNetEvent(EiBankingEvents.GetAccounts, function()
	local src = source

	local player = QBCore.Functions.GetPlayer(src)
	local citizen_id = player.PlayerData.citizenid

	MySQL.query("SELECT custom_bank_accounts.id, custom_bank_accounts.is_default as isDefault, custom_bank_accounts.balance, custom_bank_accounts.type, custom_bank_accounts.name as accountName FROM custom_bank_accounts INNER JOIN custom_bank_accounts_members on custom_bank_accounts.id = custom_bank_accounts_members.account_id WHERE custom_bank_accounts_members.citizen_id = ?", { citizen_id },
		function(result)
			TriggerClientEvent(EiBankingEvents.SendAccounts, src, result)
		end)
end)

AddEventHandler(EiBankingEvents.CreateAccount)
RegisterNetEvent(EiBankingEvents.CreateAccount, function(accountData)
	local src = source
	local player = QBCore.Functions.GetPlayer(src)
	local citizen_id = player.PlayerData.citizenid

	local InsertId

	-- Insert account
	MySQL.insert("INSERT INTO custom_bank_accounts (name, type, balance, is_default) VALUES (?, ?, ?, ?)", { accountData.name, "personal", 0, false }, function(insertId)
		InsertId = insertId
		MySQL.insert("INSERT INTO custom_bank_accounts_members (account_id, citizen_id) VALUES (?, ?)", { insertId, citizen_id }, function(insertId)
			MySQL.query("SELECT custom_bank_accounts.id, custom_bank_accounts.is_default as isDefault, custom_bank_accounts.balance, custom_bank_accounts.type, custom_bank_accounts.name as accountName FROM custom_bank_accounts INNER JOIN custom_bank_accounts_members on custom_bank_accounts.id = custom_bank_accounts_members.account_id WHERE custom_bank_accounts_members.citizen_id = ? AND custom_bank_accounts_members.account_id = ?", { citizen_id, InsertId }, function(result)
				TriggerClientEvent(EiBankingEvents.CreateAccountSuccess, src, result[1])
			end)
		end)
	end)
end)

RegisterNetEvent(EiBankingEvents.DepositMoney)
AddEventHandler(EiBankingEvents.DepositMoney, function(deposit)
	local src = source
	local player = QBCore.Functions.GetPlayer(src)
	local currentCash = player.PlayerData.money['cash']
	local currentBank = player.PlayerData.money['bank']

	if currentCash >= deposit.amount then
		-- If we have enough cash
		if deposit.account.isDefault == 1 then
			local newBalance = tonumber(currentBank) + tonumber(deposit.amount)
			player.Functions.RemoveMoney('cash', tonumber(deposit.amount))

			if (deposit.account.isDefault) then
				player.Functions.AddMoney('bank', tonumber(deposit.amount))
			end

			MySQL.query.await("UPDATE custom_bank_accounts SET balance = ? WHERE id = ?", { newBalance, deposit.account.id })

			TriggerClientEvent(EiBankingEvents.DepositMoneySuccess, src, newBalance)
		else
			local newBalance = deposit.account.balance + deposit.amount

			MySQL.query.await("UPDATE custom_bank_accounts SET balance = ? WHERE id = ?", { newBalance, deposit.account.id })

			TriggerClientEvent(EiBankingEvents.DepositMoneySuccess, src, newBalance)
		end
	else
		print("We do not have enough money")
	end
end)

RegisterNetEvent(EiBankingEvents.WithdrawMoney)
AddEventHandler(EiBankingEvents.WithdrawMoney, function(withdraw)
	local src = source
	local player = QBCore.Functions.GetPlayer(src)
	local currentBank = player.PlayerData.money['bank']

	if withdraw.amount <= currentBank then
		print("Trying to withdraw", withdraw.amount)
		if withdraw.account.isDefault == 1 then
			print("This is a default account")
			player.Functions.RemoveMoney('bank', tonumber(withdraw.amount))
			local newBalance = tonumber(currentBank) - tonumber(withdraw.amount)

			MySQL.query.await("UPDATE custom_bank_accounts SET balance = ? WHERE id = ?", { newBalance, withdraw.account.id })

			player.Functions.AddMoney('cash', tonumber(withdraw.amount))

			TriggerClientEvent(EiBankingEvents.WithdrawMoneySuccess, src, newBalance)
		else
			print("This is not a default account")
			-- remove money
			local newBalance = tonumber(withdraw.account.balance) + tonumber(withdraw.amount)

			MySQL.query.await("UPDATE custom_bank_accounts SET balance = ? WHERE id = ?", { newBalance, withdraw.account.id })

			TriggerClientEvent(EiBankingEvents.WithdrawMoneySuccess, src, newBalance)
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

	local currentBank = player.PlayerData.money['bank']

	MySQL.query.await("UPDATE custom_bank_accounts INNER JOIN custom_bank_accounts_members on custom_bank_accounts.id = custom_bank_accounts_members.account_id SET balance = ? WHERE custom_bank_accounts.is_default = 1 AND custom_bank_accounts_members.citizen_id = ?", { currentBank, citizenId })

	TriggerClientEvent(EiBankingEvents.SyncDefaultAccountSuccess, src, currentBank)
end)

RegisterNetEvent(EiBankingEvents.TransferMoney)
AddEventHandler(EiBankingEvents.TransferMoney, function(transfer)
	local src = source
	local player = QBCore.Functions.GetPlayer(src)

	local sourceAccount = transfer.sourceAccount

	-- this can either just be a uid (string) or a account table
	local targetAccount = transfer.targetAccount

	print("sourceAccount id", sourceAccount.id)
	print("targetAccount id", targetAccount.id)

	local participants = GetParticipantsFromAccountId(targetAccount.id or targetAccount)

	-- We also need to get the acccount, if we just have an accountId
	if sourceAccount.balance >= transfer.amount then
		local newBalance = tonumber(sourceAccount.balance) - tonumber(transfer.amount)
		-- if sourceAccount is default
		if sourceAccount.isDefault == 1 then
			player.Functions.RemoveMoney('bank', tonumber(transfer.amount))
			MySQL.query.await("UPDATE custom_bank_accounts SET balance = ? WHERE id = ?", { player.PlayerData.money['bank'], tonumber(sourceAccount.id) })
		elseif sourceAccount.isDefault == false then
			-- update custom account with new balance
			MySQL.query.await("UPDATE custom_bank_accounts SET balance = ? WHERE id = ?", { newBalance, tonumber(sourceAccount.id) })
		end
		-- update source account
		TriggerClientEvent(EiBankingEvents.TransferMoneySuccess, src, newBalance)

		-- custom account
		--  check of default account
		--  is the player online
		--    if so, we need to update with qbcore aswell


		if targetAccount.isDefault == 1 then
			-- Default, so we don't care about the other participants, since there aren't any
			-- targetPlayer is the source, if the player is online
			local targetPlayer = QBCore.Functions.GetPlayerByCitizenId(participants[1].citizenId)
			print("We have a target player", targetPlayer.PlayerData.source)
			if targetPlayer ~= nil then
				targetPlayer.Functions.AddMoney('bank', tonumber(transfer.amount))

				MySQL.query.await("UPDATE custom_bank_accounts SET balance = ? WHERE id = ?", { targetPlayer.PlayerData.money['bank'], targetAccount.id or targetAccount })
				TriggerClientEvent(EiBankingEvents.TransferMoneyBroadcast, targetPlayer.PlayerData.source, { accountId = targetAccount.id or targetAccount, newBalance = targetPlayer.PlayerData.money['bank'] })
			else
				-- We don't actually have to update the custom bank. It will sync once the target player connects.
				local balance = GetDefaultBankAmountFromCitizenId(participants[1].citizenId)
				local query = "UPDATE players SET money = JSON_SET(money, '$.bank', " .. tonumber(balance) .. ")"

				MySQL.query.await(query)
			end
		end

		if targetAccount.isDefault == 0 then
			local targetPlayer = QBCore.Functions.GetPlayerByCitizenId(participants[1].citizenId)
			print("We have a target player", targetPlayer.PlayerData.source)

			local customAccount = GetCustomAccount(targetAccount.id or targetAccount)
			local newTargetBalance = tonumber(customAccount.balance) + tonumber(transfer.amount)

			TriggerClientEvent(EiBankingEvents.TransferMoneyBroadcast, targetPlayer.PlayerData.source, { accountId = targetAccount.id or targetAccount, newBalance = newTargetBalance })
			MySQL.query.await("UPDATE custom_bank_accounts SET balance = ? WHERE id = ?", { newTargetBalance, targetAccount.id or targetAccount })
		end
	end
end)




