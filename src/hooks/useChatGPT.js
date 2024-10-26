import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";

export function useChatGPT() {
  const setting = useSelector((state) => state.setting);
  const [loading, setLoading] = useState(false);

  const callChatGPT = async (prompt) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: setting.model,
          messages: [{ role: "user", content: prompt }],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${setting.openaiApiKey}`,
          },
        },
      );
      return response.data.choices[0].message.content;
    } catch (err) {
      console.error("Failed to call GPT:", err);
      alert("Failed to call GPT");
      return "Failed to call GPT";
    } finally {
      setLoading(false);
    }
  };

  return { callChatGPT, loading };
}
