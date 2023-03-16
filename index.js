const Twitter = require('twitter');
const { Configuration, OpenAIApi } = require("openai");
const { exit } = require('process');
require('dotenv').config()

// Replace these values with your own API keys and access tokens
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY 
const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET 
const TWITTER_ACCESS_TOKEN_KEY = process.env.TWITTER_ACCESS_TOKEN_KEY 
const TWITTER_ACCESS_TOKEN_SECRET = process.env.TWITTER_ACCESS_TOKEN_SECRET 

// Create a new Twitter client
const client = new Twitter({
    consumer_key: TWITTER_CONSUMER_KEY,
    consumer_secret: TWITTER_CONSUMER_SECRET,
    access_token_key: TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: TWITTER_ACCESS_TOKEN_SECRET,
});

// Function to generate and post a Twitter thread
async function postTwitterThread() {
    
    console.log("Generating prompt for ChatGPT...");
    // Generate a new prompt for ChatGPT
    const promptResponse = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'System', content: 'Write a twitter thread on unique and underrated chatgpt hacks. Only return the tweet contents. Eliminate any pre-text and post-text. Strictly return only tweet contents parsable in js' }],
    });


    const prompt = promptResponse['data']['choices'][0]['message']['content']
    console.log('Received prompt from ChatGPT: ', prompt );

    // console.log("Generating thread using ChatGPT...");
    // // Generate the thread using OpenAI's GPT model
    // const threadResponse = await openai.createChatCompletion({
    //     model: 'gpt-3.5-turbo',
    //     messages: [{ role: 'user', content: prompt }],
    // });
    // const thread = threadResponse['data']['choices'][0]['message']['content'].text;
    // console.log(`Received thread from ChatGPT: ${thread}`);

    console.log("Splitting thread into individual tweets...");
    // Split the thread into individual tweets
    const tweets = thread.match(/(.|[\r\n]){1,280}/g);

    console.log("Posting tweets as a thread...");
    // Post the tweets as a thread
    const firstTweet = await client.post('statuses/update', { status: tweets[0] });
    console.log(`Tweeted: ${tweets[0]}`);
    for (let i = 1; i < tweets.length; i++) {
        await client.post('statuses/update', { status: tweets[i], in_reply_to_status_id: firstTweet.id_str, auto_populate_reply_metadata: true });
        console.log(`Tweeted: ${tweets[i]}`);
    }
    console.log("Thread posted successfully!");
}

postTwitterThread()
// Post a thread every 12 hours
setInterval(postTwitterThread, 12 * 60 * 60 * 1000);