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

	if (currentCash >= deposit.amount) then -- If we have enough cash
		print("We have enough money")

		player.Functions.RemoveMoney('cash', tonumber(deposit.amount))

		if (deposit.account.isDefault) then
			player.Functions.AddMoney('bank', tonumber(deposit.amount))
		end

		local newBalance = tonumber(currentBank) + tonumber(deposit.amount)

		MySQL.query.await("UPDATE custom_bank_accounts SET balance = ? WHERE id = ?", { newBalance, deposit.account.id })

		TriggerClientEvent(EiBankingEvents.DepositMoneySuccess, src, newBalance)
	else
		print("We do not have enough money")
	end
end)

RegisterNetEvent(EiBankingEvents.WithdrawMoney)
AddEventHandler(EiBankingEvents.WithdrawMoney, function(withdraw)
	local src = source
	local player = QBCore.Functions.GetPlayer(src)
	local currentCash = player.PlayerData.money['cash']
	local currentBank = player.PlayerData.money['bank']

	if (amount <= currentBank) then
		if (withdraw.account.isDefault) then
			player.Functions.RemoveMoney('bank', tonumber(withdraw.amount))
		end

		local newBalance = tonumber(currentBank) - tonumber(withdraw.amount)

		MySQL.query.await("UPDATE custom_bank_accounts SET balance = ? WHERE id = ?", { newBalance, deposit.account.id })

		player.Functions.AddMoney('cash', tonumber(withdraw.amount))
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

	MySQL.query.await("UPDATE custom_bank_accounts INNER JOIN custom_bank_accounts_members on custom_bank_accounts.id = custom_bank_accounts_members.account_id SET balance = ? WHERE is_default = 1 AND custom_bank_accounts_members.citizen_id = ?", { currentBank, citizenId })

	TriggerClientEvent(EiBankingEvents.SyncDefaultAccountSuccess, src, currentBank)
end)