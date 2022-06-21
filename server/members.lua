local QBCore = exports['qb-core']:GetCoreObject()

RegisterNetEvent(EiBankingEvents.GetMembers)
AddEventHandler(EiBankingEvents.GetMembers, function(data)
	local accountId = data.accountId
	local src = source

	local membersQuery = "SELECT account_id AS accountId, citizen_id AS citizenId, can_deposit AS canDeposit, can_withdraw AS canWithdraw, can_transfer AS canTransfer FROM custom_bank_accounts_members WHERE account_id = ?"
	local members = MySQL.query.await(membersQuery, { accountId })

	local formattedMembers = {}

	for k, v in pairs(members) do
		local memberData = QBCore.Functions.GetOfflinePlayerByCitizenId(v.citizenId)

		v["name"] = "" .. memberData.PlayerData.charinfo.firstname .. " " .. memberData.PlayerData.charinfo.lastname
		for i, m in pairs(v) do
			print("member", i, m)
		end

		formattedMembers[k] = v
	end

	TriggerClientEvent(EiBankingEvents.GetMembersSuccess, src, formattedMembers)
end)

RegisterNetEvent(EiBankingEvents.AddMember)
AddEventHandler(EiBankingEvents.AddMember, function(data)
	print("Add member event", data.memberSource)
	print("Add member - account id", data.accountId)

	local src = source

	if (src == data.memberSource) then
		TriggerClientEvent(EiBankingEvents.AddMemberFailed, src, { message = "You cannot add yourself to the account!" })
		return
	end

	local member = QBCore.Functions.GetPlayer(data.memberSource)

	if member ~= nil then
		local query = "INSERT INTO custom_bank_accounts_members (account_id, citizen_id) VALUES (?, ?)"

		MySQL.insert.await(query, { data.accountId, member.PlayerData.citizenid })

		local memberData = QBCore.Functions.GetPlayerByCitizenId(member.PlayerData.citizenid)

		local memberQuery = "SELECT * FROM custom_bank_accounts_members WHERE account_id = ? AND citizen_id = ?"
		local newMember = MySQL.query.await(memberQuery, { data.accountId, member.PlayerData.citizenid })

		local respObj = {
			name = "" .. memberData.PlayerData.charinfo.firstname .. " " .. memberData.PlayerData.charinfo.lastname,
			citizenId = memberData.PlayerData.citizenid,
			canDeposit = newMember[1].can_deposit,
			canWithdraw = newMember[1].can_withdraw,
			canTransfer = newMember[1].can_transfer,
		}

		TriggerClientEvent(EiBankingEvents.AddMemberSuccess, src, respObj)
	else
		TriggerClientEvent(EiBankingEvents.AddMemberFailed, src, { message = "Could not find any online player with the source [" .. data.memberSource .. "]!" })
	end
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
