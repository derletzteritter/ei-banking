local QBCore = exports['qb-core']:GetCoreObject()

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
		if deposit.account.isDefault == true then
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
		if withdraw.account.isDefault == true then
			player.Functions.RemoveMoney('bank', tonumber(withdraw.amount))
			local newBalance = tonumber(currentBank) - tonumber(withdraw.amount)

			MySQL.query.await("UPDATE custom_bank_accounts SET balance = ? WHERE id = ?", { newBalance, withdraw.account.id })

			player.Functions.AddMoney('cash', tonumber(withdraw.amount))

			TriggerClientEvent(EiBankingEvents.WithdrawMoneySuccess, src, newBalance)
		else
			-- remove money
			local newBalance = withdraw.account.balance + withdraw.amount

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
	local targetAccount = transfer.targetAccount

	-- We also need to get the acccount, if we just have an accountId
	if sourceAccount.balance >= transfer.amount then
		-- if sourceAccount is default
		if sourceAccount.isDefault == true then
			player.Functions.RemoveMoney('bank', tonumber(transfer.amount))
			MySQL.query.await("UPDATE custom_bank_accounts SET balance = ? WHERE id = ?", { player.PlayerData.money['bank'], sourceAccount.id })
		elseif sourceAccount.isDefault == false then
			-- update custom account with new balance
			local newBalance = tonumber(sourceAccount.balance) - tonumber(transfer.amount)
			MySQL.query.await("UPDATE custom_bank_accounts SET balance = ? WHERE id = ?", { newBalance, sourceAccount.id })
		end
		-- custom account
		--  check of default account
		--  is the player online
		--    if so, we need to update with qbcore aswell


		if targetAccount.isDefault == true then
			-- check if player is online
			-- if not just update the db
			local participants = GetParticipantsFromAccountId(targetAccount.id or targetAccount)

			-- Default, so we don't care about the other participants, since there aren't any
			-- targetPlayer is the source, if the player is online
			local targetPlayer = QBCore.Functions.GetPlayerByCitizenId(participants[1].citizenId)
			printTable(targetPlayer)
			if targetPlayer ~= nil then
				targetPlayer.Functions.AddMoney('bank', tonumber(transfer.amount))

				MySQL.query.await("UPDATE custom_bank_accounts SET balance = ? WHERE id = ?", { player.PlayerData.money['bank'], targetAccount.id or targetAccount })
			else
				local balance = GetDefaultBankAmountFromCitizenId(participants[1].citizenId)
				local query = "UPDATE players SET money = JSON_SET(money, '$_bank', " .. tonumber(balance) .. ")"

				MySQL.query.await(query)
			end

			local newBalance = tonumber(targetPlayer.balance) - tonumber(transfer.amount)
			targetPlayer.Functions.AddMoney('bank', tonumber(transfer.amount))
			MySQL.query.await("UPDATE custom_bank_accounts SET balance = ? WHERE id = ?", { newBalance, targetAccount.id })

			TriggerClientEvent(EiBankingEvents.DepositMoneySuccess, src, newBalance)
		end
	end
end)




