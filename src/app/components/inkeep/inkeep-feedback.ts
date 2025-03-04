"use server";

import { Feedback } from "@/app/components/rate";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { ReadableStream } from "stream/web";

const apiKey = process.env.INKEEP_API_KEY;

export async function onRateAction(
  url: string,
  feedback: Feedback,
): Promise<ReadableStream<string>> {
  console.log("Starting feedback submission:", { url, feedback });

  const openai = createOpenAI({
    apiKey: apiKey,
    baseURL: "https://api.inkeep.com/v1",
  });

  try {
    const { textStream } = streamText({
      model: openai("inkeep-qa-sonnet-3-5"),
      messages: [
        {
          role: "user",
          content: `Feedback - URL: ${url}\nRating: ${feedback.opinion}\nMessage: ${feedback.message}\n\nInstructions: Begin your response with "Thank you for providing feedback." Do not include any code in your response. If the feedback is vague or not specific, politely ask for more detailed feedback, explaining that specific details will help us improve the content more effectively. If the feedback mentions specific topics, provide links to relevant documentation or resources that might help address their concerns, but follow these restrictions:
      1. Do NOT reference or link back to the same URL (${url}) that this feedback is about
      2. Each link should be unique and descriptive of the specific resource
      
      Suggest different, complementary resources that might be helpful while following these guidelines.`,
        },
      ],
    });

    // Collect the full response to log it later
    let fullResponse = "";

    return new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of textStream) {
            // Add chunk to the full response
            fullResponse += chunk;
            controller.enqueue(chunk);
          }

          // After the stream is complete, log the conversation and feedback
          try {
            // Step 1: Log the conversation to Inkeep Analytics API with both the user message and AI response
            const conversationResult = await logConversationToInkeep(
              url,
              feedback,
              fullResponse,
            );

            if (!conversationResult) {
              console.error("Failed to log conversation");
            } else {
              console.log(
                "Conversation logged with ID:",
                conversationResult.id,
              );

              // Step 2: Get the assistant message ID from the conversation result (second message)
              const messageId = conversationResult.messages?.[1]?.id;

              if (!messageId) {
                console.error(
                  "Failed to get assistant message ID from conversation result",
                );
              } else {
                console.log(
                  "Using assistant message ID for feedback:",
                  messageId,
                );

                // Step 3: Log the feedback to Inkeep Analytics API using the assistant message ID
                await logFeedbackToInkeep(url, feedback, messageId);
              }
            }
          } catch (error) {
            console.error("Error in feedback logging process:", error);
            // Continue with the process even if logging fails
          }

          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });
  } catch (error) {
    console.error("Failed to submit feedback:", error);

    // Create a stream with the error message
    return new ReadableStream({
      start(controller) {
        controller.enqueue("Error processing your feedback. Please try again.");
        controller.close();
      },
    });
  }
}

// Log conversation to Inkeep Analytics API and return the conversation data with IDs
async function logConversationToInkeep(
  url: string,
  feedback: Feedback,
  aiResponse: string,
) {
  try {
    // Create a conversation log with the feedback and AI response
    const conversationData = {
      type: "openai",
      messages: [
        {
          role: "user",
          content: `• ${feedback.opinion.toUpperCase()} \n• URL: ${url}\n• INFO: ${feedback.message}`,
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
      //   userProperties: {
      //     // You can add user properties here if available
      //   },
    };

    // Log the conversation to Inkeep Analytics API
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
      throw new Error(`Failed to log conversation: ${response.status}`);
    }

    const result = await response.json();
    console.log("Conversation logged successfully:", result);

    return result;
  } catch (error) {
    console.error("Error logging conversation to Inkeep:", error);
    // Continue with the process even if logging fails
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
    // Map from your feedback opinion values to what Inkeep expects
    const feedbackType =
      feedback.opinion === "positive" ? "positive" : "negative";

    const feedbackData = {
      type: feedbackType, // Must be exactly "positive" or "negative"
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

    console.log("Sending feedback data:", JSON.stringify(feedbackData));

    // Log the feedback to Inkeep Analytics API
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
      throw new Error(
        `Failed to log feedback: ${response.status} - ${errorText}`,
      );
    }

    const result = await response.json();
    console.log("Feedback logged successfully:", result);

    return result;
  } catch (error) {
    console.error("Error logging feedback to Inkeep:", error);
    return null;
  }
}
