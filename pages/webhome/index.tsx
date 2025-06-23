import { Tabs, Breadcrumb } from "antd";
import { useRouter } from "next/router";
import Section1 from "../../src/components/websettings/home/section";
import Section2 from "../../src/components/websettings/home/section2";
import Section3 from "../../src/components/websettings/home/section3";
import Section4 from "../../src/components/websettings/home/section4";

const WebsettingsPage = () => {
  const router = useRouter();
  const sectionTitle = router.query.section_title || "Home page Section 1";

  const handleTabChange = (key: string) => {
    router.push({
      pathname: router.pathname,
      query: { section_title: key },
    });
  };

  const tabItems = [
    { key: "Home page Section 1", label: "Section 1" },
    { key: "Home page Section 2", label: "Section 2" },
    { key: "Home page Section 3", label: "Section 3" },
    { key: "Home page Section 4", label: "Section 4" },
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
              case "Home page Section 1":
                return <Section1 />;
              case "Home page Section 2":
                return <Section2 />;
              case "Home page Section 3":
                return <Section3 />;
              case "Home page Section 4":
                return <Section4 />;
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
