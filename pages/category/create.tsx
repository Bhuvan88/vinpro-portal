import React, { useEffect, useState } from "react";
import { useApiUrl, useTranslate } from "@refinedev/core"
import {
  Create,
  useDrawerForm,
} from "@refinedev/antd";
import {
  Form,
  Input,
  Drawer,
  Switch,
  InputNumber,
} from "antd";
import FormIconInput from "@components/Inputs/FormIconInput";
import { useTeam } from "src/teamProvider";
import { commonServerSideProps } from "src/commonServerSideProps";

export const getServerSideProps = commonServerSideProps;

type CreateDrawerProps = {
  callback: (status: string) => void;
  visible: boolean;
};

const CreateCategory: React.FC<CreateDrawerProps> = ({ callback, visible }) => {
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const { identity } = useTeam();
  const [formdata, setFormData] = useState<any>({});

  // Create Drawer
  const { drawerProps, formProps, saveButtonProps, show, close } =
    useDrawerForm({
      mutationMode: "pessimistic",
      onMutationSuccess: (data) => {
        callback("success");
      },
      action: "create",
      resource: "category",
      redirect: false,
      successNotification: (data) => {
        return {
          message: t("successfullycreated"),
          description: t("successfull"),
          type: "success",
        };
      },
    });

  useEffect(() => {
    if (visible) {
      show();
    } else {
      close();
    }
  }, [visible]);

  const defaultMapper = (params: any) => {

    params['category'] = [ {'category_id': {'id' : params['category'] }}];
    console.log('params', params);
    var obj = {};
    obj["merchant"] = { id: identity?.merchant?.id };

    return {
      ...obj,
      ...params,
    };
  };

  return (
    <Drawer
      {...drawerProps}
      onClose={() => {
        callback("close");
      }}
      width={400}
    >
      <Create saveButtonProps={saveButtonProps} goBack
          headerProps={{ extra: false, title: t("create"), className: 'drawer-body' }}
      >
        <Form
          {...formProps}
          layout="vertical"
          onFinish={(values) => {
            return (
              formProps.onFinish && formProps.onFinish(defaultMapper(values))
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
              {
                required: true,
                whitespace: true,
                message: t("entercategoryname"),
              },
            ]}
            children={<Input />}
            icon={"DiffOutlined"}
          />

          <FormIconInput
            label={t("iscommission?")}
            name={"iscommission"}
            children={<Switch checkedChildren="Yes" unCheckedChildren="No" />}
            icon={"DollarOutlined"}
          />

          {formdata && formdata?.iscommission && ( 
            <FormIconInput
              label={t("commissionprice")}
              name={"commission"}
              children={<InputNumber min={0} style={{width:"100%"}} />}
              icon={"DiffOutlined"}
            />
           )}

        </Form>
      </Create>
    </Drawer>
  );
};

export default CreateCategory;
