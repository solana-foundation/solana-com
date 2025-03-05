"use server";

import { Feedback } from "@/app/components/rate";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { ReadableStream } from "stream/web";

const apiKey = process.env.INKEEP_API_KEY;

// Helper function to create the prompt
function createPromptContent(url: string, feedback: Feedback): string {
  return `Feedback received for URL: ${url}
Rating: ${feedback.opinion}
Message: ${feedback.message}

Instructions:
1. Begin your response with: "Thank you for providing feedback."
2. Do not include any code in your reply.
3. Respond concisely.
3. If the feedback is vague or lacks detail, politely request more specific feedback, explaining that detailed input helps us improve more effectively.
4. When specific topics are mentioned:
   - Only provide links to documentation or resources you are confident will address their concerns.
   - Do NOT reference or link back to the same URL (${url}) related to the feedback.
   - Ensure each link is unique and clearly describes the resource.
   - Omit links if you are unsure about their relevance.

Also, suggest additional, complementary resources that might be helpful while adhering to the above guidelines.`;
}

export async function onRateAction(
  url: string,
  feedback: Feedback,
): Promise<ReadableStream<string>> {
  if (!apiKey) {
    console.warn("Missing Inkeep API key, skipping analytics logging");
    return errorStream();
  }

  const openai = createOpenAI({
    apiKey: apiKey,
    baseURL: "https://api.inkeep.com/v1",
  });

  let textStream;
  try {
    const streamResult = streamText({
      model: openai("inkeep-qa-sonnet-3-5"),
      messages: [
        {
          role: "user",
          content: createPromptContent(url, feedback),
        },
      ],
    });
    textStream = streamResult.textStream;
  } catch (error) {
    console.error("Failed to create text stream:", error);
    return errorStream();
  }

  // Process the stream and handle logging
  return new ReadableStream({
    async start(controller) {
      let fullResponse = "";

      try {
        // Step 1: Stream the response to the user
        for await (const chunk of textStream) {
          fullResponse += chunk;
          controller.enqueue(chunk);
        }

        // Step 2: Log the conversation
        try {
          await logFeedbackToAnalytics(url, feedback, fullResponse);
        } catch (error) {
          console.error("Analytics logging failed:", error);
        }

        // Step 3: Close the stream
        controller.close();
      } catch (error) {
        console.error("Error processing stream:", error);
        // If streaming fails, ensure we still close properly with a message
        if (fullResponse.length === 0) {
          controller.enqueue("Thank you for your feedback");
        }
        controller.close();
      }
    },
  });
}

// Separate function to handle all analytics logging
async function logFeedbackToAnalytics(
  url: string,
  feedback: Feedback,
  aiResponse: string,
): Promise<void> {
  try {
    // Step 1: Log the conversation
    const conversationResult = await logConversationToInkeep(
      url,
      feedback,
      aiResponse,
    );
    if (!conversationResult) {
      console.error("Skipping feedback logging as conversation logging failed");
      return;
    }

    // Step 2: Get the message ID and log the feedback (thumb up or down)
    const messageId = conversationResult.messages?.[1]?.id;
    if (!messageId) {
      console.error("Skipping feedback logging as message ID is missing");
      return;
    }

    // Step 3: Log the thumbs up/down feedback
    await logFeedbackToInkeep(url, feedback, messageId);
  } catch (error) {
    console.error("Error in analytics logging:", error);
  }
}

// Log conversation to Inkeep Analytics API
async function logConversationToInkeep(
  url: string,
  feedback: Feedback,
  aiResponse: string,
) {
  try {
    // Only log this data to Inkeep Analytics
    const logMessage = `• ${feedback.opinion.toUpperCase()} \n• URL: ${url}\n• Message: ${feedback.message}`;

    const conversationData = {
      type: "openai",
      messages: [
        {
          role: "user",
          content: logMessage,
        },
        {
          role: "assistant",
          content: aiResponse,
        },
      ],
      properties: {
        url: url,
        opinion: feedback.opinion,
        source: "solana_docs",
      },
      //   userProperties: {},
    };

    const response = await fetch(
      "https://api.analytics.inkeep.com/conversations",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(conversationData),
      },
    );

    if (!response.ok) {
      console.error(`Failed to log conversation: ${response.status}`);
      return null;
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error("Error logging conversation to Inkeep:", error);
    return null;
  }
}

// Log feedback to Inkeep Analytics API
async function logFeedbackToInkeep(
  url: string,
  feedback: Feedback,
  messageId: string,
) {
  try {
    const feedbackData = {
      type: feedback.opinion,
      messageId: messageId,
      reasons: [
        {
          label: "user_feedback",
          details: feedback.message,
        },
      ],
      userProperties: {
        url: url,
      },
    };

    // Log the feedback to Inkeep Analytics API (thumb up or down)
    const response = await fetch("https://api.analytics.inkeep.com/feedback", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(feedbackData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Failed to log feedback: ${response.status} - ${errorText}`,
      );
      return null;
    }

    const result = await response.json();
    console.log("Inkeep ID:", result.id);

    return result;
  } catch (error) {
    console.error("Error logging feedback to Inkeep:", error);
    return null;
  }
}

// return empty string if error
const errorStream = () => {
  return new ReadableStream({
    start(controller) {
      controller.enqueue("");
      controller.close();
    },
  });
};
