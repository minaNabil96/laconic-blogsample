import React from "react";
import { useState } from "react";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");
  const [Message, setMessage] = useState("");
  const [error, setError] = useState("");

  // onsubmit
  const service = process.env.REACT_APP_SERVICE;
  const template = process.env.REACT_APP_TEMPLATE;
  const emailJs = process.env.REACT_APP_EMAILJS;
  const onSubmit = (e) => {
    e.preventDefault();
    if (!Name || !Email || !Phone || !Message) {
      setError(`please enter the full info`);
      setTimeout(() => {
        setError("");
      }, 1300);
    } else {
      const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/gi;
      const matchedEmail = Email.match(emailRegex);
      if (matchedEmail) {
        // eslint-disable-next-line no-lone-blocks
        /* prettier-ignore */ emailjs.sendForm(
          `${service}`,
          `${template}`,
          e.target,
          `${emailJs}`,
        )
        .then(
          (result) => {
            setError(`success`);
            setTimeout(() => {
              setError("");
            }, 3300);
            console.log(result.text);
          },
          (error) => {
            setError(`error`);
            setTimeout(() => {
              setError("");
            }, 3300);
            console.log(error.text);
          }
        );
      } else {
        setError(`incorrect info!`);
        setTimeout(() => {
          setError("");
        }, 1300);
      }
    }
  };

  return (
    <div className="contact-landing pt-2">
      <section className="contact">
        <div className="pt-5">
          <h2 className="text-white mb-5 pt-5">Contact</h2>
        </div>
        <form className="pt-5" onSubmit={(e) => onSubmit(e)}>
          <label className="text-light">your name :</label>
          <input
            name="Name"
            type="text"
            onChange={(e) => setName(e.target.value)}
          />
          <label className="text-light">your email :</label>
          <input
            name="Email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="text-light">phone number :</label>
          <input
            name="Phone"
            type="tel"
            onChange={(e) => setPhone(e.target.value)}
          />
          <label className="text-light">message :</label>
          <textarea
            className="text-end"
            name="Message"
            rows="9"
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          {/* <label className='text-light'>select :</label>
        <select>
          <option value="admin">coding</option>
          <option value="codv">writing</option>
        </select> */}
          <button className="btn btn-primary" type="submit">
            send
          </button>
          <div className="d-flex justify-content-center align-items-center mt-2 ">
            <h5
              className={` ${error ? "d-block" : "d-none"} ${
                error.includes("success") ? "text-light" : "text-warning"
              } text-center  mt-2`}
            >
              {error && error}
            </h5>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Contact;
