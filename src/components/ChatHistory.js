import { Card, CardContent, Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";
import AssistantMessage from "./AssistantMessage";
import UserMessage from "./UserMessage";

const ChatHistory = ({ chatHistory }) => {
  return (
    <Grid container spacing={2} direction="column">
      {chatHistory.map((message) => (
        <Grid xs={12} key={message.id}>
          <Card variant="none">
            <CardContent>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent={
                  message.role === "assistant" ? "flex-start" : "flex-end"
                }
                spacing={2}
              >
                {message.role === "assistant" ? (
                  <AssistantMessage message={message} />
                ) : (
                  <UserMessage message={message} />
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ChatHistory;
