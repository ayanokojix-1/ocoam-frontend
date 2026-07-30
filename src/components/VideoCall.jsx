import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhone, FaRecordVinyl, FaStop, FaEdit, FaCheck, FaTimes, FaHandPaper } from "react-icons/fa";

export default function VideoCall() {
  const { accessCode } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // Only used for the very first render, before the server-verified role
  // comes back from the room token — never trusted for anything privileged.
  const [role, setRole] = useState(searchParams.get('role') || 'student');

  // Socket and WebRTC refs
  const socketRef = useRef(null);
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peersRef = useRef({});
  const audioElementsRef = useRef({}); // For separate audio elements
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const roomTokenRef = useRef(null);

  // State management
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [localUserId] = useState(`${role}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [userName, setUserName] = useState(role === 'moderator' ? 'Moderator' : 'Student');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [notification, setNotification] = useState(null);
  const [countdown, setCountdown] = useState(null);
  
  // Media controls state
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [voiceActivity, setVoiceActivity] = useState({});
  
  // NEW: Raise hand state
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [raisedHands, setRaisedHands] = useState(new Set());

  // Notification component
  const Notification = ({ message, type, onClose }) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500';

    return (
      <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3`}>
        <span>{message}</span>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          ×
        </button>
      </div>
    );
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  // Name editing functions
  const handleNameEdit = () => {
    setIsEditingName(true);
    setTempName(userName);
  };

  const handleNameSave = () => {
    if (tempName.trim() && tempName.trim() !== userName) {
      const newName = tempName.trim();
      setUserName(newName);
      setIsEditingName(false);
      
      if (socketRef.current) {
        socketRef.current.emit('name-changed', {
          roomId: accessCode,
          newName: newName
        });
      }
      
      showNotification('Name updated successfully!', 'success');
    } else {
      setIsEditingName(false);
    }
  };

  const handleNameCancel = () => {
    setTempName(userName);
    setIsEditingName(false);
  };

  // NEW: Raise hand functionality
  const toggleRaiseHand = () => {
    const newHandState = !isHandRaised;
    setIsHandRaised(newHandState);
    
    if (socketRef.current) {
      socketRef.current.emit('hand-raised', {
        roomId: accessCode,
        isRaised: newHandState,
        userName: userName
      });
    }
    
    showNotification(
      newHandState ? 'Hand raised!' : 'Hand lowered', 
      newHandState ? 'info' : 'success'
    );
  };

  // Voice activity detection
  const setupVoiceDetection = (stream) => {
    try {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      microphone.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const checkVoiceActivity = () => {
        if (!analyserRef.current) return;
        
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / bufferLength;
        
        const isActive = average > 20;
        
        if (socketRef.current) {
          socketRef.current.emit('voice-activity', {
            roomId: accessCode,
            isActive
          });
        }
        
        setVoiceActivity(prev => ({
          ...prev,
          [localUserId]: isActive
        }));
        
        setTimeout(checkVoiceActivity, 100);
      };
      
      checkVoiceActivity();
    } catch (error) {
      console.error('Voice detection not supported:', error);
    }
  };

  // UPDATED: Initialize media stream with audio fallback
  const initializeMedia = async () => {
    try {
      // Try video + audio first
      let stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      setupVoiceDetection(stream);
      showNotification('Camera and microphone connected', 'success');
      
      return stream;
    } catch (videoError) {
      console.warn('Video access failed, trying audio only:', videoError);
      
      try {
        // Fallback to audio only
        const audioStream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: true
        });
        
        localStreamRef.current = audioStream;
        setupVoiceDetection(audioStream);
        setIsVideoOff(true); // Mark video as off since we couldn't get it
        showNotification('Audio connected (video unavailable)', 'warning');
        
        return audioStream;
      } catch (audioError) {
        console.error('Audio access also failed:', audioError);
        showNotification('Failed to access microphone. Check permissions.', 'error');
        return null;
      }
    }
  };

  // UPDATED: Create separate audio elements for each participant
  const createAudioElement = (socketId) => {
    if (!audioElementsRef.current[socketId]) {
      const audio = document.createElement('audio');
      audio.autoplay = true;
      audio.controls = false;
      audio.style.display = 'none';
      document.body.appendChild(audio);
      audioElementsRef.current[socketId] = audio;
      console.log(`🔊 Created audio element for ${socketId}`);
    }
    return audioElementsRef.current[socketId];
  };

  // ICE servers: STUN always available; TURN only if a provider has been
  // configured (needed for callers behind restrictive/symmetric NATs, since
  // STUN alone can't relay media). Inactive/no-op until VITE_TURN_URL is set.
  const getIceServers = () => {
    const iceServers = [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ];

    if (import.meta.env.VITE_TURN_URL) {
      iceServers.push({
        urls: import.meta.env.VITE_TURN_URL,
        username: import.meta.env.VITE_TURN_USERNAME,
        credential: import.meta.env.VITE_TURN_CREDENTIAL
      });
    }

    return iceServers;
  };

  // Only the side that originally sent the offer attempts a restart, so both
  // sides never race to restart the same connection at once.
  const attemptIceRestart = async (remoteSocketId, peerConnection) => {
    try {
      console.log(`🔄 Attempting ICE restart for ${remoteSocketId}`);
      const offer = await peerConnection.createOffer({ iceRestart: true });
      await peerConnection.setLocalDescription(offer);

      if (socketRef.current) {
        socketRef.current.emit('offer', {
          offer,
          to: remoteSocketId,
          from: socketRef.current.id
        });
      }
    } catch (error) {
      console.error(`❌ ICE restart failed for ${remoteSocketId}:`, error);
    }
  };

  // UPDATED: Better peer connection with audio fallback
  const createPeerConnection = (remoteSocketId, isInitiator = false) => {
    console.log(`🔗 Creating peer connection for ${remoteSocketId} (initiator: ${isInitiator})`);

    // Close existing connection if it exists
    if (peersRef.current[remoteSocketId]) {
      console.log(`Closing existing peer connection for ${remoteSocketId}`);
      peersRef.current[remoteSocketId].close();
      delete peersRef.current[remoteSocketId];
    }

    const peerConnection = new RTCPeerConnection({
      iceServers: getIceServers()
    });
    peerConnection.isInitiator = isInitiator;

    // Store pending ICE candidates
    const pendingCandidates = [];
    let remoteDescriptionSet = false;
    let restartAttempted = false;

    // Connection state monitoring
    peerConnection.onconnectionstatechange = () => {
      console.log(`Connection state for ${remoteSocketId}:`, peerConnection.connectionState);
      if (peerConnection.connectionState === 'connected') {
        console.log(`✅ Successfully connected to ${remoteSocketId}`);
        restartAttempted = false;
      } else if (peerConnection.connectionState === 'failed') {
        console.log(`❌ Connection failed for ${remoteSocketId}`);
        showNotification(`Connection lost with a participant, attempting to reconnect...`, 'warning');

        if (peerConnection.isInitiator && !restartAttempted) {
          restartAttempted = true;
          attemptIceRestart(remoteSocketId, peerConnection);
        }
      }
    };

    // Add local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStreamRef.current);
        console.log(`📤 Added ${track.kind} track to peer connection`);
      });
    }

    // UPDATED: Handle remote stream with audio fallback
    peerConnection.ontrack = (event) => {
      console.log(`🎥 Received ${event.track.kind} track from:`, remoteSocketId);
      const remoteStream = event.streams[0];
      
      // Always create audio element for audio playback
      const audioElement = createAudioElement(remoteSocketId);
      audioElement.srcObject = remoteStream;
      console.log(`🔊 Set audio stream for ${remoteSocketId}`);
      
      // Update participants state - even if video fails, we have audio
      setParticipants(prev => {
        const updated = prev.map(participant => 
          participant.socketId === remoteSocketId 
            ? { 
                ...participant, 
                stream: remoteStream,
                hasAudio: remoteStream.getAudioTracks().length > 0,
                hasVideo: remoteStream.getVideoTracks().length > 0
              }
            : participant
        );
        console.log(`✅ Updated participant ${remoteSocketId} with stream`);
        return updated;
      });
      
      // Show notification about connection type
      const hasVideo = remoteStream.getVideoTracks().length > 0;
      const hasAudio = remoteStream.getAudioTracks().length > 0;
      
      if (hasVideo && hasAudio) {
        showNotification('Participant connected with video & audio', 'success');
      } else if (hasAudio) {
        showNotification('Participant connected with audio only', 'info');
      }
    };

    // ICE candidate handling
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit('ice-candidate', {
          candidate: event.candidate,
          to: remoteSocketId,
          from: socketRef.current.id
        });
      }
    };

    // Process pending candidates
    peerConnection.processPendingCandidates = async () => {
      if (remoteDescriptionSet && pendingCandidates.length > 0) {
        console.log(`Processing ${pendingCandidates.length} pending candidates for ${remoteSocketId}`);
        for (const candidate of pendingCandidates) {
          try {
            await peerConnection.addIceCandidate(candidate);
          } catch (error) {
            console.error('Error adding queued candidate:', error);
          }
        }
        pendingCandidates.length = 0;
      }
    };

    peerConnection.pendingCandidates = pendingCandidates;
    peerConnection.setRemoteDescriptionSet = () => {
      remoteDescriptionSet = true;
      peerConnection.processPendingCandidates();
    };

    peersRef.current[remoteSocketId] = peerConnection;
    return peerConnection;
  };

  // Initialize socket connection
  const initializeSocket = (roomToken, myRole) => {
    const socket = io(import.meta.env.VITE_VIDEOCALL_URL);
    socketRef.current = socket;

    // Shared by both the join-room ack and the 'user-list' fallback event
    const handleUserList = (users) => {
      console.log('📝 Received user list:', users);

      const otherUsers = users.filter(user => {
        const isMe = user.socketId === socket.id;
        const hasValidId = user.socketId && user.socketId !== '';
        return !isMe && hasValidId;
      });

      // Clear existing connections
      Object.keys(peersRef.current).forEach(socketId => {
        if (peersRef.current[socketId]) {
          peersRef.current[socketId].close();
          delete peersRef.current[socketId];
        }
      });

      setParticipants(otherUsers.map(user => ({
        ...user,
        stream: null,
        hasAudio: false,
        hasVideo: false
      })));

      if (otherUsers.length === 0) return;

      (async () => {
        for (let i = 0; i < otherUsers.length; i++) {
          const user = otherUsers[i];
          console.log(`🤝 Initiating connection to ${user.name}`);

          const peerConnection = createPeerConnection(user.socketId, true);

          try {
            const offer = await peerConnection.createOffer({
              offerToReceiveAudio: true,
              offerToReceiveVideo: true
            });
            await peerConnection.setLocalDescription(offer);

            socket.emit('offer', {
              offer,
              to: user.socketId,
              from: socket.id
            });

            console.log(`📤 Sent offer to ${user.name}`);
          } catch (error) {
            console.error(`❌ Error creating offer for ${user.name}:`, error);
          }

          // Intentional pacing so we don't gather ICE candidates for every
          // peer at once on slower devices — not a race-condition workaround.
          if (i < otherUsers.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
      })();
    };

    socket.on('connect', () => {
      console.log('🔌 Connected to signaling server with ID:', socket.id);
      setIsConnected(true);

      socket.emit('join-room', { roomId: accessCode, token: roomToken }, (response) => {
        if (response?.error) {
          console.error('Join room failed:', response.error);
          showNotification(response.error, 'error');
          return;
        }
        handleUserList(response?.users || []);
      });
    });

    // Fallback path if the server ever replies without an ack
    socket.on('user-list', handleUserList);

    // Handle new user joining
    socket.on('user-joined', ({ userId, socketId, name, role: userRole }) => {
      console.log(`📢 New user joined: ${name}`);
      
      const isMe = socketId === socket.id;
      
      if (!isMe) {
        setParticipants(prev => {
          const alreadyExists = prev.some(p => p.socketId === socketId);
          if (alreadyExists) return prev;
          
          return [...prev, {
            userId,
            socketId,
            name,
            role: userRole,
            stream: null,
            hasAudio: false,
            hasVideo: false
          }];
        });
      }
    });

    // Handle user disconnecting
    socket.on('user-disconnected', (socketId) => {
      console.log('👋 User disconnected:', socketId);
      
      // Clean up audio element
      if (audioElementsRef.current[socketId]) {
        document.body.removeChild(audioElementsRef.current[socketId]);
        delete audioElementsRef.current[socketId];
      }
      
      // Close peer connection
      if (peersRef.current[socketId]) {
        peersRef.current[socketId].close();
        delete peersRef.current[socketId];
      }
      
      // Remove from participants
      setParticipants(prev => prev.filter(p => p.socketId !== socketId));
      
      // Clean up voice activity and raised hands
      setVoiceActivity(prev => {
        const newActivity = { ...prev };
        delete newActivity[socketId];
        return newActivity;
      });
      
      setRaisedHands(prev => {
        const newHands = new Set(prev);
        newHands.delete(socketId);
        return newHands;
      });
    });

    // Handle name changes
    socket.on('user-name-changed', ({ socketId, newName }) => {
      setParticipants(prev => prev.map(participant => 
        participant.socketId === socketId 
          ? { ...participant, name: newName }
          : participant
      ));
    });

    // NEW: Handle raise hand events
    socket.on('user-hand-raised', ({ socketId, isRaised, userName }) => {
      setRaisedHands(prev => {
        const newHands = new Set(prev);
        if (isRaised) {
          newHands.add(socketId);
          if (myRole === 'moderator') {
            showNotification(`${userName} raised their hand`, 'info');
          }
        } else {
          newHands.delete(socketId);
        }
        return newHands;
      });
    });

    // Handle moderator events
    socket.on('moderator-left', ({ message, countdown: initialCountdown }) => {
      showNotification(message, 'warning');
      setCountdown(initialCountdown);
      
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    });

    socket.on('moderator-returned', ({ message }) => {
      showNotification(message, 'success');
      setCountdown(null);
    });

    socket.on('room-closed', ({ reason }) => {
      showNotification(`Room closed: ${reason}`, 'error');
      setTimeout(() => navigate('/classes'), 3000);
    });

    socket.on('class-ended', ({ reason }) => {
      showNotification(`Class ended: ${reason}`, 'info');
      setTimeout(() => navigate('/classes'), 3000);
    });

    // Voice activity from other users
    socket.on('user-voice-activity', ({ socketId, isActive }) => {
      setVoiceActivity(prev => ({
        ...prev,
        [socketId]: isActive
      }));
    });

    // WebRTC signaling with better error handling
    socket.on('offer', async ({ offer, from }) => {
      console.log('📨 Received offer from:', from);

      try {
        // An existing connection means this offer is an ICE restart, not a
        // fresh join — reuse it instead of tearing down and losing state.
        const peerConnection = peersRef.current[from] || createPeerConnection(from, false);

        await peerConnection.setRemoteDescription(offer);
        peerConnection.setRemoteDescriptionSet();
        
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        
        socket.emit('answer', {
          answer,
          to: from,
          from: socket.id
        });
        
        console.log(`✅ Successfully handled offer from ${from}`);
      } catch (error) {
        console.error('❌ Error handling offer:', error);
      }
    });

    socket.on('answer', async ({ answer, from }) => {
      console.log('📨 Received answer from:', from);
      
      const peerConnection = peersRef.current[from];
      if (peerConnection && peerConnection.signalingState === 'have-local-offer') {
        try {
          await peerConnection.setRemoteDescription(answer);
          peerConnection.setRemoteDescriptionSet();
          console.log(`✅ Successfully set remote description for ${from}`);
        } catch (error) {
          console.error('❌ Error handling answer:', error);
        }
      }
    });

    socket.on('ice-candidate', async ({ candidate, from }) => {
      const peerConnection = peersRef.current[from];
      if (peerConnection) {
        if (peerConnection.remoteDescription) {
          try {
            await peerConnection.addIceCandidate(candidate);
          } catch (error) {
            console.error('❌ Error adding ICE candidate:', error);
          }
        } else {
          peerConnection.pendingCandidates.push(candidate);
        }
      }
    });

    return socket;
  };

  // Media control functions
  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const leaveCall = async () => {
    console.log('🚪 Leave call initiated...');

    if (role === 'moderator' && roomTokenRef.current) {
      try {
        await fetch(`${import.meta.env.VITE_VIDEOCALL_URL}/classes/end-class/${accessCode}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${roomTokenRef.current}`
          }
        });
      } catch (error) {
        console.error('Error ending class:', error);
      }
    }

    cleanup();
    setTimeout(() => navigate('/classes'), 100);
  };

  // UPDATED: Cleanup function with audio element cleanup
  const cleanup = () => {
    console.log('🧹 Starting cleanup...');
    
    // Clean up audio context
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(err => console.log('Audio context close error:', err));
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    
    // Clean up all audio elements
    Object.keys(audioElementsRef.current).forEach(socketId => {
      if (audioElementsRef.current[socketId]) {
        document.body.removeChild(audioElementsRef.current[socketId]);
      }
    });
    audioElementsRef.current = {};
    
    // Stop media tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    
    // Clear video element
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
      localVideoRef.current.load();
    }
    
    // Close peer connections
    Object.keys(peersRef.current).forEach(socketId => {
      if (peersRef.current[socketId]) {
        peersRef.current[socketId].close();
      }
    });
    peersRef.current = {};
    
    // Stop recording
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    
    // Disconnect socket
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    
    console.log('✅ Cleanup completed');
  };

  const startRecording = () => {
    if (localStreamRef.current && !isRecording) {
      const mediaRecorder = new MediaRecorder(localStreamRef.current, {
        mimeType: 'audio/webm'
      });
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks(prev => [...prev, event.data]);
        }
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      showNotification('Recording started', 'success');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      setTimeout(() => {
        const blob = new Blob(recordedChunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `class-recording-${accessCode}-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        setRecordedChunks([]);
        showNotification('Recording saved', 'success');
      }, 100);
    }
  };

  // Initialize everything
  useEffect(() => {
    const initialize = async () => {
      const stream = await initializeMedia();
      if (!stream) return;

      // Ask the main backend who we really are for this class — the video
      // call server no longer trusts a client-supplied role, so we need a
      // signed token before we can join.
      try {
        const baseURL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${baseURL}/classes/room-token/${accessCode}`, {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error(`Room token request failed with status ${response.status}`);
        }

        const data = await response.json();
        roomTokenRef.current = data.token;
        setRole(data.role);
        setUserName(data.name || (data.role === 'moderator' ? 'Moderator' : 'Student'));

        initializeSocket(data.token, data.role);
      } catch (error) {
        console.error('Failed to get room access token:', error);
        showNotification('You are not authorized to join this class. Please log in again.', 'error');
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    initialize();
    
    const handleBeforeUnload = () => cleanup();
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      cleanup();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Class: {accessCode}</h1>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-300">
              {role === 'moderator' ? 'You are the moderator' : 'You are a student'}
            </p>
            <p className="text-xs text-gray-500">ID: {localUserId.slice(-8)}</p>
            
            {/* Name editing */}
            <div className="flex items-center gap-2">
              {isEditingName ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="bg-gray-700 text-white px-2 py-1 rounded text-sm w-24"
                    maxLength={20}
                    onKeyPress={(e) => e.key === 'Enter' && handleNameSave()}
                  />
                  <button onClick={handleNameSave} className="text-green-400 hover:text-green-300">
                    <FaCheck size={12} />
                  </button>
                  <button onClick={handleNameCancel} className="text-red-400 hover:text-red-300">
                    <FaTimes size={12} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleNameEdit}
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  title="Click to change your name"
                >
                  <FaEdit size={12} />
                  <span className="text-xs">Change Name</span>
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* NEW: Raised hands indicator for moderator */}
          {role === 'moderator' && raisedHands.size > 0 && (
            <div className="bg-yellow-500 px-3 py-1 rounded text-sm flex items-center gap-2 animate-pulse">
              <FaHandPaper />
              <span>{raisedHands.size} hand{raisedHands.size !== 1 ? 's' : ''} raised</span>
            </div>
          )}
          
          {countdown && (
            <div className="bg-red-500 px-3 py-1 rounded text-sm animate-pulse">
              Room closing in: {countdown}s
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-sm">{isConnected ? 'Connected' : 'Connecting...'}</span>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Local Video */}
          <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className={`absolute bottom-2 left-2 px-2 py-1 rounded text-sm transition-all ${
              voiceActivity[localUserId] ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-black bg-opacity-50'
            }`}>
              You ({userName})
              {isHandRaised && <span className="ml-2">✋</span>}
            </div>
            {isVideoOff && (
              <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
                <div className="text-center">
                  <FaVideoSlash size={48} className="text-gray-400 mb-2" />
                  <p className="text-sm text-gray-400">Audio Only</p>
                </div>
              </div>
            )}
            {isMuted && (
              <div className="absolute top-2 right-2 bg-red-500 p-2 rounded">
                <FaMicrophoneSlash size={16} />
              </div>
            )}
          </div>

          {/* Remote Videos */}
          {participants.map((participant) => (
            <RemoteVideo
              key={participant.socketId}
              participant={participant}
              isActive={voiceActivity[participant.socketId]}
              hasHandRaised={raisedHands.has(participant.socketId)}
            />
          ))}
        </div>

        {/* Status Messages */}
        {participants.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400 text-lg">
              {role === 'moderator' 
                ? 'Waiting for students to join...' 
                : 'Connecting to class...'}
            </p>
          </div>
        )}

        {/* Debug Info */}
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">
            👥 {participants.length} participant{participants.length !== 1 ? 's' : ''} connected
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Audio connections: {participants.filter(p => p.hasAudio).length} | 
            Video connections: {participants.filter(p => p.hasVideo).length}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4 flex justify-center items-center gap-4">
        <button
          onClick={toggleMute}
          className={`p-3 rounded-full transition-colors ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'}`}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </button>

        <button
          onClick={toggleVideo}
          className={`p-3 rounded-full transition-colors ${isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'}`}
          title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
        >
          {isVideoOff ? <FaVideoSlash /> : <FaVideo />}
        </button>

        {/* NEW: Raise Hand Button */}
        <button
          onClick={toggleRaiseHand}
          className={`p-3 rounded-full transition-colors ${
            isHandRaised 
              ? 'bg-yellow-500 hover:bg-yellow-600 animate-pulse' 
              : 'bg-gray-600 hover:bg-gray-700'
          }`}
          title={isHandRaised ? 'Lower hand' : 'Raise hand'}
        >
          <FaHandPaper className={isHandRaised ? 'text-white' : ''} />
        </button>

        {role === 'moderator' && (
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-3 rounded-full transition-colors ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
            title={isRecording ? 'Stop Recording' : 'Start Recording'}
          >
            {isRecording ? <FaStop /> : <FaRecordVinyl />}
          </button>
        )}

        <button
          onClick={leaveCall}
          className="p-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
          title={role === 'moderator' ? 'End Class' : 'Leave Class'}
        >
          <FaPhone className="transform rotate-45" />
        </button>
      </div>

      {/* Notifications */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
    </div>
  );
}

// UPDATED: Remote Video Component with audio fallback and hand indicator
function RemoteVideo({ participant, isActive, hasHandRaised }) {
  const videoRef = useRef(null);

  useEffect(() => {
    // Only set video stream if participant has video
    if (participant.stream && participant.hasVideo && videoRef.current) {
      console.log(`🎥 Setting video stream for: ${participant.name}`);
      videoRef.current.srcObject = participant.stream;
    }
  }, [participant.stream, participant.hasVideo]);

  const hasVideo = participant.hasVideo;
  const hasAudio = participant.hasAudio;

  return (
    <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
      {hasVideo && participant.stream ? (
        // Show video if available
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        // Show audio-only placeholder
        <div className="w-full h-full flex items-center justify-center bg-gray-700">
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 ${
              isActive ? 'bg-green-600 animate-pulse' : 'bg-gray-600'
            }`}>
              <span className="text-2xl font-bold">{participant.name?.charAt(0) || '?'}</span>
            </div>
            {hasAudio ? (
              <div className="text-center">
                <p className="text-sm text-gray-300">{participant.name}</p>
                <p className="text-xs text-gray-400">Audio Connected</p>
                {isActive && (
                  <div className="mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full mx-auto animate-pulse"></div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-gray-300">{participant.name}</p>
                <p className="text-xs text-gray-500">Connecting...</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Participant info overlay */}
      <div className={`absolute bottom-2 left-2 px-2 py-1 rounded text-sm transition-all ${
        isActive ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-black bg-opacity-50'
      }`}>
        {participant.name} {participant.role === 'moderator' && '👨‍🏫'}
        {hasHandRaised && <span className="ml-2 animate-bounce">✋</span>}
      </div>
      
      {/* Connection status indicators */}
      <div className="absolute top-2 right-2 flex gap-1">
        {hasAudio && (
          <div className="bg-green-500 p-1 rounded text-xs" title="Audio connected">
            🎤
          </div>
        )}
        {hasVideo && (
          <div className="bg-blue-500 p-1 rounded text-xs" title="Video connected">
            📹
          </div>
        )}
        {!hasAudio && !hasVideo && (
          <div className="bg-red-500 p-1 rounded text-xs" title="Connecting...">
            ⏳
          </div>
        )}
      </div>
    </div>
  );
}