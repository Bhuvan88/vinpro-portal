import React, { useEffect, useState } from "react";
import { useApiUrl, useTranslate } from "@refinedev/core";
import {
  Create,
  useDrawerForm,
} from "@refinedev/antd";
import {
  Form,
  Input,
  Drawer, 
} from "antd";
import FormIconInput from "@components/Inputs/FormIconInput";
import {
  getValueProps,
  MediaConfig,
  mediaUploadMapper,
  useDirectusUpload,
} from "@tspvivek/refine-directus";
import { directusClient } from "src/directusClient";
import { useTeam } from "src/teamProvider";
import { CustomIcon } from "@components/datacomponents/CustomIcon";
import { commonServerSideProps } from "src/commonServerSideProps";

export const getServerSideProps = commonServerSideProps;

type CreateDrawerProps = {
  callback: (status: string) => void;
  visible: boolean;
  editData: any;
};

const CreateCategory: React.FC<CreateDrawerProps> = ({ callback, visible,editData }) => {
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const { identity } = useTeam();
  const [formdata, setFormData] = useState<any>({});

  const mediaConfigList: MediaConfig[] = [
    { name: "image", multiple: false, maxCount: 1 },
  ];
  const getUploadProps = useDirectusUpload(mediaConfigList, directusClient);

  // Create Drawer
  const { drawerProps, formProps, saveButtonProps, show, close } =
    useDrawerForm({
      mutationMode: "pessimistic",
      onMutationSuccess: (data) => {
        callback("success");
      },
      action: editData ? "edit" : "create",
      resource: "extracategory",
      redirect: false,
      metaData: {
        fields: ["categoryname"],
      },
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
    mediaUploadMapper(params, mediaConfigList);

   // params['category'] = [ {'category_id': {'id' : params['category'] }}];
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
               headerProps={{ extra: false, title: editData ? t("editaddonscategory") : t("createaddonscategory"),
                className: 'drawer-body' }}
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
            name={"categoryname"}
            rules={[
              {
                required: true,
                whitespace: true,
                message: t("entercategoryname"),
              },
            ]}
            children={<Input defaultValue={editData?.categoryname} />}
            icon={"DiffOutlined"}
          />

        </Form>
      </Create>
    </Drawer>
  );
};

export default CreateCategory;
