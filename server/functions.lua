local QBCore = exports['qb-core']:GetCoreObject()

function GetOrCreateDefaultAccount(playerData)
	local bankAmount = playerData.money['bank']
	local citizenId = playerData.citizenid

	print(bankAmount, citizenId)

	local account = MySQL.query.await("SELECT custom_bank_accounts.id, custom_bank_accounts.is_default as isDefault, custom_bank_accounts.balance, custom_bank_accounts.type, custom_bank_accounts.name as accountName FROM custom_bank_accounts INNER JOIN custom_bank_accounts_members on custom_bank_accounts.id = custom_bank_accounts_members.account_id WHERE custom_bank_accounts.is_default = 1 AND custom_bank_accounts_members.citizen_id = ?", { citizenId })
	print("trying to get the account", account[1])

	if (account[1] == nil) then
		print("Found no account...creating account")
		local accountId = MySQL.insert.await("INSERT INTO custom_bank_accounts (name, type, balance, is_default) VALUES (?, ?, ?, ?)", { "Default Account", "personal", bankAmount, true })
		MySQL.insert.await("INSERT INTO custom_bank_accounts_members (account_id, citizen_id) VALUES (?, ?)", { accountId, citizenId })
		print("Created default account for:", citizenId)
	end
end

function GetParticipantsFromAccountId(accountId)
	print('GetParticipantsFromAccountId', accountId)
	local query = "SELECT citizen_id as citizenId FROM custom_bank_accounts_members WHERE account_id = ?"

	local citizenIds = MySQL.query.await(query, { tonumber(accountId) })

	return citizenIds
end

function GetDefaultBankAmountFromCitizenId(citizenid)
	local money = MySQL.query.await("SELECT JSON_ARRAY(money) FROM players WHERE citizenid = ?", { citizenid })
	local money_decoded = json.decode(money)
	local bankAmount = money_decoded["bank"]

	return bankAmount
end

function GetCustomAccount(accountId)
	local query = "SELECT * FROM custom_bank_accounts WHERE id = ?"

	local account = MySQL.query.await(query, { accountId })

	return account[1]
end


function GetAccountMember(accountId, citizenId)
	local memberQuery = "SELECT * FROM custom_bank_accounts_members WHERE account_id = ? AND citizen_id = ?"
	local newMember = MySQL.query.await(memberQuery, { accountId, citizenId })

	local respObj = {
		citizenId = citizenId,
		canDeposit = newMember[1].can_deposit,
		canWithdraw = newMember[1].can_withdraw,
		canTransfer = newMember[1].can_transfer,
	}

	return respObj
end