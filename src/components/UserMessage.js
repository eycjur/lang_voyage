import {
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import { Person, Edit } from "@mui/icons-material";
import { useState } from "react";
import { useChatGPT } from "../hooks/useChatGPT";
import { updateMessage } from "../redux/chatHistorySlice.js";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const UserMessage = ({ message }) => {
  const { t } = useTranslation();
  const { callChatGPT } = useChatGPT();
  const [isEdit, setIsEdit] = useState(false);
  const [editValue, setEditValue] = useState(message.content);
  const setting = useSelector((state) => state.setting);
  const dispatch = useDispatch();

  const handleTranslateClick = async (id) => {
    const newContent = await callChatGPT(
      `Please revise the following content in ${setting.targetLanguage} for a more polished expression: ${editValue}`,
    );
    dispatch(updateMessage({ id: id, content: newContent }));
    setEditValue(newContent);
    setIsEdit(false);
  };

  const handleEditClick = () => {
    setIsEdit(true);
    setEditValue("");
  };

  return (
    <>
      <Box
        textAlign="right"
        sx={{
          maxWidth: "80%",
          wordWrap: "break-word",
          overflowWrap: "break-word",
        }}
      >
        {isEdit ? (
          <>
            <TextField
              fullWidth
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              variant="outlined"
              size="small"
              placeholder={t("editMessage")}
            />
            <Button
              onClick={() => handleTranslateClick(message.id)}
              disabled={!editValue.trim()}
            >
              {t("translate")}
            </Button>
          </>
        ) : (
          <Typography
            variant="body1"
            sx={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
          >
            {editValue}
          </Typography>
        )}
      </Box>
      <Avatar>
        <Person />
      </Avatar>
      <IconButton onClick={() => handleEditClick()}>
        <Edit fontSize="small" />
      </IconButton>
    </>
  );
};

export default UserMessage;
