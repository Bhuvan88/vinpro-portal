import React, { useEffect, useState } from "react";
import { useTranslate } from "@refinedev/core";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Upload, InputNumber } from "antd";
import { commonServerSideProps } from 'src/commonServerSideProps';
import FormIconInput from "@components/Inputs/FormIconInput";

export const getServerSideProps = commonServerSideProps;

type EditProps = {
	callback: (status: string) => void;
	id: string;
};

const EditCategory: React.FC<EditProps> = ({callback, id}) => {
	const t = useTranslate();
	const [formdata, setFormData] = useState<any>({});

	// Edit Drawer
	const { formProps, saveButtonProps,queryResult, id: editId, setId } = useForm<any>({
		mutationMode: 'pessimistic',
		onMutationSuccess: (data) => {
			callback('success');
		},
		action: 'edit',
		resource: 'category',
		metaData: {
			fields: ["name","commission"],
		  },
		redirect: false,
		warnWhenUnsavedChanges: true,
		successNotification: (data) => {
			return {
			  message: t("successfullyedited"),
			  description: t("successfull"),
			  type: "success",
			};
		  },
	});

	const {isLoading } = queryResult;

	useEffect(
		() => {
			if (id) {
				setId(id);
			}
		},
		[ id ]
	);

	const defaultMapper = (params: any) => {
		return {
			...params
		};
	};

	return (
		<Edit
			saveButtonProps={saveButtonProps}
			headerProps={{ extra: false, title: false, className: 'drawer-body' }}
			isLoading={isLoading}
		>
			<Form {...formProps} layout="vertical"
			onFinish={(values) => {
				return (
					formProps.onFinish &&
					formProps.onFinish(defaultMapper(values))
				);
			}}
			onValuesChange={(changedValues, allValues) => {
				setFormData(allValues);
			}}
			>
				<FormIconInput 
					label={t("categoryname")}
					name={"name"}
					rules={[
						{ required: true, whitespace: true, message: t("entercategoryname")}
					]}
					children={<Input />} icon={"DiffOutlined"}  
				/>				

				<FormIconInput 
					label={t("commission")}
					name={"commission"}
					children={<InputNumber min={0} style={{ width: "100%" }} />} icon={"DollarOutlined"}  
				/>
								
			</Form>
		</Edit>
	);
};

export default EditCategory;