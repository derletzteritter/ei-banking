local QBCore = exports['qb-core']:GetCoreObject()

AddEventHandler(EiBankingEvents.GetAccounts)
RegisterNetEvent(EiBankingEvents.GetAccounts, function()
	local src = source

	local player = QBCore.Functions.GetPlayer(src)
	local citizen_id = player.PlayerData.citizenid

	print("Getting bank accounts")
	MySQL.query("SELECT custom_bank_accounts.id, custom_bank_accounts.is_default as isDefault, custom_bank_accounts.balance, custom_bank_accounts.type, custom_bank_accounts.name as accountName FROM custom_bank_accounts INNER JOIN custom_bank_accounts_members on custom_bank_accounts.id = custom_bank_accounts_members.account_id WHERE custom_bank_accounts_members.citizen_id = ?", { citizen_id },
		function(result)
			TriggerClientEvent(EiBankingEvents.SendAccounts, src, result)
		end)
end)