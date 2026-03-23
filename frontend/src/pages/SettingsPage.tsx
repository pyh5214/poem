import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Select,
  MenuItem,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { clearAllPostcards, getPostcardCount } from '../utils/storage';

const SettingsPage: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('ko');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const postcardCount = getPostcardCount();

  const handleDarkModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDarkMode(event.target.checked);
    // TODO: 실제 다크모드 구현
    alert('다크모드는 곧 지원될 예정입니다.');
  };

  const handleLanguageChange = (event: any) => {
    setLanguage(event.target.value);
    // TODO: 실제 언어 변경 구현
    alert('언어 변경은 곧 지원될 예정입니다.');
  };

  const handleDeleteAll = () => {
    clearAllPostcards();
    setDeleteDialogOpen(false);
    alert('모든 데이터가 삭제되었습니다.');
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        py: 3,
        px: 2,
      }}
    >
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: "'Newsreader', serif",
            fontStyle: 'italic',
            fontWeight: 400,
            color: 'text.primary',
          }}
        >
          Settings
        </Typography>
      </Box>

      {/* Settings Card */}
      <Box
        sx={{
          backgroundColor: 'surface.containerLowest',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(56, 57, 42, 0.08)',
          overflow: 'hidden',
        }}
      >
        <List disablePadding>
          {/* Theme Setting */}
          <ListItem sx={{ py: 2, px: 3 }}>
            <ListItemText
              primary={
                <Typography
                  sx={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 500,
                    color: 'text.primary',
                  }}
                >
                  테마
                </Typography>
              }
              secondary={
                <Typography
                  sx={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '0.75rem',
                    color: 'text.secondary',
                  }}
                >
                  다크 모드 사용
                </Typography>
              }
            />
            <ListItemSecondaryAction>
              <Switch
                checked={darkMode}
                onChange={handleDarkModeChange}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: 'primary.main',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: 'primary.main',
                  },
                }}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <Divider sx={{ borderColor: 'outline.variant' }} />

          {/* Language Setting */}
          <ListItem sx={{ py: 2, px: 3 }}>
            <ListItemText
              primary={
                <Typography
                  sx={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 500,
                    color: 'text.primary',
                  }}
                >
                  언어
                </Typography>
              }
              secondary={
                <Typography
                  sx={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '0.75rem',
                    color: 'text.secondary',
                  }}
                >
                  앱 표시 언어
                </Typography>
              }
            />
            <ListItemSecondaryAction>
              <Select
                value={language}
                onChange={handleLanguageChange}
                size="small"
                sx={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '0.875rem',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'outline.variant',
                  },
                }}
              >
                <MenuItem value="ko">한국어</MenuItem>
                <MenuItem value="en">English</MenuItem>
              </Select>
            </ListItemSecondaryAction>
          </ListItem>

          <Divider sx={{ borderColor: 'outline.variant' }} />

          {/* Data Management */}
          <ListItem sx={{ py: 2, px: 3 }}>
            <ListItemText
              primary={
                <Typography
                  sx={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 500,
                    color: 'text.primary',
                  }}
                >
                  데이터 관리
                </Typography>
              }
              secondary={
                <Typography
                  sx={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '0.75rem',
                    color: 'text.secondary',
                  }}
                >
                  저장된 엽서 {postcardCount}개
                </Typography>
              }
            />
            <ListItemSecondaryAction>
              <Button
                variant="text"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
                disabled={postcardCount === 0}
                sx={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                }}
              >
                전체 삭제
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Box>

      {/* App Info */}
      <Box
        sx={{
          mt: 4,
          textAlign: 'center',
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '0.625rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'text.secondary',
          }}
        >
          Version 1.0.0
        </Typography>
        <Typography
          sx={{
            fontFamily: "'Newsreader', serif",
            fontStyle: 'italic',
            fontSize: '0.75rem',
            color: 'text.secondary',
            mt: 0.5,
          }}
        >
          Analog Archivist
        </Typography>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle
          sx={{
            fontFamily: "'Newsreader', serif",
            fontStyle: 'italic',
          }}
        >
          모든 데이터를 삭제할까요?
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '0.875rem',
              color: 'text.secondary',
            }}
          >
            저장된 {postcardCount}개의 엽서가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              fontFamily: "'Space Grotesk', sans-serif",
              textTransform: 'uppercase',
            }}
          >
            취소
          </Button>
          <Button
            onClick={handleDeleteAll}
            color="error"
            sx={{
              fontFamily: "'Space Grotesk', sans-serif",
              textTransform: 'uppercase',
            }}
          >
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SettingsPage;
