import { useTranslate } from "@refinedev/core";
import { useShow } from "@refinedev/core";
import TextField from "@components/fields/TextField";
import DateTextField from "@components/fields/DateTextField";
import { Table } from "antd";
import { Show } from "@refinedev/antd";
import { commonServerSideProps } from "src/commonServerSideProps";

export const getServerSideProps = commonServerSideProps;

const CuisineShow: React.FC<any> = ({ id }) => {
  const t = useTranslate();

  // Fetch details
  const { queryResult } = useShow<any>({
    resource: "price_list",
    id,
    metaData: {
      fields: ["title", "details", "date_created", "date_updated"],
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
      title: "Label",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
    },
  ];

  return (
    <Show title="Price List" isLoading={isLoading}>
      {/* Title */}
      <TextField icon="UserOutlined" label="Title" textValue={record?.title} />

      {/* Details in Table Format */}
      <div className="view-info-card">
        <Table 
          dataSource={details} 
          columns={columns} 
          pagination={false} 
          rowKey={(record, index) => index} 
          bordered
        />
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
