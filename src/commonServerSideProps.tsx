import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import authProvider from 'src/authProvider';
import { checkAuthentication } from '@refinedev/nextjs-router/legacy';

export const commonServerSideProps: GetServerSideProps = async (context) => {
	const { isAuthenticated, ...props } = await checkAuthentication(authProvider, context);

	const i18nProps = await serverSideTranslations(context.locale ? context.locale : 'en', [ 'common' ]);

	const { query } = context;
	
	if (!isAuthenticated) {
		return { props: { ...props, ...i18nProps } };
	}


	try {
		const data = query;

		return {
			props: {
				initialData: data,
				...i18nProps
			}
		};
	} catch (error) {
		return {
			props: {
				...i18nProps
			}
		};
	}
};
