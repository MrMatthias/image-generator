import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  organization: "org-nyf2x6TLGk8yivna21JTHHHk",
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default openai;
