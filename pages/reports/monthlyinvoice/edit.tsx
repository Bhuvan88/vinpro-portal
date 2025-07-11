import React, {  } from "react";
import { useApiUrl, useTranslate } from "@refinedev/core";
import {
  Edit,
  useForm,
} from "@refinedev/antd";
import {
  Form,
  Input,
  Drawer,
  DatePicker,
  InputNumber
} from "antd";
import { commonServerSideProps } from "src/commonServerSideProps";
import dayjs from "dayjs";
import FormIconInput from "@components/Inputs/FormIconInput";

export const getServerSideProps = commonServerSideProps;

type EditProps = {
  callback: (status: string) => void;
  id: string;
  visible:boolean;
  record:any;
};

export const EditInvoice: React.FC<EditProps> = ({ callback,visible, record }) => {
    const t = useTranslate();
    const apiUrl = useApiUrl();
    console.log('record -->', record);
  
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
        action: "edit",
        id: record?.id,
        resource: "invoice",
        metaData: {
          fields: ["*", ]
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
    
      const { data, isLoading } = queryResult;

      const disabledDate = (current) => {
        return current && current < dayjs().startOf('day');
      };

    return (
        <Drawer
         open={visible}
         onClose={() => { callback('close'); }}>
       <Edit
            saveButtonProps={saveButtonProps}           
            headerProps={{ extra: false, title:record?.merchant?.name, className: "drawer-body" }}
            isLoading={isLoading}          
       >     
        <Form
        {...formProps}
        layout="vertical"
        form={form}
        onFinish={(values) => {
            return (
                formProps.onFinish && formProps.onFinish(values)
            );
        }}
        initialValues={{
            invoicedate: dayjs(record?.invoicedate).format("YYYY-MM-DD"),
            entryfee:record?.entryfee,
            advertsfee:record?.advertsfee,
            catering:record?.catering,
            otherfee:record?.otherfee,

        }}
        >        

        <Form.Item
            label={t("invoicedate")}
            name={"invoicedate"}
            rules={[{ required: true, message: t("enterdate") }]}   
            className="mb-10"  
            getValueProps={(value) => ({
              value: value ? dayjs(value, "YYYY-MM-DD") : "",
            })}
            normalize={(value) => {
              return value ? dayjs(value).format("YYYY-MM-DD") : "";
            }}     
        >
            <DatePicker
                format={"YYYY-MM-DD"}
                disabledDate={disabledDate}             
                style={{ width: '100%' }}
                placeholder={t("selectdate")}              
           />
        </Form.Item>

        
        <FormIconInput
            label={t("startavgift")}
            name="entryfee"
            rules={[{ required: true, message: t("enterstartavgift") }]}
            children={<InputNumber min={0} style={{ width: "100%" }}/>}
        />
        
        <FormIconInput
            label={t("annonsavgift")}
            name="advertsfee"
            rules={[{ required: true, message: t("enterannonsavgift") }]}
            children={<InputNumber min={0} style={{ width: "100%" }} />}
        />
        

        <FormIconInput
            label={t("catering")}
            name="catering"
            rules={[{ required: true, message: t("entercatering") }]}
            children={<InputNumber min={0} style={{ width: "100%" }} />}
        />
       

       <FormIconInput
            label={t("otherfee")}
            name="otherfee"
            rules={[{ required: true, message: t("enterotherfee") }]}
            children={<InputNumber min={0} style={{ width: "100%" }} />}
       />
        

        <FormIconInput
            label={t("otherfeename")}
            name="otherfeename"
            //rules={[{ required: true, message: t("enterotherfeename") }]}
            children={<Input/>}
        />
       


        {/* <Form.Item>
            <Button type="primary" htmlType="submit">
            {t("save")}
            </Button>
        </Form.Item> */}
        </Form>
        </Edit>
        </Drawer>
    );
    };

export default EditInvoice;
