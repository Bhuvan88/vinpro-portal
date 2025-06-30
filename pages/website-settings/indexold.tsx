import { Tabs } from "antd";
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
              return <Section1 callback={function (status: string): void {
                throw new Error("Function not implemented.");
              } } visible={false} />;
            case "Home page Section 2":
              return <Section2 callback={function (status: string): void {
                throw new Error("Function not implemented.");
              } } visible={false} />;
            case "Home page Section 3":
              return <Section3 callback={function (status: string): void {
                throw new Error("Function not implemented.");
              } } visible={false} />;
            case "Home page Section 4":
              return <Section4 callback={function (status: string): void {
                throw new Error("Function not implemented.");
              } } visible={false} />;
            default:
              return null;
          }
        })(),
      }))}
    />
  );
};

export default WebsettingsPage;
