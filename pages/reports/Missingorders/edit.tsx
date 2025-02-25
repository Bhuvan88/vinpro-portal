import React, { useState } from "react";
import { useApiUrl, useTranslate } from "@refinedev/core";
import {
  Edit,
  useForm,
} from "@refinedev/antd";
import {
    Form,
    Select,
    Drawer
  } from "antd";
import { commonServerSideProps } from "src/commonServerSideProps";
export const getServerSideProps = commonServerSideProps;

type EditProps = {
  callback: (status: string) => void;
  id: string;
  visible:any;   
  record:any; 
};

export const EditMissingStatus: React.FC<EditProps> = ({ callback,visible, record }) => {
    const t = useTranslate();
    const apiUrl = useApiUrl();
    
    console.log('record -->', record);
    console.log('paymentstatus -->', record?.paymentstatus);

    const StatusArray=[
        { label: t("paid"), value: 'paid' },
        { label: t("pending"), value: 'pending' },       
        { label: t("rejected"), value: 'rejected' }, 
        { label: t("cancelled"), value: 'cancelled' },      
    ];

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
        resource: "orders",
        metaData: {
          fields: ["id","merchant.name","merchant_mins","merchant.id","referenceno","customername","price","paymentstatus"],
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

      const defaultMapper = (params: any) => {             
         if (params?.merchantorderstatus == "accepted")
          {
            params["merchant_mins"] = params?.merchant_mins;
          }
          else
            {
              params["merchant_mins"] = null;
            }
        return {
          ...params,
        };
      };


      const price = record?.price;
      const processingFee = record?.orderdata?.processingfee;
      const total = price + processingFee;

    return (
        <Drawer
         open={visible}
       // title={"Change Order Status"}
         onClose={() => { callback('close'); }}>
       <Edit
            saveButtonProps={saveButtonProps}           
            headerProps={{ extra: false, title: t("changeorderstatus"), className: "drawer-body" }}
            isLoading={isLoading}          
       >     
        <Form
        {...formProps}
        layout="vertical"
        form={form}
        onFinish={(values) => {       
            return (
                formProps.onFinish && formProps.onFinish(defaultMapper(values))
            );
        }}
        >
            {/* display order id  and order price */}
            <div>
                <p>{t("referenceno")} : <span style={{color:'#000',fontWeight:'bold'}}>{record?.referenceno}</span></p>
                <p>{t("customer")} : <span style={{color:'#000',fontWeight:'bold'}}>{record?.customername}</span></p>
                <p>{t("orderprice")} : <span style={{color:'#000',fontWeight:'bold'}}>{total} kr</span></p>
            </div>


        <Form.Item
            label={t("status")}
            name="paymentstatus"
            rules={[{ required: true }]}
        >
            <Select 
                options={StatusArray.map((item)=>({label:item.label,value:item.value}))}
                defaultValue={record?.paymentstatus}            
            />
        </Form.Item>

        </Form>
        </Edit>
        </Drawer>
    );
    };

export default EditMissingStatus;
