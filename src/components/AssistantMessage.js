import {
  Box,
  Typography,
  Avatar,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { SmartToy } from "@mui/icons-material";
import { useState, useCallback } from "react";
import { useChatGPT } from "../hooks/useChatGPT";
import memoize from "memoizee";
import { useSelector } from "react-redux";

const WordWithTooltip = ({ word }) => {
  const { callChatGPT, loading } = useChatGPT();
  const [meaning, setMeaning] = useState("");
  const setting = useSelector((state) => state.setting);

  const cachedFetchMeaning = memoize(async (word) => {
    const wordMeaning = await callChatGPT(
      `Please briefly answer the meaning of the following words translated into ${setting.nativeLanguage}: ${word}`,
    );
    return wordMeaning;
  });

  const handleTooltipOpen = useCallback(async () => {
    if (!word) return;
    const wordMeaning = await cachedFetchMeaning(word);
    setMeaning(wordMeaning);
  }, [word]);

  return (
    <Tooltip
      title={loading ? <CircularProgress size={20} /> : meaning}
      arrow
      onOpen={handleTooltipOpen}
    >
      <span style={{ cursor: "pointer", marginRight: "4px" }}>{word}</span>
    </Tooltip>
  );
};

const AssistantMessage = ({ message }) => (
  <>
    <Avatar>
      <SmartToy />
    </Avatar>
    <Box
      textAlign="left"
      sx={{
        maxWidth: "80%",
        wordWrap: "break-word",
        overflowWrap: "break-word",
      }}
    >
      <Typography
        variant="body1"
        sx={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
      >
        {message.content.split(" ").map((word, index) => (
          <WordWithTooltip word={word} key={index} />
        ))}
      </Typography>
    </Box>
  </>
);

export default AssistantMessage;
