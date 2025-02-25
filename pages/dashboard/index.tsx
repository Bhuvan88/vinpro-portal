import {
  IResourceComponentsProps,
  useTranslate,
} from "@refinedev/core";

import {
  Card,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";

import { commonServerSideProps } from "src/commonServerSideProps";
import { useTeam } from "src/teamProvider";

export const getServerSideProps = commonServerSideProps;

const CuisineList: React.FC<IResourceComponentsProps> = ({ initialData }) => {

  const t = useTranslate();
  const { setSelectedMenu, setHeaderTitle } = useTeam();

  useEffect(() => {
    setSelectedMenu("/orders", "/dashboard");
    setHeaderTitle(t("dashboard"));
  }, []);

  
  return (
    <>
       <div className="card-container">
        <Card  style={{ alignItems: "center", width:'100%' }}>
          <Typography.Title level={5} className="headTitle">
            {t("dashboard")}
          </Typography.Title>
          {/* <Form
            layout="vertical"
            {...searchFormProps}
            onValuesChange={() => {
              searchFormProps.form?.submit();
            }}
          >
            <Form.Item name="search" className="card-search mt-20 ml-10">
              <Input
                className="search-input"
                placeholder={t("search")}
                prefix={<CustomIcon type="SearchOutlined" />}
              />
            </Form.Item>
          </Form> */}
        </Card>
      </div>

      <div style={{ width:'100%', textAlign: "center", marginTop:'20%' }}> 
          <Typography.Title level={5}>
           {t("comingsoon")}
          </Typography.Title>
       </div>   
    </>
  );
};

export default CuisineList;
