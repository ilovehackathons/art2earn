import React from "react";
import { arweave, getTopicString } from "../lib/api";

export const NewPost = (props) => {
  const [isPosting, setIsPosting] = React.useState(false);
  const [topicValue, setTopicValue] = React.useState("");
  const [videoValue, setVideoValue] = React.useState();

  function onTopicChanged(e) {
    let input = e.target.value;
    let dashedTopic = getTopicString(input);
    setTopicValue(dashedTopic);
  }

  async function onVideoButtonClicked() {
    setIsPosting(true);
    let tx = await arweave.createTransaction({
      data: await videoValue.arrayBuffer(),
    });
    tx.addTag("App-Name", "art2earn");
    tx.addTag("Content-Type", "video/mp4");
    tx.addTag("Version", "1.0.1");
    tx.addTag("Type", "post");
    if (topicValue) {
      tx.addTag("Topic", topicValue);
    }
    try {
      let result = await window.arweaveWallet.dispatch(tx);
      setVideoValue();
      setTopicValue("");
      if (props.onPostMessage) {
        props.onPostMessage(result.id);
      }
    } catch (err) {
      console.error(err);
    }
    setIsPosting(false);
  }

  let isDisabled = !videoValue;

  if (props.isLoggedIn) {
    if (isPosting) {
      return (
        <div className="newPost">
          <div className="newPostScrim" />
          <div className="newPost-postRow">
            <div className="topic">
              #
              <input
                type="text"
                placeholder="topic"
                className="topicInput"
                value={topicValue}
                disabled={true}
              />
            </div>
            <div>
              <button className="submitButton" disabled={true}>
                Post video
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="newPost">
          <input
            type="file"
            accept="video/mp4"
            onChange={(e) => setVideoValue(e.target.files[0])}
          />
          <div className="newPost-postRow">
            <div
              className="topic"
              style={{ color: topicValue && "rgb( 80, 162, 255)" }}
            >
              #
              <input
                type="text"
                placeholder="topic"
                className="topicInput"
                value={topicValue}
                onChange={(e) => onTopicChanged(e)}
              />
            </div>
            <div>
              <button
                className="submitButton"
                onClick={onVideoButtonClicked}
                disabled={isDisabled}
              >
                Post video
              </button>
            </div>
          </div>
        </div>
      );
    }
  } else {
    return (
      <div className="darkRow">Connect your wallet to start posting...</div>
    );
  }
};
