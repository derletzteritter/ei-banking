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
		formattedMembers[k] = v
	end

	TriggerClientEvent(EiBankingEvents.GetMembersSuccess, src, formattedMembers)
end)

RegisterNetEvent(EiBankingEvents.AddMember)
AddEventHandler(EiBankingEvents.AddMember, function(data)
	local src = source

	if (src == data.member) then
		TriggerClientEvent(EiBankingEvents.AddMemberFailed, src, { message = "You cannot add yourself to the account!" })
		return
	end

	local member = QBCore.Functions.GetPlayer(data.member)

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

		MySQL.query("SELECT custom_bank_accounts.id, custom_bank_accounts.is_default as isDefault, custom_bank_accounts.balance, custom_bank_accounts.type, custom_bank_accounts.name as accountName FROM custom_bank_accounts INNER JOIN custom_bank_accounts_members on custom_bank_accounts.id = custom_bank_accounts_members.account_id WHERE custom_bank_accounts_members.citizen_id = ? AND custom_bank_accounts.id = ?", { member.PlayerData.citizenid, data.accountId },
			function(result)
				print("new account")
				print(json.encode(result))
				TriggerClientEvent(EiBankingEvents.AddMemberBroadcast, member.PlayerData.source, result[1])
			end)
	else
		TriggerClientEvent(EiBankingEvents.AddMemberFailed, src, { message = "Could not find any online player with the source/identifier [" .. data.member .. "]!" })
	end
end)

RegisterNetEvent(EiBankingEvents.RemoveMember)
AddEventHandler(EiBankingEvents.RemoveMember, function(member)
	local src = source
	local query = "DELETE FROM custom_bank_accounts_members WHERE account_id = ? AND citizen_id = ?"

	MySQL.query.await(query, { member.accountId, member.citizenId });

	TriggerClientEvent(EiBankingEvents.AddMemberSuccess, src, { memberId = member.citizenId, accountId = member.accountId })
end)

RegisterNetEvent(EiBankingEvents.UpdateMemberPermissions)
AddEventHandler(EiBankingEvents.UpdateMemberPermissions, function(data)
	local src = source

	local query = "UPDATE custom_bank_accounts_members SET can_deposit = ?, can_withdraw = ?, can_transfer = ? WHERE account_id = ? AND citizen_id = ?"
	MySQL.update.await(query, { data.canDeposit, data.canWithdraw, data.canTransfer, data.accountId, data.memberId })

	local updatedMember = GetAccountMember(data.accountId, data.memberId)

	TriggerClientEvent(EiBankingEvents.UpdateMemberPermissionsSuccess, src, updatedMember)
end)
