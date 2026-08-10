import { useEffect } from "react";

function Script() {

  useEffect(() => {

    const params = new URLSearchParams(window.location.search);

    const fromLogin = params.get("fromLogin");
    const role = params.get("role");

    if (fromLogin && role === "STUDENT") {

      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );

      window.location.reload();

    }

  }, []);

  return null;

}

export default Script;