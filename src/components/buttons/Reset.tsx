import React from 'react';
import { Button, FormProps } from "antd";
import { useTranslate } from '@refinedev/core';

export declare type ResetProps = {
	inputProps?: any;
	formProps: FormProps
};

const ResetButton: React.FC<ResetProps> = ({ formProps, inputProps }) => {
	const t= useTranslate();
	const onReset = () => {
		formProps.form.resetFields();
	};

	return (
		<Button htmlType="button" onClick={onReset} {...inputProps}>
			{t("reset")}
		</Button>

	);
};

export default ResetButton;
