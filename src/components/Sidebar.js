import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Drawer,
  TextField,
  Typography,
  MenuItem,
  Slider,
  Box,
} from "@mui/material";
import {
  setOpenAIApiKey,
  setNativeLanguage,
  setTargetLanguage,
  setSpeakingSpeed,
  setModel,
} from "../redux/settingSlice";
import { useTranslation } from "react-i18next";

export default function Sidebar({ open, onClose }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const openaiApiKey = useSelector((state) => state.setting.openaiApiKey);
  const nativeLanguage = useSelector((state) => state.setting.nativeLanguage);
  const targetLanguage = useSelector((state) => state.setting.targetLanguage);
  const speakingSpeed = useSelector((state) => state.setting.speakingSpeed);
  const model = useSelector((state) => state.setting.model);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box p={3} width={300}>
        <Typography variant="h6" gutterBottom>
          Settings
        </Typography>

        <TextField
          label={t("openai_api_key")}
          variant="outlined"
          fullWidth
          value={openaiApiKey || ""}
          onChange={(e) => dispatch(setOpenAIApiKey(e.target.value))}
          margin="normal"
        />

        <TextField
          select
          label={t("native_language")}
          variant="outlined"
          fullWidth
          value={nativeLanguage}
          onChange={(e) => dispatch(setNativeLanguage(e.target.value))}
          margin="normal"
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="ja">Japanese</MenuItem>
        </TextField>

        <TextField
          select
          label={t("target_language")}
          variant="outlined"
          fullWidth
          value={targetLanguage}
          onChange={(e) => dispatch(setTargetLanguage(e.target.value))}
          margin="normal"
        >
          <MenuItem value="english">English</MenuItem>
          <MenuItem value="japanese">Japanese</MenuItem>
          <MenuItem value="spanish">Spanish</MenuItem>
        </TextField>

        {/* wavStreamPlayerは実行中に速度をいじれなさそうなので非表示 */}
        <Typography gutterBottom style={{ display: "none" }}>
          {t("speaking_speed")}
        </Typography>
        <Box display="flex" alignItems="center" style={{ display: "none" }}>
          <Typography variant="body2" style={{ marginRight: 8 }}>
            0.5x
          </Typography>
          <Slider
            value={speakingSpeed}
            onChange={(e, value) => dispatch(setSpeakingSpeed(value))}
            step={0.1}
            min={0.5}
            max={2}
            valueLabelDisplay="auto"
            aria-labelledby="speaking-speed-slider"
            style={{ flex: 1 }}
          />
          <Typography variant="body2" style={{ marginLeft: 8 }}>
            2x
          </Typography>
        </Box>

        <TextField
          select
          label={t("translation_model")}
          variant="outlined"
          fullWidth
          value={model}
          onChange={(e) => dispatch(setModel(e.target.value))}
          margin="normal"
        >
          <MenuItem value="gpt-4o-mini">GPT-4o Mini</MenuItem>
          <MenuItem value="gpt-4o">GPT-4o</MenuItem>
          <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo</MenuItem>
        </TextField>
      </Box>
    </Drawer>
  );
}
