import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

// 1. Render HTML feed
function render() {
  document.getElementById("feed").innerHTML = getFeedHtml();
}

render();

// 2. What to render? Get feed HTML
function getFeedHtml() {
  let feedHtml = ""; // Final return value

JSON.parse(localStorage.getItem('tweetsData')).forEach((tweet) => {
    let likeIconClass = "";
    let retweetIconClass = "";
    let repliesHtml = "";

    // Interaction Buttons Handling: reply, like, retweet
    tweet.isLiked ? (likeIconClass = "liked") : "";
    tweet.isRetweeted ? (retweetIconClass = "retweeted") : "";
    // If any reply, show it up
    tweet.replies.length > 0
      ? tweet.replies.forEach((reply) => {
          repliesHtml += `
            <div class='tweet-reply'>
              <div class='tweet-inner'>
                <img src='${reply.profilePic}' class='profile-pic'>
                  <div>
                    <p class='handle'>${reply.handle}</p>
                    <p class='tweet-text'>${reply.tweetText}</p>
                  </div>
              </div>
            </div>
          `;
        })
      : "";

    // Feed comes from an external js file: data.js
    feedHtml += ` 
      <div class="tweet">
  <div class="tweet-inner">
    <img src="${tweet.profilePic}" class="profile-pic" />
    <div>
      <p class="handle">${tweet.handle}</p>
      <p class="tweet-text">${tweet.tweetText}</p>
      <div class="tweet-details">
        <span class="tweet-detail">
          <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}"></i>
          ${tweet.replies.length}
        </span>
        <span class="tweet-detail">
          <i
            class="fa-solid fa-heart ${likeIconClass}"
            data-like="${tweet.uuid}"
          ></i>
          ${tweet.likes}
        </span>
        <span class="tweet-detail">
          <i
            class="fa-solid fa-retweet ${retweetIconClass}"
            data-retweet="${tweet.uuid}"
          ></i>
          ${tweet.retweets}
        </span>
      </div>
    </div>
  </div>
  <div class="hidden" id="replies-${tweet.uuid}">
    ${repliesHtml}
  </div>
</div>
    `;
  });
  return feedHtml;
}

/* 3. Events (User interaction) Check Out
Only 4 options as interaction:
    - like: handleLikeClick()
    - retweet: handleRetweetClick()
    - reply: handleReplyClick()
    - tweet btn (tweet post): handleTweetBtnClick()
    - leave reply: leaveReply()
*/
// Event Detection
document.addEventListener("click", (e) => {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if (e.target.id === "tweet-btn") {
    handleTweetBtnClick();
  }
});

// Like Event
function handleLikeClick(tweetId) {
  const targetTweetObj = tweetsData.filter(
    (tweet) => tweet.uuid === tweetId,
  )[0]; // Selecting the tweetObj the uuid of which is same as tweetId: only one!

  targetTweetObj.isLiked ? targetTweetObj.likes-- : targetTweetObj.likes++;
  targetTweetObj.isLiked = !targetTweetObj.isLiked;
  render();
}

// Retweet Event
function handleRetweetClick(tweetId) {
  const targetTweetObj = tweetsData.filter(
    (tweet) => tweet.uuid === tweetId,
  )[0];

  targetTweetObj.isRetweeted
    ? targetTweetObj.retweets--
    : targetTweetObj.retweets++;
  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
  render();
}

// Reply Event
function handleReplyClick(replyId) {
  document.getElementById(`replies-${replyId}`).classList.toggle("hidden");
}

// Tweet Post Event
function handleTweetBtnClick() {
  const tweetInput = document.getElementById("tweet-input");

  if (tweetInput.value) {
    // Add new tweet at the top of tweets stack
    tweetsData.unshift({
      handle: `@David👍`,
      profilePic: `images/me-logo.webp`,
      likes: 0,
      retweets: 0,
      tweetText: tweetInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
    });

    // Store new tweet in localStorage
    let existing = localStorage.getItem('tweetsData');
    let data = existing ? existing + JSON.stringify(tweetsData) : JSON.stringify(tweetsData);

    
    localStorage.setItem('tweetsData', JSON.stringify(tweetsData));
    render();
    
    tweetInput.value = "";
  }
}
