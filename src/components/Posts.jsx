import React from "react";
import { Link } from "react-router-dom";
import { maxMessageLength, abbreviateAddress, getPostTime } from "../lib/api";

export const Posts = (props) => {
  return (
    <div>
      {props.postInfos.map((postInfo) => (
        <PostItem key={postInfo?.txid} postInfo={postInfo} />
      ))}
    </div>
  );
};

const PostItem = (props) => {
  const [statusMessage, setStatusMessage] = React.useState("");

  React.useEffect(() => {
    let newStatus = "";

    if (!props.postInfo?.message) {
      setStatusMessage("loading...");
      let isCancelled = false;

      const getPostMessage = async () => {
        const response = await props.postInfo.request;
        switch (response?.status) {
          case 200:
          case 202:
            props.postInfo.video = window.URL.createObjectURL(
              await (
                await fetch(`https://arweave.net/${props.postInfo.txid}`)
              ).blob()
            );

            newStatus = "";
            break;
          case 404:
            newStatus = "Not Found";
            break;
          default:
            newStatus = props.postInfo?.error;
            if (!newStatus) {
              newStatus = "missing data";
            }
        }

        if (isCancelled) return;
        setStatusMessage(newStatus);
      };

      if (props.postInfo?.error) {
        setStatusMessage(props.postInfo.error);
      } else {
        getPostMessage();
      }
      return () => (isCancelled = true);
    }
  }, [props.postInfo]);

  const renderTopic = (topic) => {
    if (topic)
      return (
        <Link to={`/topics/${topic}`} className="postTopic">
          #{topic}
        </Link>
      );
  };

  return (
    <div className="postItem">
      <div className="postLayout">
        <img className="profileImage" src="img_avatar.png" alt="ProfileImage" />
        <div>
          <div className="postOwnerRow">
            <Link to={`/users/${props.postInfo?.owner}`}>
              {abbreviateAddress(props.postInfo?.owner)}
            </Link>
            <span className="gray"> • </span>
            <time>{getPostTime(props.postInfo?.timestamp || 0)}</time>
          </div>
          <div className="postRow">
            <>
              {props.postInfo.video && (
                <video controls width="250">
                  <source src={props.postInfo.video} type="video/mp4" />
                </video>
              )}
            </>
            {statusMessage && <div className="status"> {statusMessage}</div>}
          </div>
          {renderTopic(props.postInfo.topic)}
        </div>
      </div>
    </div>
  );
};
