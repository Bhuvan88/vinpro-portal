import { useLogout,LegacyAuthProvider as AuthProvider } from '@refinedev/core';
import { AuthHelper } from '@tspvivek/refine-directus';
import { directusClient } from './directusClient';
import { useTeam } from './teamProvider';

const directusAuthHelper = AuthHelper(directusClient);

const authProvider: AuthProvider = {	

	login: async ({ username, password }) => {
		const { access_token } = await directusAuthHelper.login(username, password);
		return access_token ? Promise.resolve() : Promise.reject();
	},
	logout: async () => {
		localStorage.clear();	
		location.reload();	
		directusAuthHelper.logout();
		await Promise.resolve();
	},

	checkError: () => {
		return Promise.resolve();
	},

	checkAuth: async () => {
		if (await directusAuthHelper.getToken()) {
			await Promise.resolve();
		} else {
			await Promise.reject();
		}
		// return directusAuthHelper.getToken() != null ? Promise.resolve() : Promise.reject();
	},
	getPermissions: () => {
		return Promise.resolve();
	},

	getUserIdentity: async () => {
		try {
			const data = await directusAuthHelper.me({ fields: [ '*.*', 'merchant.*', 'role.*.*' ] });
			return Promise.resolve(data);
		} catch (e) {
			
			if(e?.errors?.[0]?.extensions?.code == 'INVALID_TOKEN' || e?.errors?.[0]?.extensions?.code == 'INVALID_CREDENTIALS') {
				localStorage.clear();
				if(window?.location?.pathname != "/login"){
					window.location.href = "/login";
				}
				await directusAuthHelper.logout();
			}			
			return Promise.reject();
		}
	}
};

export default authProvider;
