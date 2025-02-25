import {
    useTranslate,
    CrudFilters,
  } from "@refinedev/core";  
  import {
    useTable,
    TextField,
    DateField,
  } from "@refinedev/antd";
  import {
    Table,
    Space,
    Typography,
    Form,
    Input,
    Select,
  } from "antd";
  import React, { useEffect, useState } from "react";
  import { CustomIcon } from "src/components/datacomponents/CustomIcon";
  import { commonServerSideProps } from "src/commonServerSideProps";
  import { useTeam } from "src/teamProvider";
  import CustomDrawer from "@components/datacomponents/CustomDrawer";
 import OwnerEdit from "./edit";
 import UserShow from "./show";
 import OwnerPassword from "./editpassword";
  
  export const getServerSideProps = commonServerSideProps;
  
  const OwnerList: React.FC<any> = ({ initialData }) => {
    const t = useTranslate();
    const { setSelectedMenu, setHeaderTitle } = useTeam();   
    const [showEditDrawer, setShowEditDrawer] = useState(false);
    const [editId, setEditId] = useState(null);
    const [ showDrawer, setShowDrawer] = useState<boolean>(false);

    useEffect(() => {
      setSelectedMenu("/driver", "/owner");
      setHeaderTitle(t("owner"));
    }, []);
  
    const { tableProps, tableQueryResult,  searchFormProps } =
      useTable({
        resource: "directus_users",
        syncWithLocation: true,
        pagination: {             
          pageSize:50
        },
        queryOptions: {
          initialData,       
        },
        metaData: {
          fields: ["id","merchant.id","merchant.name","first_name","last_name","email","status","date_created"],
          
        },
        
        filters:{
          initial: [
            {
              field: "role",
              operator: "eq",
              value: "c61fec11-9cee-4d59-8adf-dd31765bed2a",
            },
            {
              field: "status",
              operator: "eq",
              value: "active",
            }
          ],
        },
                          
        onSearch: (params: any) => {
          const filters: CrudFilters = [];
          const { search,status } = params;
  
          filters.push({
            field: "search",
            operator: "contains",
            value: search,
          });         

          filters.push({
            field: "status",
            operator: "eq",
            value:status,
          });
  
          return filters;
        },
        sorters:{
          initial: [
            {
              field: "date_created",
              order: "desc",
            },
          ]
        },
      });

    const editCallback = (status) => {
      if (status === "success") {
        setShowEditDrawer(false);
        tableQueryResult.refetch();
      }
      if (status === "error") {
        setShowEditDrawer(false);
      }
      if (status === "close") {
        setShowEditDrawer(false);
      }
      setShowDrawer(false);
      setEditId(undefined);
    };

    return (
      <>
      <Form
              layout="vertical"
              {...searchFormProps}
              onValuesChange={() => {
                searchFormProps.form?.submit();
              }}
            > 
        <div className="stickyheader">
          <div className="flex-row" style={{ alignItems: "center" }}>
            <Typography.Title level={5} className="headTitle">
              {t("owner")}
            </Typography.Title>
               
             <Form.Item name="search" className="card-search mt-20 ml-10">
                <Input
                  allowClear
                  style={{width:180}}
                  className="search-input"
                  placeholder={t("search")}
                  prefix={<CustomIcon type="SearchOutlined" />}
                />
            </Form.Item>

            <Form.Item name="status" className="card-search mt-20 ml-10" initialValue="active">
                  <Select 
                    allowClear
                    style={{width:150}}
                    placeholder={t("status")}
                    options={[
                      { label: t("active"), value:"active"},
                      { label: t("suspended"),value:"suspended"},                     
                    ]}                   
                   />
                </Form.Item>             
          </div>
         
        </div>
        </Form>

        <Table
          rowKey="id"
          {...tableProps}
          scroll={{ y: "calc(100vh - 220px)", x: "990px" }}
          pagination={{
            ...tableProps.pagination,
            ...{
              size: "small",
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${t("showing")} ${range[0]}-${range[1]} ${t("of")} ${total} ${t("items")}`,
            },
          }}
        >        

        <Table.Column
          width={150}
          dataIndex="first_name"
          key="first_name"
          title={t("name")}
          render={(value,record:any) => <><TextField value={record?.first_name}/>{" "}<TextField value={record?.last_name} /></>}               
        />

      <Table.Column
          width={150}
          dataIndex={["merchant","name"]}
          key="merchant"
          title={t("merchant")}
          render={(value) => <TextField value={value}/>}               
        />
              
          <Table.Column
            width={200}
            dataIndex="email"
            key="email"
            title={t("email")}
            render={(value) => <TextField value={value} />}               
         />

         <Table.Column
            width={100}
            dataIndex="status"
            key="status"
            title={t("status")}
            render={(value) => <TextField value={t(value)} style={{textTransform:"capitalize"}}/>}               
         />
         
          <Table.Column
              width={100}
              dataIndex="date_created"
              key="date_created"
              title={t("datecreated")}
              render={(value) => value && <DateField value={value} format="MMM DD, YYYY HH:mm" />}      
            />  
         
          <Table.Column<any>
            width={100}
            title={t("actions")}
            dataIndex="actions"
            render={(_, record) => (
              <Space>
                <div
                  className="actionBtn"
                  onClick={(): void => {
                    setEditId(record?.id);
                    setShowEditDrawer(true);
                    console.log("record", record);
                  }}
                >
                  <CustomIcon type="FormOutlined" />
                </div>
                <div
                  className="actionBtn"
                  onClick={(): void => { 
                    setEditId(record?.id);
                    setShowDrawer(true);  
                    console.log("record>>>>>.", record);               
                  }}
                >
                  <CustomIcon type="LockOutlined" />
                </div>
              </Space>
            )}
          />
        </Table>
            
        {showEditDrawer && (
        <CustomDrawer
          callback={editCallback}
          visible={showEditDrawer}
          resource={"directus_users"}
          permissionResource={"directus_users"}
          module={"administration"}
          id={editId}
          viewProps={<UserShow id={editId} />}
          editProps={<OwnerEdit id={editId} callback={editCallback} visible={false} />}
          hideDelete
        />
      )}  

       {editId && <OwnerPassword callback={editCallback} visible={showDrawer} id={editId}/>}
      </>
    );
  };
  
  export default OwnerList;
  