import { useShow, useTranslate } from "@refinedev/core";
import TextField from "@components/fields/TextField";
import DateTextField from "@components/fields/DateTextField";
import { Show } from "@refinedev/antd";
import { commonServerSideProps } from 'src/commonServerSideProps';

import ImageTextField from "@components/fields/ImageTextField";
export const getServerSideProps = commonServerSideProps;

const DriverShow: React.FC<any> = ({ id }) => {
const t = useTranslate();
  // Show Drawer
  const { showId, setShowId, queryResult } = useShow<any>({
    resource: "team_members",
    id: id,
    metaData: {
      fields: ["first_name","last_name","email","date_created","date_updated","status","image.*","description","designation"]
    },
  });

  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show
      title="Team Members"
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
        icon="UserOutlined"
        label={"Designation"}
        textValue={record?.designation}
      />


     <ImageTextField
        icon="PictureOutlined"
        label="Image"
        imageValue={record?.image?.id}
        size={70}
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
      
      <TextField
        icon="LockOutlined"
         label="Description"
        textValue={record?.description}
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

export default DriverShow;
