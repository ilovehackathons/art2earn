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
  // const [postMessage, setPostMessage] = React.useState("");
  const [postVideo, setPostVideo] = React.useState();
  const [statusMessage, setStatusMessage] = React.useState("");

  React.useEffect(() => {
    // let newPostMessage = "";
    let newPostVideo;
    let newStatus = "";

    if (!props.postInfo?.message) {
      setStatusMessage("loading...");
      let isCancelled = false;

      const getPostMessage = async () => {
        // setPostMessage(
        //   "s".repeat(
        //     Math.min(Math.max(props.postInfo.length - 75, 0), maxMessageLength)
        //   )
        // );
        const response = await props.postInfo.request;
        switch (response?.status) {
          case 200:
          case 202:
            // props.postInfo.message = response.data.toString();
            props.postInfo.message = response.data;
            props.postInfo.video = window.URL.createObjectURL(
              new Blob([response.data], {
                type: "video/mp4",
              })
            );
            console.log("\\", props.postInfo.video);

            newStatus = "";
            // newPostMessage = props.postInfo.message;
            newPostVideo = props.postInfo.video;
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

        // setPostMessage(newPostMessage);
        setPostVideo(newPostVideo);
        setStatusMessage(newStatus);
      };

      if (props.postInfo?.error) {
        // setPostMessage("");
        setPostVideo();
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
            {/* {props.postInfo?.message || postMessage} */}
            {statusMessage && <div className="status"> {statusMessage}</div>}
          </div>
          {renderTopic(props.postInfo.topic)}
        </div>
      </div>
    </div>
  );
};
