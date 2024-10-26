import { useEffect, useRef, useCallback } from "react";

import { WavRecorder, WavStreamPlayer } from "./wavtools/index.js";
import { upsertMessage, clearMessages } from "./redux/chatHistorySlice.js";
import { connect, disconnect } from "./redux/connectSlice.js";
import { RealtimeClient } from "@openai/realtime-api-beta";
import { useSelector, useDispatch } from "react-redux";
import { Button, Container, Grid } from "@mui/material";
import ChatHistory from "./components/ChatHistory.js";
import { useTranslation } from "react-i18next";

export default function AudioTalk() {
  const { t } = useTranslation();

  const wavRecorder = new WavRecorder({ sampleRate: 24000 });
  const wavStreamPlayer = new WavStreamPlayer({ sampleRate: 24000 });

  const chatHistory = useSelector((state) => state.chatHistory.chatHistory);
  const isConnected = useSelector((state) => state.connect.isConnected);
  const setting = useSelector((state) => state.setting);
  const dispatch = useDispatch();
  const chatHistoryRef = useRef(chatHistory);

  const client = new RealtimeClient({
    apiKey: setting.openaiApiKey,
    dangerouslyAllowAPIKeyInBrowser: true,
  });

  useEffect(() => {
    chatHistoryRef.current = chatHistory;
  }, [chatHistory]);

  const connectConversation = useCallback(async () => {
    dispatch(connect());
    await wavRecorder.begin();
    await wavStreamPlayer.connect();
    await client.connect();

    client.sendUserMessageContent([
      {
        type: `input_text`,
        text: `Hello!`,
      },
    ]);

    if (client.getTurnDetectionType() === "server_vad") {
      try {
        await wavRecorder.record((data) => client.appendInputAudio(data.mono));
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  const disconnectConversation = useCallback(async () => {
    dispatch(disconnect());
    client.disconnect();
    await wavRecorder.end();
    await wavStreamPlayer.interrupt();
  }, []);

  useEffect(() => {
    client.updateSession({
      instructions: `You are an ${setting.targetLanguage} conversation partner.`,
    });
    client.updateSession({ input_audio_transcription: { model: "whisper-1" } });
    client.updateSession({ turn_detection: { type: "server_vad" } });

    client.on("error", (event) => console.error(event));

    client.on("conversation.interrupted", async () => {
      console.log("interrupted");
      const trackSampleOffset = await wavStreamPlayer.interrupt();
      if (trackSampleOffset?.trackId) {
        const { trackId, offset } = trackSampleOffset;
        await client.cancelResponse(trackId, offset);
      }
    });

    client.on("conversation.updated", async ({ item, delta }) => {
      if (delta?.audio) {
        wavStreamPlayer.add16BitPCM(delta.audio, item.id);
      }
      if (item.formatted.transcript.trim() !== "") {
        if (chatHistoryRef.current.findIndex((i) => i.id === item.id) !== -1) {
          dispatch(
            upsertMessage({
              id: item.id,
              role: item.role,
              content: item.formatted.transcript,
            }),
          );
        } else {
          dispatch(
            upsertMessage({
              id: item.id,
              role: item.role,
              content: item.formatted.transcript,
            }),
          );
          const items = client.conversation.getItems();
          items.slice(0, -3).forEach((item) => {
            client.deleteItem(item.id);
          });
        }
      }
    });

    return () => {
      client.reset();
    };
  }, []);

  return (
    <Container maxWidth="md">
      <ChatHistory chatHistory={chatHistory} />

      <Grid
        container
        justifyContent="center"
        style={{ marginTop: 20 }}
        spacing={2}
      >
        <Grid item>
          <Button
            variant="contained"
            color={isConnected ? "secondary" : "primary"}
            onClick={isConnected ? disconnectConversation : connectConversation}
          >
            {isConnected ? t("stop") : t("start_recording")}
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => dispatch(clearMessages())}
          >
            {t("clear_history")}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
