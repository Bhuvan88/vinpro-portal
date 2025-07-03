import { Tabs, Breadcrumb } from "antd";
import { useRouter } from "next/router";
// import Section1 from "../../src/components/websettings/home/section";
import Section1 from "../../src/components/websettings/footer/section";
import { commonServerSideProps } from "src/commonServerSideProps";
import React, { useEffect, useState } from "react";
import { useTeam } from "src/teamProvider";

export const getServerSideProps = commonServerSideProps;

const WebsettingsPage = () => {
  const router = useRouter();
  const sectionTitle = "WebfooterSection1";

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
    // { key: "Section1", label: "Section1" },
    { key: "WebfooterSection1", label: "Section 1" },
  
    // { key: "Home page Section 4", label: "Section 5" },
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
        <Breadcrumb.Item>Home Page</Breadcrumb.Item>
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
       
              case "WebfooterSection1":
                return <Section1 callback={function (status: string): void {
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
