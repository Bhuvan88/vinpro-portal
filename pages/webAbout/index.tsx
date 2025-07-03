import { Tabs, Breadcrumb } from "antd";
import { useRouter } from "next/router";
import Section1 from "../../src/components/websettings/about/section";
import Section2 from "../../src/components/websettings/about/section2";
import Section3 from "../../src/components/websettings/about/section3";
import Section4 from "../../src/components/websettings/about/section4";
import Section5 from "../../src/components/websettings/about/section5";
import Section6 from "../../src/components/websettings/about/section6";
import { commonServerSideProps } from "src/commonServerSideProps";
  import { useTeam } from "src/teamProvider";
  import React, { useEffect, useState } from "react";

export const getServerSideProps = commonServerSideProps;

const WebsettingsPage = () => {
  const router = useRouter();
  const sectionTitle = router.query.section_title || "AboutSection1";
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
    { key: "AboutSection1", label: "Section 1" },
    { key: "AboutSection2", label: "Section 2" },
    { key: "AboutSection3", label: "Section 3" },
    { key: "AboutSection4", label: "Section 4" },
    { key: "AboutSection5", label: "Section 5" },
    { key: "AboutSection6", label: "Section 6" },
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
        <Breadcrumb.Item>About us Page</Breadcrumb.Item>
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
              case "AboutSection1":
                return <Section1 callback={function (status: string): void {
                  throw new Error("Function not implemented.");
                } } visible={true} />;
              case "AboutSection2":
                return <Section2 callback={function (status: string): void {
                  throw new Error("Function not implemented.");
                } } visible={true} />;
              case "AboutSection3":
                return <Section3 callback={function (status: string): void {
                  throw new Error("Function not implemented.");
                } } visible={true} />;
              case "AboutSection4":
                return <Section4 callback={function (status: string): void {
                  throw new Error("Function not implemented.");
                } } visible={true} />;
                case "AboutSection5":
                return <Section5 callback={function (status: string): void {
                  throw new Error("Function not implemented.");
                } } visible={true} />;
                case "AboutSection6":
                return <Section6 callback={function (status: string): void {
                  throw new Error("Function not implemented.");
                } } visible={true} />;
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
