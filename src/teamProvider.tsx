import { createContext, useContext, useEffect, useState } from 'react';
import { directusClient } from './directusClient';

export const TeamContext = createContext<any[]>([]);

export const useTeam: any = () => {
	return useContext(TeamContext);
};

export function TeamProvider({ children }) {
	const team: any = useProvideTeam();
	return <TeamContext.Provider value={team}>{children}</TeamContext.Provider>;
}

function useProvideTeam() {
	const ISSERVER = typeof window === 'undefined';
	const [directusRole, setDirectusRole] = useState<any>({});

	const [identity, setIdentity] = useState<any>({});
	const [selectedRole, setSelectedRole] = useState<any>(
		(!ISSERVER && localStorage.getItem('selectedRole')) || null
	);

	const [shadowToken, setShadowToken] = useState<any>((!ISSERVER && localStorage.getItem('shadowToken')) || null);

	const [permissionList, setPermissionList] = useState<any>(null);
	const [moduleList, setModuleList] = useState<any>(null);
	const [menuList, setMenuList] = useState<any>(null);

	const [selectedMain, setSelectedMain] = useState<string>();
	const [selectedSub, setSelectedSub] = useState<string>();
	const [headerTitle, setHeaderTitle] = useState<string>('Vinpro Connect');
	const [selectedModule, setSelectedModule] = useState<string>();

	const isAdmin = () => {
		if (directusRole && directusRole.name === "Administrator")
			return true;
		return false;
	};


	const setSelectedMenu = (main: any, sub: any) => {
		if (main !== selectedMain) {
			setSelectedMain(main);
		}
		//alert(sub)
		setSelectedSub(sub);
	};

	useEffect(
		() => {
			if (identity && identity.id) {
				setDirectusRole(identity.role);
				setSelectedRole(identity.role.name);
			}
		},
		[identity]
	);

	//Start shadowing
	const startShadowing = async (shadowToken: any) => {
		try{
		localStorage.removeItem('selectedRole');
		localStorage.setItem('shadowToken', shadowToken);
		localStorage.setItem('mainToken', await directusClient.auth.token);
		await directusClient.auth.static(shadowToken);
		//window.location.reload();
		window.location.href = "/customerlist";
		}catch(e){
			console.log(e);
		}
	};

	const stopShadowing = async () => {
		await directusClient.auth.static(localStorage.getItem('mainToken'));
		localStorage.removeItem('selectedRole');
		localStorage.removeItem('shadowToken');
		localStorage.removeItem('mainToken');
		//window.location.reload();
		window.location.href = "/customerlist";
	};


	const can = async ({ resource, action, params }) => {
		//console.log('can - ' + resource + ' - ' + action);
		//console.log('roles - ', params && params.roles);
		//console.log('directusRole - ', directusRole && directusRole.name);
		//console.log(permissionList);

		if (action === 'edit') {
			action = 'update';
		}
		if (action === 'delete') {
			action = 'delete';
		}
		if (action === 'show') {
			action = 'read';
		}

		if (!params || !params.roles || (params && params.roles && params.roles.includes(directusRole.name)))
		{
			return Promise.resolve({ can: true });
		}else {
			return Promise.resolve({ 
				can: false,
				reason: 'Unauthorized action.'
			});
		}
	};

	return {
		identity,
		setIdentity,
		selectedMain,
		setSelectedMain,
		selectedSub,
		setSelectedSub,
		setSelectedMenu,
		headerTitle,
		setHeaderTitle,
		selectedRole,
		setSelectedRole,
		can,
		permissionList,
		directusRole,
		setDirectusRole,
		shadowToken,
		setShadowToken,
		startShadowing,
		stopShadowing,
		isAdmin,
		setSelectedModule,
    	selectedModule
	};
}
