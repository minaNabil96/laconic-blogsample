import { useEffect, useState } from "react";
import axios from "axios";

const useAxiosPost = (url) => {
  const [data, setData] = useState([]);
  const [errorMsg, seterrorMsg] = useState("");
  const [Looding, setLooding] = useState(false);
  const trys = url;

  useEffect(() => {
    const getData = async () => {
      setLooding(true);
      const respond = await axios
        .get(trys)
        .then((response) => {
          if (response.status === 200) {
            response ? setData(response.data) : setData(data);
            setLooding(false);
            if (response.data === []) {
              setLooding(false);
            }
          }
        })
        .catch(function (error) {
          if (error.message) {
            seterrorMsg(error.message);
            setLooding(false);
          } else if (error.response.status && error.response.statusText) {
            const errorMsg = `${error.response.status} ${error.response.statusText} `;

            seterrorMsg(errorMsg);
            setLooding(false);
          } else {
            seterrorMsg(errorMsg);
            setLooding(false);
          }
        });
    };

    getData();
  }, []);

  return { data, errorMsg, Looding };
};
export default useAxiosPost;
