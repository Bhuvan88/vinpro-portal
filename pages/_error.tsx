import { Button, Result } from 'antd';
import NextRouter from '@refinedev/nextjs-router';
const { Link } = NextRouter;

function Error({ statusCode }) {
	//Key value pair of messages to be displayed in the error page
	const errorMessages = {
		403: 'Sorry, you are not authorized to access this page.',
		404: 'Sorry, the page you visited does not exist.',
		500: 'Sorry, something went wrong.',
		default: 'An unexpected error has occurred'
	};

	return (
		<Result
			status={statusCode}
			title={statusCode}
			subTitle={errorMessages[statusCode] ? errorMessages[statusCode] : errorMessages['default']}
			extra={
				<Link to="/">
					<Button type="primary">Back Home</Button>
				</Link>
			}
		/>
	);
}

Error.getInitialProps = ({ res, err }) => {
	const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
	return { statusCode };
};

export default Error;
