import {
    useTranslate,
    CrudFilters,
    useApiUrl
  } from "@refinedev/core";  
  import {
    CreateButton,
    useTable,
    TextField,
    useSelect,
    DateField,
    ImageField
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
  import DriverCreate from "./create";
  import DriverEdit from "./edit";
  import DriverShow from "./show";
import DriverPassword from "./editpassword";
  
  export const getServerSideProps = commonServerSideProps;
  
  const DriverList: React.FC<any> = ({ initialData }) => {
    const t = useTranslate();
    const { setSelectedMenu, setHeaderTitle, identity, isAdmin } = useTeam();
    const [showCreateDrawer, setShowCreateDrawer] = useState(false);
    const [showEditDrawer, setShowEditDrawer] = useState(false);
    const [editId, setEditId] = useState(null);
    const [ showDrawer, setShowDrawer] = useState<boolean>(false);
    const apiUrl = useApiUrl();
    useEffect(() => {
      setSelectedMenu("/team", "/team");
      setHeaderTitle("Team Members");
    }, []);
  
    const { tableProps, tableQueryResult,  searchFormProps } =
      useTable({
        resource: "team_members",
        syncWithLocation: true,
        pagination: {             
          pageSize:20
        },
        queryOptions: {
          initialData,       
        },
        metaData: {
          fields: ["id","image","first_name","last_name","email","date_created","status","description","designation"]
          
        },
        
        filters:{
          initial: [
            
            {
              field: "status",
              operator: "eq",
              value: "active",
            }
          ],
        },
                          
        onSearch: (params: any) => {
          const filters: CrudFilters = [];
          const { search,city,status } = params;

  
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
       
      });

      // const { selectProps: CityProps } = useSelect({
      //   resource: "city",
      //   optionLabel: "name",
      //   optionValue: "id",
      //   sorters: [
      //       {
      //           field: "name",
      //           order: "asc",
      //       }
      //   ],
      //   filters: [
      //     {
      //         field: "name",
      //         operator:  "ne",
      //         value:"Namakkal"
      //     },
      //   ],
      //   pagination:{
      //     pageSize:-1
      //   },
      // });
  
    const createCallback = (status) => {
      if (status === "success") {
        setShowCreateDrawer(false);
        tableQueryResult.refetch();
      }
      if (status === "error") {
        setShowCreateDrawer(false);
      }
      if (status === "close") {
        setShowCreateDrawer(false);
      }
    };
  
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
             Team Members
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
            {/* <Form.Item name="city" className="card-search mt-20 ml-10">
              <Select allowClear placeholder={t("selectcity")} {...CityProps} style={{width:180}}/>
            </Form.Item> */}

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
  
          <div style={{ marginRight: 30 }}>
            <CreateButton
              onClick={() => setShowCreateDrawer(true)}
              type="primary"
              className="mr-5"
            >
              {t("new")}
            </CreateButton>
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
                    width={100}
                    dataIndex="image"
                    key="image"
                    title={t("image")}
                    render={(value: any) => (
                      <ImageField
                        value={apiUrl + "assets/" + value}
                        width={40}
                        height={40}
                        style={{ objectFit: "cover" }}
                      />
                    )}
                   
                    //sorter
                  />
         <Table.Column
          width={150}
          dataIndex="first_name"
          key="firstname"
          title={t("firstname")}
          render={(value) => <TextField value={value} />}               
        />

        <Table.Column
          width={150}
          dataIndex="last_name"
          key="lastname"
          title={t("lastname")}
          render={(value) => <TextField value={value} />}               
        />
        
        <Table.Column
          width={150}
          dataIndex="designation"
          key="designation"
          title="Designation"
          render={(value) => <TextField value={value} />}               
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
         
        
         
          <Table.Column<any>
            width={100}
            title={t("actions")}
            dataIndex="actions"
            render={(_, record) => (
              <Space>
                <div
                  className="actionBtn"
                  onClick={(): void => {
                    setEditId(record.id);
                    setShowEditDrawer(true);
                  }}
                >
                  <CustomIcon type="FormOutlined" />
                </div>
               
              </Space>
            )}
          />
        </Table>
  
        {showCreateDrawer && (
           <DriverCreate callback={createCallback} visible={showCreateDrawer} />
        )}
        {showEditDrawer && (
        <CustomDrawer
          callback={editCallback}
          visible={showEditDrawer}
          resource={"team_members"}
          permissionResource={"team_members"}
          module={"administration"}
          id={editId}
          viewProps={<DriverShow id={editId} />}
          editProps={<DriverEdit id={editId} callback={editCallback} visible={false} />}
          
        />
      )}    
       
      </>
    );
  };
  
  export default DriverList;
  