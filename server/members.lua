RegisterNetEvent(EiBankingEvents.AddMemeber)
AddEventHandler(EiBankingEvents.AddMemeber, function(member)
	local query = "INSERT INTO custom_bank_accounts_members (account_id, citizen_id) VALUES (?, ?)"

	MySQL.insert.await(query, { data.accountId, data.citizenId })
end)

RegisterNetEvent(EiBankingEvents.RemoveMember)
AddEventHandler(EiBankingEvents.RemoveMember, function(member)
	print(member)

	local query = "DELETE FROM custom_bank_accounts_members WHERE account_id = ? AND citizen_id = ?"

	MySQL.query.await(query, { member.accountId, member.citizenId })
end)

RegisterNetEvent(EiBankingEvents.UpdateMemberPermissions)
AddEventHandler(EiBankingEvents.UpdateMemberPermissions, function(data)
	
end)