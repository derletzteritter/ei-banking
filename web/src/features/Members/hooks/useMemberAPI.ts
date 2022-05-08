import { fetchNui } from '../../../utils/fetchNui';

export const useMemberAPI = () => {

    const updateAccountMember = (data: any) => {
        fetchNui('ei-banking:updateAccountMember', data).then((resp) => {
            if (resp.status !== 'ok') {

            }

            // do some stuff
        })
    }

    return { updateAccountMember }
}