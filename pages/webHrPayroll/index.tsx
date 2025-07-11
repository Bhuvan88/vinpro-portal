import { Tabs, Breadcrumb } from "antd";
import { useRouter } from "next/router";
import Section1 from "../../src/components/websettings/hrpayroll/section";
import Section2 from "../../src/components/websettings/hrpayroll/section2";
import Section3 from "../../src/components/websettings/hrpayroll/section3";
import Section4 from "../../src/components/websettings/hrpayroll/section4";
import Section5 from "../../src/components/websettings/hrpayroll/section5";
import Section6 from "../../src/components/websettings/hrpayroll/section6";
import Section7 from "../../src/components/websettings/hrpayroll/section7";
import Section8 from "../../src/components/websettings/hrpayroll/section8";
import Section9 from "../../src/components/websettings/hrpayroll/section9";
import Section10 from "../../src/components/websettings/hrpayroll/section10";
import Section11 from "../../src/components/websettings/hrpayroll/section11";
import { commonServerSideProps } from "src/commonServerSideProps";
import React, { useEffect, useState } from "react";
import { useTeam } from "src/teamProvider";
export const getServerSideProps = commonServerSideProps;

const WebsettingsPage = () => {
  const router = useRouter();
  const sectionTitle = router.query.section_title || "HrpayrollSection1";
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
    { key: "HrpayrollSection1", label: "Section 1" },
    { key: "HrpayrollSection2", label: "Section 2" },
    { key: "HrpayrollSection3", label: "Section 3" },
    { key: "HrpayrollSection4", label: "Section 4" },
    { key: "HrpayrollSection5", label: "Section 5" },
    { key: "HrpayrollSection6", label: "Section 6" },
    { key: "HrpayrollSection7", label: "Section 7" },
    { key: "HrpayrollSection8", label: "Section 8" },
    { key: "HrpayrollSection9", label: "Section 9" },
    { key: "HrpayrollSection10", label: "Section 10" },
    { key: "HrpayrollSection11", label: "Section 11" },
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
        <Breadcrumb.Item>HR and Payroll</Breadcrumb.Item>
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
              case "HrpayrollSection1":
                return <Section1  />;
              case "HrpayrollSection2":
                return <Section2  />;
              case "HrpayrollSection3":
                return <Section3  />;
              case "HrpayrollSection4":
                return <Section4  />;
              case "HrpayrollSection5":
                return <Section5  />;
              case "HrpayrollSection6":
                return <Section6  />;
              case "HrpayrollSection7":
                return <Section7  />;
              case "HrpayrollSection8":
                return <Section8  />;
              case "HrpayrollSection9":
                return <Section9  />;
              case "HrpayrollSection10":
                return <Section10  />;
              case "HrpayrollSection11":
                return <Section11  />;
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
