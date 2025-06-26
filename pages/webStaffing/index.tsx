import { Tabs, Breadcrumb } from "antd";
import { useRouter } from "next/router";
import Section1 from "../../src/components/websettings/staffing/section";
import Section2 from "../../src/components/websettings/staffing/section2";
import Section3 from "../../src/components/websettings/staffing/section3";
import Section4 from "../../src/components/websettings/staffing/section4";
import Section5 from "../../src/components/websettings/staffing/section5";
import Section6 from "../../src/components/websettings/staffing/section6";
import { commonServerSideProps } from "src/commonServerSideProps";

export const getServerSideProps = commonServerSideProps;

const WebsettingsPage = () => {
  const router = useRouter();
  const sectionTitle = router.query.section_title || "StaffingSection1";

  const handleTabChange = (key: string) => {
    router.push({
      pathname: router.pathname,
      query: { section_title: key },
    });
  };

  const tabItems = [
    { key: "StaffingSection1", label: "Section 1" },
    { key: "StaffingSection2", label: "Section 2" },
    { key: "StaffingSection3", label: "Section 3" },
    { key: "StaffingSection4", label: "Section 4" },
    { key: "StaffingSection5", label: "Section 5" },
    // { key: "StaffingSection6", label: "Section 6" },
  ];

  return (
    <div>
      <Breadcrumb style={{ margin: "16px" }}>
        <Breadcrumb.Item
          className="clickable"
          onClick={() => router.push("/website-settings")}
        >
          Web Settings
        </Breadcrumb.Item>
        <Breadcrumb.Item>Staffing Solution</Breadcrumb.Item>
      </Breadcrumb>

      <Tabs
        activeKey={sectionTitle.toString()}
        onChange={handleTabChange}
        type="card"
        style={{ margin: 24 }}
        items={tabItems.map((item) => ({
          ...item,
          children: (() => {
            switch (item.key) {
              case "StaffingSection1":
                return <Section1 />;
              case "StaffingSection2":
                return <Section2 />;
              case "StaffingSection3":
                return <Section3 />;
              case "StaffingSection4":
                return <Section4 />;
                case "StaffingSection5":
                return <Section5 />;
                case "StaffingSection6":
                return <Section6 />;
              default:
                return null;
            }
          })(),
        }))}
      />
    </div>
  );
};

export default WebsettingsPage;
