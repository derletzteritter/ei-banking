local function toggleNuiFrame(shouldShow)
  SetNuiFocus(shouldShow, shouldShow)
  SendReactMessage('setVisible', shouldShow)
end

RegisterCommand('show-nui', function()
  toggleNuiFrame(true)
  debugPrint('Show NUI frame')
end)

RegisterNUICallback('hideFrame', function(_, cb)
  toggleNuiFrame(false)
  debugPrint('Hide NUI frame')
  cb({})
end)

RegisterCommand('getaccounts', function()
  TriggerServerEvent(EiBankingEvents.GetAccounts)
end)

AddEventHandler(EiBankingEvents.SendAccounts)

RegisterNUICallback(EiBankingEvents.GetAccounts, function(data, cb)
  TriggerServerEvent(EiBankingEvents.GetAccounts)

  RegisterNetEvent(EiBankingEvents.SendAccounts, function(accounts)
    cb(accounts)
  end)
end)