import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Dialog, IconButton, Button } from '@mui/material';
import { Close as CloseIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { PolaroidGrid } from '../components/PolaroidCard';
import { PostcardView } from '../components/PostcardView';
import { getPostcards, deletePostcard, SavedPostcard } from '../utils/storage';

const LibraryPage: React.FC = () => {
  const [postcards, setPostcards] = useState<SavedPostcard[]>([]);
  const [selectedPostcard, setSelectedPostcard] = useState<SavedPostcard | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadPostcards();
  }, []);

  const loadPostcards = () => {
    const saved = getPostcards();
    setPostcards(saved);
  };

  const handleCardClick = (postcard: SavedPostcard) => {
    setSelectedPostcard(postcard);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedPostcard(null);
  };

  const handleDelete = () => {
    if (selectedPostcard) {
      deletePostcard(selectedPostcard.id);
      loadPostcards();
      handleCloseDialog();
    }
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
            mb: 0.5,
          }}
        >
          Archive
        </Typography>
        <Typography
          sx={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '0.75rem',
            color: 'text.secondary',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          {postcards.length} memories
        </Typography>
      </Box>

      {/* Polaroid Grid */}
      <PolaroidGrid postcards={postcards} onCardClick={handleCardClick} />

      {/* Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            overflow: 'visible',
          },
        }}
      >
        <Box sx={{ position: 'relative', p: 2 }}>
          {/* Close Button */}
          <IconButton
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              top: -16,
              right: -16,
              backgroundColor: 'surface.containerLowest',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              zIndex: 10,
              '&:hover': {
                backgroundColor: 'surface.containerLow',
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          {selectedPostcard && (
            <>
              <PostcardView
                imageData={selectedPostcard.imageData}
                poem={selectedPostcard.poem}
                createdAt={selectedPostcard.createdAt}
                poetStyle={selectedPostcard.poetStyle}
              />

              {/* Delete Button */}
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button
                  variant="text"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}
                  sx={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '0.75rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  삭제
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Dialog>
    </Container>
  );
};

export default LibraryPage;
