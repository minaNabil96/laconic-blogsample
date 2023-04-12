import React from "react";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ReactPaginate from "react-paginate";

import { EditorContent, useEditor } from "@tiptap/react";
// eslint-disable-next-line react/prop-types

function Post({ posthandler, allposts, searchMsg }) {
  const [articles, setArticles] = useState([]);
  const [searchStatus, setSearchStatus] = useState([]);
  useEffect(() => {
    if (allposts) {
      setArticles(allposts);
    }
  }, [allposts, searchMsg]);

  // filters
  // const filter1 =
  //   allposts && allposts.filter(({ author }) => author === "volvo");
  // const cont = <p className="text-white"> ...أكمل القراءة </p>;
  // const postText = posthandler[1].body.content[0].content[0].text;

  // eslint-disable-next-line react/prop-types
  const finalPost = articles ? (
    articles.map(({ _id, title, image, text, author }) => (
      <div className="col-12 col-md-6 col-lg-4 pt-5 mt-3" key={_id}>
        <Link to={`/articles/${_id}`} className="text-none textDecorationNone">
          <div className="card m-auto cardhight mt-5 mb-5 ">
            <img
              className="card-img-top  card-img-size"
              src={image}
              alt="img"
            />

            <div className=" overFlowHidden">
              <h6 className="card-title arabicDirection text-center m-2 text-black textDecorationNone">
                {[...title].length >= 70 ? title.slice(0, 70) + "..." : title}
              </h6>
              <hr />
              <p className="card-text text-end m-2 text-dark cardTextBreak textDecorationNone ">
                {[...text].length >= 100 ? text.slice(0, 100) : text}
                <span className="text-primary">... أكمل القراءة</span>
              </p>
            </div>
          </div>
        </Link>
      </div>
    ))
  ) : (
    <div>{"there's no articles"}</div>
  );

  return (
    // <div className="card m-3 btn cardhight overflow-hidden">
    //   <img className="card-img-top img-fluid" src="https://images.unsplash.com/photo-1657690117381-ca96536fb62c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80" alt="img" />
    //   <div className="card-body">
    //     <h5 className="card-title">Card title</h5>
    //     <hr />
    //     <p className="card-text text-end">
    //       Some quick example text to build on the card title and make up the bulk of the
    //       contentsssSo me

    //     </p>
    //   </div>
    // </div>
    <div className="container">
      <div>
        <div className="row">{finalPost}</div>
      </div>
    </div>
  );
}

export default Post;
