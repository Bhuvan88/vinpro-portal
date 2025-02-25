import { useShow, useTranslate } from "@refinedev/core";
import TextField from "@components/fields/TextField";
import DateTextField from "@components/fields/DateTextField";
import { Show } from "@refinedev/antd";
import { commonServerSideProps } from 'src/commonServerSideProps';


export const getServerSideProps = commonServerSideProps;

const UserShow: React.FC<any> = ({ id }) => {
const t = useTranslate();
  // Show Drawer
  const {  queryResult } = useShow<any>({
    resource: "directus_users",
    id: id,
    metaData: {
      fields: ["id","merchant.id","merchant.name","first_name","last_name","email","date_created","date_updated","status"],
    },
  });

  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show
      title={t("owner")}
      headerProps={{
        extra: false,
      }}
      isLoading={isLoading}
    >

    <TextField
        icon="UserOutlined"
        label={t("firstname")}
        textValue={record?.first_name}
      />

    <TextField
        icon="UserOutlined"
        label={t("lastname")}
        textValue={record?.last_name}
      />

      <TextField
        icon="ShopOutlined"
        label={t("merchant")}
        textValue={record?.merchant?.name}
      />
      
      <TextField
        icon="MailOutlined"
        label={t("email")}
        textValue={record?.email}
      />

      <TextField
        icon="QuestionCircleOutlined"
        label={t("Status")}
        textValue={t(record?.status)}
      />
  

    <DateTextField
        icon={"CalendarOutlined"}
        label={t("datecreated")}
        format={"MMM DD, YYYY HH:mm"}
        textValue={record?.date_created}
      />
      <DateTextField
        icon={"CalendarOutlined"}
        label={t("dateupdated")}
        format={"MMM DD, YYYY HH:mm"}
        textValue={record?.date_updated}
      />
      
    </Show>
  );
};

export default UserShow;
