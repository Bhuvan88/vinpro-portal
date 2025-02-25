import React, { useEffect, useState } from "react";
import { useApiUrl, useTranslate,useForm } from "@refinedev/core";
import {
  Edit,
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
import { commonServerSideProps } from "src/commonServerSideProps";

export const getServerSideProps = commonServerSideProps;

type CreateDrawerProps = {
  visible: boolean;
  editData: any;
  callback: (status: string) => void;
};

const ExtraCategory: React.FC<CreateDrawerProps> = ({ visible,editData,callback }) => {
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const { identity } = useTeam();
  const [formdata, setFormData] = useState<any>({});
  console.log('editDatadddd',editData); 
  console.log('visible',visible); 

  const mediaConfigList: MediaConfig[] = [
    { name: "image", multiple: false, maxCount: 1 },
  ];

  const getUploadProps = useDirectusUpload(mediaConfigList, directusClient);

  // Create Drawer
  const { drawerProps, formProps,queryResult, saveButtonProps } =
    useDrawerForm({
      mutationMode: "pessimistic",
      onMutationSuccess: (data) => {
        callback("success");
      },
      queryOptions: { enabled: editData?.id ? true : false },
      id:editData?.id,
      action: "edit" ,
      metaData: {
        fields: ["categoryname"],
      },
      resource: "extracategory",
      redirect: false,
      successNotification: (data) => {
        return {
          message: t("successfullyedited"),
          description: t("successfull"),
          type: "success",
        };
      },
   
    });

    const {isLoading}=queryResult;


  return (
    <Drawer
      {...drawerProps}
      open={visible}
      onClose={() => {
        callback("close");
      }}
      width={400}
    
    >
      <Edit saveButtonProps={saveButtonProps}
               headerProps={{ extra: false, title: t("editaddonscategory") ,
                className: 'drawer-body' }}
                isLoading={isLoading}
      >
        <Form
            {...formProps}
          layout="vertical"
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
            children={<Input />}
            icon={"DiffOutlined"}
          />

        
        </Form>
      </Edit>
    </Drawer>
  );
};

export default ExtraCategory;
