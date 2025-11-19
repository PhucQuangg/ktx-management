import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Script from "../components/Script";

export default function IndexPage() {
  return (
    <div className="wrapper">
      <Header />
      <Sidebar />

      <div className="content-wrapper">
        <section className="content-header" style={{ textAlign: "center", marginBottom: "10px" }}>
          <h1 className="text-danger text-uppercase">
            Chào mừng đến với ký túc xá sinh viên
          </h1>
        </section>

        <section
          className="content"
          style={{
            background: "url('/assets/images/illustrations/index.jpg') no-repeat center center",
            backgroundSize: "cover",
            backgroundAttachment: "local",
            minHeight: "100vh",
            borderRadius: "8px",
          }}
        ></section>
      </div>

      {/* Gọi script xử lý token / username */}
      <Script />
    </div>
  );
}
