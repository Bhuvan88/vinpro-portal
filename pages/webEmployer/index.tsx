import { Tabs, Breadcrumb } from "antd";
import { useRouter } from "next/router";
import Section1 from "../../src/components/websettings/employer/section";
import Section2 from "../../src/components/websettings/employer/section2";
import Section3 from "../../src/components/websettings/employer/section3";
import Section4 from "../../src/components/websettings/employer/section4";
import Section5 from "../../src/components/websettings/employer/section5";
import Section6 from "../../src/components/websettings/employer/section6";
import { commonServerSideProps } from "src/commonServerSideProps";
import React, { useEffect, useState } from "react";
import { useTeam } from "src/teamProvider";

export const getServerSideProps = commonServerSideProps;

const WebsettingsPage = () => {
  const router = useRouter();
  const sectionTitle = router.query.section_title || "EmployerSection1";
  const { setSelectedMenu, setHeaderTitle, identity, isAdmin } = useTeam();

  useEffect(() => {
        setSelectedMenu("/website-settings", "/website-settings");
        setHeaderTitle("Website Settings");
  }, []);

  const handleTabChange = (key: string) => {
    router.push({
      pathname: router.pathname,
      query: { section_title: key },
    });
  };

  const tabItems = [
    { key: "EmployerSection1", label: "Section 1" },
    { key: "EmployerSection2", label: "Section 2" },
    { key: "EmployerSection3", label: "Section 3" },
    { key: "EmployerSection4", label: "Section 4" },
    { key: "EmployerSection5", label: "Section 5" },
    { key: "EmployerSection6", label: "Section 6" },
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
        <Breadcrumb.Item>Employer of Record</Breadcrumb.Item>
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
              case "EmployerSection1":
                return <Section1 />;
              case "EmployerSection2":
                return <Section2 />;
              case "EmployerSection3":
                return <Section3 />;
              case "EmployerSection4":
                return <Section4 />;
                case "EmployerSection5":
                return <Section5 />;
                case "EmployerSection6":
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
