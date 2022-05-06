RegisterNetEvent('addMember')
AddEventHandler('addMemeber', function(data)
	local query = "INSERT INTO custom_bank_accounts_members (account_id, citizen_id) VALUES (?, ?)"

	MySQL.insert.await(query, { data.accountId, data.citizenId })
end)
