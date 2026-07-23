import { useEffect } from "react";


export default function Sidebar() {
  useEffect(() => {
    setTimeout(() => {
      window.$('.sidebar-menu').tree();
    }, 200);
  }, []);
  
    return (
<aside
    className="main-sidebar"
    style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        overflowY: "auto"
    }}
>        <section className="sidebar">
          <div className="user-panel">
            <div className="pull-left image">
              <img
                src="/assets/images/userlogo.jpg"
                className="img-circle"
                alt="User"
              />
            </div>
            <div className="pull-left info">
              <br />
              <span className="hidden-xs">
                <span className="usernameSpan">Guest</span>
              </span>
            </div>
          </div>
  
          <ul className="sidebar-menu" data-widget="tree">
            <li className="treeview">
              <a>
                <i className="fa fa-th"></i> <span>Danh mục</span>
                <span className="pull-right-container">
                  <i className="fa fa-angle-left pull-right"></i>
                </span>
              </a>
              <ul className="treeview-menu">
                <li><a href="/register-dorm"><i className="fa fa-circle-o"></i> Đăng ký nội trú</a></li>
                <li><a href="/invoices"><i className="fa fa-circle-o"></i> Hóa đơn</a></li>
                <li><a href="/rooms"><i className="fa fa-circle-o"></i> Phòng</a></li>
                <li><a href="/contact"><i className="fa fa-circle-o"></i> Liên hệ</a></li>
                <li><a href="/notifications"><i className="fa fa-circle-o"></i> Thông báo</a></li>
                <li><a href="/my-contracts"><i className="fa fa-circle-o"></i> Hợp đồng</a></li>
              </ul>
            </li>
  
          
  
           
          </ul>
        </section>
      </aside>
    );
  }
  