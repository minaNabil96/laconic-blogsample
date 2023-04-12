import { useEffect, useState } from "react";
import axios from "axios";

const useAuth = (url) => {
  const [data, setData] = useState([]);
  const [errorMsg, seterrorMsg] = useState("");
  const [loading, setloading] = useState(false);
  const trys = url;
  axios.defaults.withCredentials = true;
  // axios.defaults.xsrfCookieName = "csrftoken";
  // axios.defaults.xsrfHeaderName = "X-CSRFToken";

  // let token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2VkMmZjMDBjMjk4ODI3MmRhZmI4OGMiLCJ1c2VybmFtZSI6Im1pbmEiLCJwYXNzd29yZCI6IjEyMzQ1IiwiZGF0ZSI6IjIwMjMtMDItMTVUMTk6MTc6MjAuNDM2WiIsImNyZWF0ZWRBdCI6IjIwMjMtMDItMTVUMTk6MTc6MjAuNDU2WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDItMTdUMTQ6MDI6NDcuNTg4WiIsIl9fdiI6MCwiYXJhYmljbmFtZSI6ItmF2YrZhtinIiwiaWF0IjoxNjc3MDkyNzUyfQ.FOfk8AAX-owb-YevxFQX3bzFQAmmCdiqhsmuAuJiP-s`;
  useEffect(() => {
    const getData = async () => {
      setloading(true);
      const respond = await axios
        .get(trys)
        .then((response) => {
          if (response.status === 200) {
            response ? setData(response.data) : setData(data);
            setloading(false);
            if (response.data === []) {
              setloading(false);
            }
          }
        })
        .catch(function (error) {
          if (error.message) {
            seterrorMsg(error.message);
            setloading(false);
          } else if (error.response.status && error.response.statusText) {
            const errorMsg = `${error.response.status} ${error.response.statusText} `;

            seterrorMsg(errorMsg);
            setloading(false);
          } else {
            seterrorMsg(errorMsg);
            setloading(false);
          }
        });
    };

    getData();
  }, []);

  return { data, errorMsg, loading };
};
export default useAuth;
