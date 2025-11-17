import { useEffect } from "react";


export default function Sidebar() {
  useEffect(() => {
    setTimeout(() => {
      window.$('.sidebar-menu').tree();
    }, 200);
  }, []);
  
    return (
      <aside className="main-sidebar">
        <section className="sidebar">
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
                <i className="fa fa-th"></i> <span>Biểu Mẫu</span>
                <span className="pull-right-container">
                  <i className="fa fa-angle-left pull-right"></i>
                </span>
              </a>
              <ul className="treeview-menu">
                <li><a href="/register-dorm"><i className="fa fa-circle-o"></i> Đăng ký nội trú</a></li>
                <li><a href="#"><i className="fa fa-circle-o"></i> Hóa đơn</a></li>
                <li><a href="#"><i className="fa fa-circle-o"></i> Phòng</a></li>
                <li><a href="#"><i className="fa fa-circle-o"></i> Liên hệ</a></li>
                <li><a href="#"><i className="fa fa-circle-o"></i> Quy định</a></li>
              </ul>
            </li>
  
            <li className="treeview">
              <a>
                <i className="fa fa-th"></i> <span>Thanh Toán</span>
                <span className="pull-right-container">
                  <i className="fa fa-angle-left pull-right"></i>
                </span>
              </a>
              <ul className="treeview-menu">
                <li><a href="#"><i className="fa fa-circle-o"></i> Tiền phòng</a></li>
                <li><a href="#"><i className="fa fa-circle-o"></i> Tiền điện</a></li>
                <li><a href="#"><i className="fa fa-circle-o"></i> Tiền nước</a></li>
                <li><a href="#"><i className="fa fa-circle-o"></i> Chi phí khác</a></li>
              </ul>
            </li>
  
            <li>
              <a href="#"><i className="fa fa-info-circle"></i> <span>Hướng Dẫn</span></a>
            </li>
          </ul>
        </section>
      </aside>
    );
  }
  