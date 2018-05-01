import React from 'react';
import {Tweet} from './Tweet';

const shouldFail = id => [3, 4].includes(id);

// Fake request. Fail for id 3 or 4
function likeTweetRequest(tweetId, like) {
  console.log(`HTTP /like_tweet/${tweetId}?like=${like} (begin)`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldSucceed = !shouldFail(tweetId);
      console.log(
        `HTTP /like_tweet/${tweetId}?like=${like} (${shouldSucceed
          ? 'success'
          : 'failure'})`
      );
      shouldSucceed ? resolve() : reject();
    }, 1000);
  });
}

const initialState = {
  tweets: [0, 3, 98, 0, 0].map((likes, i) => ({
    id: i + 1,
    likes,
    username: `${shouldFail(i + 1) ? 'Fail' : 'Cool'}Cat${i + 1}`,
    content: `Some really great content here (${i + 1})...`,
  })),
  likedTweets: [2],
};

class App extends React.Component {
  state = initialState;

  render() {
    const {tweets, likedTweets} = this.state;
    return (
      <div className="container">
        <h3 className="text-muted text-center lead pt-2">
          Optimistic UI Updates with React
        </h3>
        <div className="list-group">
          {tweets.map(tweet => (
            <Tweet
              key={tweet.id}
              tweet={tweet}
              isLiked={likedTweets.includes(tweet.id)}
              onClickLike={tweetId => likeTweetRequest(tweetId, true)}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default App;
