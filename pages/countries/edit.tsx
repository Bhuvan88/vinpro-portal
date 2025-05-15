import React, { useEffect, useState } from "react";
import { useApiUrl, useTranslate } from "@refinedev/core";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Upload, Select, Descriptions } from "antd";
import { commonServerSideProps } from "src/commonServerSideProps";
import FormIconInput from "@components/Inputs/FormIconInput";
import {
  getValueProps,
  MediaConfig,
  mediaUploadMapper,
  useDirectusUpload,
} from "@tspvivek/refine-directus";
import { directusClient } from "src/directusClient";
import { CustomIcon } from "@components/datacomponents/CustomIcon";

export const getServerSideProps = commonServerSideProps;

type EditProps = {
  callback: (status: string) => void;
  id: string;
  editData: any;
};
const CountryEdit: React.FC<EditProps> = ({ callback, id, editData }) => {
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const { TextArea } = Input;
  const mediaConfigList: MediaConfig[] = [
    { name: "image", multiple: false, maxCount: 1 },
  ];
  const getUploadProps = useDirectusUpload(mediaConfigList, directusClient);
  const [formdata, setFormData] = useState<any>({});

  // Edit Drawer
  const {
    formProps,
    saveButtonProps,
    queryResult,
    id: editId,
    setId,
    form,
  } = useForm<any>({
    mutationMode: "pessimistic",
    onMutationSuccess: (data) => {
      callback("success");
    },
    id: id,
    action: "edit",
    resource: "countries",
    metaData: {
      fields: ["name", "image.*", "description", "currency.id", "currency.name","currencynew.*"]
    },
    redirect: false,
    //queryOptions: editData?.id,
    warnWhenUnsavedChanges: true,
    successNotification: (data) => {
      return {
        message: t("successfullyedited"),
        description: t("successfull"),
        type: "success",
      };
    },
  });

  const { data, isLoading } = queryResult;
  const record = data?.data;
  console.log('record>>', record);

  const defaultMapper = (params: any) => {
    mediaUploadMapper(params, mediaConfigList);
    if(params["currencynew"] && params["currencynew"].length > 0){
      let currencynew = [];
      params["currencynew"].map((item: any) => {
        currencynew.push({countries_id: record?.id, currency_id:{id:item}})
        // recommended_category.push({fooditems_id:fooditemId, category_id:{id:item}})
        // recommended_category.push({fooditems_id:fooditemId, category_id:{id:item}})
      });
      if(record.currencynew.length>0){
        let currencynew_delete_id = [];
        record.currencynew.map((item: any) => {
          currencynew_delete_id.push(item?.id)
        });
        params["currencynew"] = {create: currencynew, delete: currencynew_delete_id}
          //params["currencynew"] = {update: currencynew}
      }else{
          params["currencynew"] = {create: currencynew}
      }


      // if(record?.recommended_category.length > 0){
      //   let recommended_delete_id = [];
      //   record?.recommended_category.map((item: any) => {
      //     recommended_delete_id.push(item?.id)
      //   });
      //   params["recommended_category"] = {create: recommended_category, delete: recommended_delete_id}
      //     //params["recommended_category"] = {update: recommended_category}
      // }else{
      //     params["recommended_category"] = {create: recommended_category}
      // }
      //params["currencynew"] = currencynew;
      }
    if (params?.image) {
      params["image"] = params?.image;
    } else {
      params["image"] = null;
    }
    return {
      ...params,
    };
  };

  const { selectProps: currencyProps } = useSelect({
        resource: "currency",
        optionLabel: "name",
        optionValue: "id",
        sorters: [
          {
            field: "name",
            order: "asc",
          },
        ],
    
        pagination: {
          pageSize: -1,
        },
      });

    /*  useEffect (()=>{
        if(editData?.id){
          setId(editData?.id)
        }
      },[editData])*/

      const extrasalloptions = [...(currencyProps?.options || []), {label:editData?.name,value:editData?.id}];

  return (
    <Edit
      saveButtonProps={saveButtonProps}
      headerProps={{ extra: false, title: false, className: "drawer-body" }}
      isLoading={isLoading}
    >
      <Form
        {...formProps}
        layout="vertical"
        //form={form}
        onFinish={(values) => {
          return (
            formProps.onFinish && formProps.onFinish(defaultMapper(values))
          );
        }}
        onValuesChange={(changedValues, allValues) => {
          setFormData(allValues);
        }}
         initialValues={{
          name: record?.name,
          description : record?.description,
          // currency: record?.currency,
          image: record?.image,
          currencynew: record?.currencynew?.map((Item:any) =>Item.currency_id),

        }} 
      >

{/* {currencynew: {create: [{countries_id: "8", currency_id: {id: 4}}], update: [], delete: []}}
currencynew
: 
{create: [{countries_id: "8", currency_id: {id: 4}}], update: [], delete: []} */}
        <FormIconInput
          label="Name"
          name={"name"}
          rules={[{ required: true, message: "Please enter name" }]}
          children={<Input />}
          icon={"UserOutlined"}
        />

        <FormIconInput
          label={"Currency"}
          name={"currencynew"}
          children={<Select mode="multiple" allowClear {...currencyProps} options={extrasalloptions}/>}
          icon={"DiffOutlined"}
          /* formItemProps={{ getValueProps:(value)=> ({value:value?.map((Item:any) =>Item.id)}),
                            normalize: (value, prevValue, allValues) =>{return value.id}
          }} */
        />
        
        
        <FormIconInput
          label="Description"
          name={"description"}
          children={<TextArea />}
          icon={"DollarOutlined"}
        />

        <div className="icon-input-field">
          <CustomIcon
            type={"PictureOutlined"}
            styleProps={{ style: { fontSize: 20, marginTop: 15 } }}
          />
          <Form.Item label={t("image")}>
            <Form.Item
              name="image"
              valuePropName="fileList"
              getValueProps={(data) =>
                getValueProps({
                  data,
                  imageUrl: apiUrl,
                })
              }
              noStyle
              rules={[
                {
                  required: true,
                  message: "Image is required",
                },
              ]}
            >
              <Upload.Dragger
                name="file"
                listType="picture"
                multiple={false}
                beforeUpload={() => false}
                {...getUploadProps("image")}
              >
                <p className="ant-upload-text">
                  {t("drag&dropafileinthisarea")}
                </p>
              </Upload.Dragger>
            </Form.Item>
          </Form.Item>
        </div>
      </Form>
    </Edit>
  );
};

export default CountryEdit;
