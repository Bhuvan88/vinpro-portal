import { useTranslate } from "@refinedev/core";
import { useShow } from "@refinedev/core";
import TextField from "@components/fields/TextField";
import DateTextField from "@components/fields/DateTextField";
import { Table } from "antd";
import { Show } from "@refinedev/antd";
import { commonServerSideProps } from "src/commonServerSideProps";
import { List, Divider } from "antd";

export const getServerSideProps = commonServerSideProps;

const CuisineShow: React.FC<any> = ({ id }) => {
  const t = useTranslate();

  // Fetch details
  const { queryResult } = useShow<any>({
    resource: "price_list",
    id,
    metaData: {
      fields: [
        "title",
        "pricetitle",
        "price",
        "details",
        "buttontext",
		    "buttonlink",
        "date_created",
        "date_updated",
      ],
    },
  });

  const { data, isLoading } = queryResult;
  const record = data?.data;

  // Ensure details are properly parsed
  let details = [];
  try {
    details = record?.details ? JSON.parse(record.details) : [];
  } catch (error) {
    console.error("Error parsing details:", error);
  }

  // Table Columns
  const columns = [
    {
      title: "Price Details",
    },
  ];

  return (
    <Show title="Price List" isLoading={isLoading}>
      {/* Title */}
      <TextField
        icon="UserOutlined"
        label="Name"
        textValue={record?.title}
      />
      <TextField
        icon="DollarOutlined"
        label="Title"
        textValue={record?.pricetitle}
      />
      <TextField
        icon="DollarOutlined"
        label="Price"
        textValue={record?.price}
      />

      {/* Details in Table Format */}
      <div className="view-info-card">
        <Divider orientation="left">Description</Divider>
        <List
          size="large"
          bordered
          dataSource={details}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />

      <TextField
        icon="UserOutlined"
        label="Button Text"
        textValue={record?.buttontext}
      />
      <TextField
        icon="DollarOutlined"
        label="Button Link"
        textValue={record?.buttonlink}
      />

        {/*  <Table 
          dataSource={details} 
          columns={columns} 
          pagination={false} 
          rowKey={(record, index) => index} 
          bordered
        />
        */}
      </div>

      {/* Date Created */}
      <div className="view-info-card">
        <DateTextField
          icon={undefined}
          label={t("datecreated")}
          format={"MMM DD, YYYY HH:mm"}
          textValue={record?.date_created}
        />
      </div>
    </Show>
  );
};

export default CuisineShow;
