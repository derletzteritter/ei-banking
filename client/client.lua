local function toggleNuiFrame(shouldShow)
	SetNuiFocus(shouldShow, shouldShow)
	SendReactMessage('setVisible', shouldShow)
end

RegisterCommand('show-nui', function()
	toggleNuiFrame(true)
	TriggerServerEvent('ei-banking:getCredentials')
	TriggerServerEvent(EiBankingEvents.SyncDefaultAccount)
end)

RegisterNetEvent('ei-banking:onCredentials', function(data)
	print(json.encode(data))
	SendReactMessage('ei-banking:setCredentials', data)
end)

RegisterNUICallback('hideFrame', function(_, cb)
	toggleNuiFrame(false)
	cb({})
end)

AddEventHandler(EiBankingEvents.SendAccounts)

RegisterNUICallback(EiBankingEvents.GetAccounts, function(data, cb)
	TriggerServerEvent(EiBankingEvents.GetAccounts)

	RegisterNetEvent(EiBankingEvents.SendAccounts, function(accounts)
		cb(accounts)
	end)
end)

RegisterNUICallback(EiBankingEvents.CreateAccount, function(data, cb)
	TriggerServerEvent(EiBankingEvents.CreateAccount, data)

	RegisterNetEvent(EiBankingEvents.CreateAccountSuccess, function(account)
		cb(account)
	end)
end)

RegisterNUICallback(EiBankingEvents.DepositMoney, function(data, cb)
	TriggerServerEvent(EiBankingEvents.DepositMoney, data)

	RegisterNetEvent(EiBankingEvents.DepositMoneySuccess, function(newBalance)
		cb({ status = 'ok', data = newBalance })
	end)
end)

RegisterNUICallback(EiBankingEvents.WithdrawMoney, function(data, cb)
	TriggerServerEvent(EiBankingEvents.WithdrawMoney, data)

	RegisterNetEvent(EiBankingEvents.WithdrawMoneySuccess, function(newBalance)
		cb({ status = 'ok', data = newBalance })
	end)
end)

RegisterNetEvent(EiBankingEvents.SyncDefaultAccountSuccess)
AddEventHandler(EiBankingEvents.SyncDefaultAccountSuccess, function(balance)
	SendReactMessage("SyncDefaultAccount", balance)
end)

-- TransferMoney
RegisterNUICallback(EiBankingEvents.TransferMoney, function(data, cb)
	TriggerServerEvent(EiBankingEvents.TransferMoney, data)

	RegisterNetEvent(EiBankingEvents.TransferMoneySuccess, function(data)
		cb({ status = 'ok', data = data })
	end)

	RegisterNetEvent(EiBankingEvents.TransferMoneyFailed, function(data)
		cb({ status = "error", data = data })
	end)
end)

RegisterNetEvent(EiBankingEvents.SetNotification)
AddEventHandler(EiBankingEvents.SetNotification, function(notification)
	SendReactMessage(EiBankingEvents.SetNotification, notification)
end)

RegisterNetEvent(EiBankingEvents.TransferMoneyBroadcast)
AddEventHandler(EiBankingEvents.TransferMoneyBroadcast, function(data)
	print(json.encode(data))
	SendReactMessage(EiBankingEvents.TransferMoneyBroadcast, data)
end)

RegisterNUICallback(EiBankingEvents.AddMember, function(data, cb)
	TriggerServerEvent(EiBankingEvents.AddMember, data)

	RegisterNetEvent(EiBankingEvents.AddMemberSuccess, function(data)
		cb({ status = "ok", data = data })
	end)

	RegisterNetEvent(EiBankingEvents.AddMemberFailed, function(data)
		cb({ status = "error", data = data })
	end)
end)

RegisterNUICallback(EiBankingEvents.GetMembers, function(data, cb)
	TriggerServerEvent(EiBankingEvents.GetMembers, data)

	RegisterNetEvent(EiBankingEvents.GetMembersSuccess, function(members)
		cb({ status = 'ok', data = members })
	end)
end)

RegisterNUICallback(EiBankingEvents.UpdateMemberPermissions, function(data, cb)
	TriggerServerEvent(EiBankingEvents.UpdateMemberPermissions, data)

	RegisterNetEvent(EiBankingEvents.UpdateMemberPermissionsSuccess, function(updatedMembers)
		cb({ status = "ok", data = updatedMembers })
	end)
end)

RegisterNUICallback(EiBankingEvents.RemoveMember, function(data, cb)
	TriggerServerEvent(EiBankingEvents.RemoveMember, data)
	
	
	RegisterNetEvent(EiBankingEvents.RemoveMemberSuccess, function(removedMember)
		cb({ status = "ok", data = removedMember })
	end)
end)

RegisterNetEvent(EiBankingEvents.AddMemberBroadcast, function(data)
	print("new account", json.encode(data))
	SendReactMessage(EiBankingEvents.AddMemberBroadcast, data)	
end)
