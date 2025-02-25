import React, { useEffect, useState } from "react";
import { CrudFilters, useTranslate } from "@refinedev/core";
import {
  Edit,
  useDrawerForm,
  useSelect,
} from "@refinedev/antd";
import {
  Form,
  Drawer,
  Select,
  InputNumber,
  Switch,
} from "antd";
import FormIconInput from "@components/Inputs/FormIconInput";
import { commonServerSideProps } from "src/commonServerSideProps";
import { MediaConfig, mediaUploadMapper, useDirectusUpload } from "@tspvivek/refine-directus";
import { directusClient } from "src/directusClient";

export const getServerSideProps = commonServerSideProps;

type CreateDrawerProps = {
  callback: (status: string) => void;
  visible: boolean;
  editData: any;
};

const EditExtra: React.FC<CreateDrawerProps> = ({ callback, visible, editData}) => {
    
    const mediaConfigList: MediaConfig[] = [{ name: "image", multiple: false, maxCount: 1 }];
    const t = useTranslate();
    const getUploadProps = useDirectusUpload(mediaConfigList, directusClient);
     const [formdata, setFormData] = useState<any>({});

  // Edit Drawer
  const { drawerProps, formProps,queryResult, saveButtonProps,setId,show, close } =
    useDrawerForm({
      mutationMode: "pessimistic",
      onMutationSuccess: (data) => {
        callback("success");
      },         
      action: "edit" ,   
      resource: "fooditemsextras",
      metaData: {
        fields: ["price","fooditemsextras.name","isactive"],
        },
      redirect: false,
      queryOptions: editData?.id,
      successNotification: (data) => {
        return {
          message: t("successfullyedited"),
          description: t("successfull"),
          type: "success",
        };
      },
    });

    const { selectProps: extrasProps } =
    useSelect({
      resource: "extras",
      optionLabel: "name",
      optionValue: "id",
      onSearch: (params: any) => {
        const filters: CrudFilters = [];

        filters.push({
          field: "search",
          operator: "contains",
          value: params,
        });
        return filters;
      },
        pagination:
        {
           pageSize:20,
       },
      sorters: [
        {
          field: "name",
          order: "asc",
        },
      ],
    });
    
  useEffect(() => {
    if (visible) {
      show();
    } else {
      close();
    }
  }, [visible]);

  useEffect (()=>{
    if(editData?.id){
      setId(editData?.id)
    }

  },[editData])

  const {data,isLoading } = queryResult;
  const record = data?.data;

  const extrasalloptions = [...(extrasProps?.options || []), {label:editData?.extrasname,value:editData?.extrasid}];

    
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
               headerProps={{ extra: false, title: t("editaddons") ,
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
                label={t("addonsname")}
                name={"extras"}
                rules={[{ required: true, message: t("enteraddonsname") }]}
                children={<Select allowClear {...extrasProps} options={extrasalloptions} />}
                icon={"DiffOutlined"}
              />

            <FormIconInput
                label={t("price")}
                name={"price"}
                children={<InputNumber min={0} style={{ width: "100%" }} />}
                icon={"DiffOutlined"}
            />

        <FormIconInput
            label={t("isactive")}
            name={"isactive"}
            children={<Switch defaultChecked={record?.isactive} checkedChildren="Yes" unCheckedChildren="No" />}
            icon={"CheckCircleOutlined"}
          />
          
        </Form>
      </Edit>
    </Drawer>
  );
};

export default EditExtra;
