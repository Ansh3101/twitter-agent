import { Scraper } from 'twitter-agent';
import dotenv from 'dotenv';

dotenv.config();

async function createThread(scraper, threadContent, options = {}) {
  const { delayBetweenTweets = 3000, indexingDelay = 10000 } = options;
  let previousTweetId = null;

  for (let i = 0; i < threadContent.length; i++) {
    const tweetText = threadContent[i];
    const tweetResult = await scraper.sendTweet(
      tweetText,
      i === 0 ? null : previousTweetId,
    );

    try {
      await new Promise((resolve) => setTimeout(resolve, indexingDelay));

      if (tweetResult?.id) {
        previousTweetId = tweetResult.id;
      } else {
        const username = await scraper
          .me()
          .then((profile) => profile?.username);
        if (!username) {
          throw new Error('Failed to get username');
        }
        const recentTweets = scraper.getTweetsAndReplies(username, 5);
        for await (const tweet of recentTweets) {
          if (tweet.text.includes(tweetText.substring(0, 30))) {
            previousTweetId = tweet.id;
            break;
          }
        }
      }

      if (!previousTweetId) {
        throw new Error(`Failed to verify tweet #${i + 1}`);
      }

      if (i < threadContent.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayBetweenTweets));
      }
    } catch (error) {
      throw new Error(`Failed to post tweet #${i + 1}: ${error.message}`);
    }
  }

  return previousTweetId;
}

async function main() {
  const cookieStrings = [
    'guest_id_marketing=v1%3A174256956507820482; Expires=Sun, 21 Mar 2027 15:06:05 GMT; Max-Age=63072000; Domain=twitter.com; Path=/; Secure',
    'guest_id_ads=v1%3A174256956507820482; Expires=Sun, 21 Mar 2027 15:06:05 GMT; Max-Age=63072000; Domain=twitter.com; Path=/; Secure',
    'personalization_id="v1_QooCXLxcf092Y7DtBqzw7g=="; Expires=Sun, 21 Mar 2027 15:06:05 GMT; Max-Age=63072000; Domain=twitter.com; Path=/; Secure',
    'guest_id=v1%3A174256956507820482; Expires=Sun, 21 Mar 2027 15:06:05 GMT; Max-Age=63072000; Domain=twitter.com; Path=/; Secure',
    '__cf_bm=ZXTtHmAEBwmp02BTjMLjP.MzCg3aMJonvHC8_GP1zi8-1742569565-1.0.1.1-uxxpByUXGvdDXFRfyUtysPVcEt00jZmNlzgtQBcJYr7jfMLwSKXd0WtUMeW9ywO7uaX7tXD.7XYIuXMRFe4yik9ZGMqcsLHx1t0kwYJ5tow; Expires=Fri, 21 Mar 2025 15:36:05 GMT; Domain=twitter.com; Path=/; Secure; HttpOnly',
    'kdt=eSVQuKTzrSPXZTsAocdYXCXfXpHfSzyDzILFXMvV; Expires=Sat, 19 Sep 2026 15:06:06 GMT; Max-Age=47260800; Domain=twitter.com; Path=/; Secure; HttpOnly',
    'twid="u=1879535918559965184"; Expires=Wed, 20 Mar 2030 15:06:06 GMT; Max-Age=157680000; Domain=twitter.com; Path=/; Secure',
    'ct0=5b12899e0329d69d44031a1088b28144e988d4ec0670f7c35bf03476f160b0800d0ac6ef92543f78b6bca843bcfa7a098f22da2732e1b7390e0953d3c577a791adabe764901c2c9968c8693f9cebbebd; Expires=Wed, 20 Mar 2030 15:06:07 GMT; Max-Age=157680000; Domain=twitter.com; Path=/; Secure; SameSite=Lax',
    'auth_token=6dbeed3d325d4cc39224c1d91a6a62558f70449d; Expires=Wed, 20 Mar 2030 15:06:06 GMT; Max-Age=157680000; Domain=twitter.com; Path=/; Secure; HttpOnly',
    'att=1-AEPUVp27GcuFt2iTNBGPweozhWgoWn43zIavosX1; Expires=Sat, 22 Mar 2025 15:06:07 GMT; Max-Age=86400; Domain=twitter.com; Path=/; Secure; HttpOnly',
  ];

  const scraper = await Scraper.fromCookies(cookieStrings);
  const isLoggedIn = await scraper.isLoggedIn();

  if (!isLoggedIn) {
    throw new Error('Failed to authenticate with Twitter');
  }

  const threadContent = [
    '🚀 Just diving into the fascinating world of DeFi! The future of finance is decentralized, permissionless, and accessible to everyone.',
    '💡 Key DeFi advantages:\n- No middlemen\n- 24/7 trading\n- Self-custody of funds\n- Transparent protocols\n- Composable architecture',
    '💰 From lending protocols to AMMs and yield farming, DeFi is revolutionizing how we think about money. The innovation never stops!',
    'Join the DeFi revolution! DYOR and start with small amounts to learn the ropes. The future of finance is being built right now! #DeFi #Web3',
  ];

  try {
    console.log('Starting thread creation...');
    const finalTweetId = await createThread(scraper, threadContent);
    console.log(`Thread posted successfully. Final tweet ID: ${finalTweetId}`);
  } catch (error) {
    console.error('Failed to post thread:', error.message);
  } finally {
    console.log('Cleaning up...');
    if (scraper?.close) {
      await scraper.close();
      console.log('Scraper closed successfully');
    }
  }
}

main();
