export default function Header() {
    return (
      <header className="main-header">
        <a href="/" className="logo">
        <span className="logo-mini"><b>STU</b></span>
        <span className="logo-lg">
          <img src="/assets/images/small-logos/Logo_STU.png" height="40" width="40" style={{ maxHeight: '40px', width: 'auto' }} alt="Logo" />
        </span>
      </a>

      <nav className="navbar navbar-static-top">
        <a href="#" className="sidebar-toggle" data-toggle="push-menu" role="button">
          <span className="sr-only">Toggle navigation</span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
        </a>

        <div className="navbar-custom-menu">
          <ul className="nav navbar-nav">
            {/* Messages */}
            <li className="dropdown messages-menu">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                <i className="fa fa-envelope-o"></i>
                <span className="label label-success">4</span>
              </a>
              <ul className="dropdown-menu">
                <li className="header">You have 4 messages</li>
                <li>
                  <ul className="menu">
                    <li>
                      <a href="#">
                        <div className="pull-left">
                          <img src="/assets/images/user2-160x160.jpg" className="img-circle" alt="User" />
                        </div>
                        <h4>
                          Support Team
                          <small><i className="fa fa-clock-o"></i> 5 mins</small>
                        </h4>
                        <p>Why not buy a new awesome theme?</p>
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="footer"><a href="#">See All Messages</a></li>
              </ul>
            </li>

            {/* Notifications */}
            <li className="dropdown notifications-menu">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                <i className="fa fa-bell-o"></i>
                <span className="label label-warning">10</span>
              </a>
              <ul className="dropdown-menu">
                <li className="header">You have 10 notifications</li>
                <li>
                  <ul className="menu">
                    <li><a href="#"><i className="fa fa-users text-aqua"></i> 5 new members joined today</a></li>
                  </ul>
                </li>
                <li className="footer"><a href="#">View all</a></li>
              </ul>
            </li>

            {/* Tasks */}
            <li className="dropdown tasks-menu">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                <i className="fa fa-flag-o"></i>
                <span className="label label-danger">9</span>
              </a>
              <ul className="dropdown-menu">
                <li className="header">You have 9 tasks</li>
                <li>
                  <ul className="menu">
                    <li>
                      <a href="#">
                        <h3>Design some buttons <small className="pull-right">20%</small></h3>
                        <div className="progress xs">
                          <div className="progress-bar progress-bar-aqua" style={{ width: '20%' }} role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">
                            <span className="sr-only">20% Complete</span>
                          </div>
                        </div>
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="footer"><a href="#">View all tasks</a></li>
              </ul>
            </li>

            {/* User */}
            <li className="dropdown user user-menu">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                <i className="fa-solid fa-circle-user"></i>
                <span className="hidden-xs"><span className="usernameSpan">Guest</span></span>
              </a>
              <ul className="dropdown-menu">
                <li className="user-header">
                  <img src="/assets/images/userlogo.jpg" className="img-circle" alt="User" />
                  <p><span className="usernameSpan">Guest</span></p>
                </li>
                <li className="user-footer" id="userMenu"></li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>

      </header>
    );
  }
  