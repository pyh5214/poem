import React, { useRef, useState, useEffect } from 'react';
import { Box, IconButton, Slider, Typography } from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Replay as ReplayIcon,
  VolumeUp as VolumeIcon,
  VolumeOff as MuteIcon,
} from '@mui/icons-material';

interface MusicPlayerProps {
  audioData: string; // base64 encoded MP3
  onEnded?: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ audioData, onEnded }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);

  // 오디오 소스 URL 생성
  const audioSrc = `data:audio/mp3;base64,${audioData}`;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      // 루프 재생
      audio.currentTime = 0;
      audio.play();
      setIsPlaying(true);
      onEnded?.();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onEnded]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (_: Event, value: number | number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = value as number;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (_: Event, value: number | number[]) => {
    setVolume(value as number);
    setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleRestart = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    setCurrentTime(0);
    if (!isPlaying) {
      audio.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Box
      sx={{
        backgroundColor: 'rgba(56, 57, 42, 0.05)',
        borderRadius: '16px',
        p: 2,
        mt: 2,
      }}
    >
      <audio ref={audioRef} src={audioSrc} preload="metadata" />

      {/* 메인 컨트롤 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {/* 재생/일시정지 버튼 */}
        <IconButton
          onClick={togglePlay}
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </IconButton>

        {/* 다시 재생 버튼 */}
        <IconButton
          onClick={handleRestart}
          size="small"
          sx={{ color: 'text.secondary' }}
        >
          <ReplayIcon fontSize="small" />
        </IconButton>

        {/* 진행 바 */}
        <Box sx={{ flex: 1, mx: 2 }}>
          <Slider
            value={currentTime}
            min={0}
            max={duration || 100}
            onChange={handleSeek}
            sx={{
              color: 'primary.main',
              '& .MuiSlider-thumb': {
                width: 12,
                height: 12,
              },
              '& .MuiSlider-track': {
                height: 4,
              },
              '& .MuiSlider-rail': {
                height: 4,
                opacity: 0.3,
              },
            }}
          />
        </Box>

        {/* 시간 표시 */}
        <Typography
          sx={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '0.625rem',
            color: 'text.secondary',
            minWidth: '60px',
            textAlign: 'right',
          }}
        >
          {formatTime(currentTime)} / {formatTime(duration)}
        </Typography>
      </Box>

      {/* 볼륨 컨트롤 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mt: 1,
          pl: 6,
        }}
      >
        <IconButton
          onClick={toggleMute}
          size="small"
          sx={{ color: 'text.secondary' }}
        >
          {isMuted || volume === 0 ? (
            <MuteIcon fontSize="small" />
          ) : (
            <VolumeIcon fontSize="small" />
          )}
        </IconButton>

        <Slider
          value={isMuted ? 0 : volume}
          min={0}
          max={1}
          step={0.1}
          onChange={handleVolumeChange}
          sx={{
            width: 80,
            color: 'text.secondary',
            '& .MuiSlider-thumb': {
              width: 10,
              height: 10,
            },
            '& .MuiSlider-track': {
              height: 3,
            },
            '& .MuiSlider-rail': {
              height: 3,
              opacity: 0.3,
            },
          }}
        />

        <Typography
          sx={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '0.5rem',
            color: 'text.secondary',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            ml: 'auto',
          }}
        >
          Loop ON
        </Typography>
      </Box>
    </Box>
  );
};

export default MusicPlayer;
