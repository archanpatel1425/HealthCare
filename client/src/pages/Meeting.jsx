import axios from "axios";
import { Camera, Mic, MicOff, Monitor, PhoneOff, Video, VideoOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from 'react-router-dom';
import io from "socket.io-client";
import "../App.css";
import { fetchUserData } from "../Store/patient/authslice";

const socket = io("http://localhost:5000", {
  path: "/meet-socket/",
  withCredentials: true,
  transports: ["websocket", "polling"]
});

function Meeting() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchUserData())
  }, [dispatch])
  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const { meetId } = useParams();
  const [appointmentId, setappointmentId] = useState(meetId)
  const [remoteStream, setRemoteStream] = useState(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const patientData = useSelector((state) => state.auth.patientData)
  const navigate = useNavigate();

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current
        .getTracks()
        .find(track => track.kind === 'video');

      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
        setIsVideoOn(!isVideoOn);
      }
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current
        .getTracks()
        .find(track => track.kind === 'audio');

      if (audioTrack) {
        audioTrack.enabled = !isAudioOn;
        setIsAudioOn(!isAudioOn);
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });

        screenStreamRef.current = screenStream;

        // Get the video track from screen share
        const screenTrack = screenStream.getVideoTracks()[0];

        if (peerRef.current) {
          // Get all senders from the peer connection
          const senders = peerRef.current.getSenders();
          // Find the sender that's sending video
          const videoSender = senders.find(sender =>
            sender.track?.kind === 'video'
          );

          if (videoSender) {
            // Replace the camera track with screen track
            await videoSender.replaceTrack(screenTrack);
          }
        }

        // Show screen share in local video
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = screenStream;
        }

        // Listen for when user stops screen sharing using the browser's built-in controls
        screenTrack.onended = () => {
          stopScreenSharing();
        };

        setIsScreenSharing(true);
      } else {
        await stopScreenSharing();
      }
    } catch (err) {
      console.error("Error toggling screen share:", err);
    }
  };

  const stopScreenSharing = async () => {
    try {
      if (screenStreamRef.current) {
        // Stop all tracks in screen sharing stream
        screenStreamRef.current.getTracks().forEach(track => track.stop());

        // Get the video track from camera
        if (localStreamRef.current) {
          const cameraTrack = localStreamRef.current
            .getTracks()
            .find(track => track.kind === 'video');

          if (peerRef.current && cameraTrack) {
            // Get all senders from the peer connection
            const senders = peerRef.current.getSenders();
            // Find the sender that's sending video
            const videoSender = senders.find(sender =>
              sender.track?.kind === 'video'
            );

            if (videoSender) {
              // Replace screen track with camera track
              await videoSender.replaceTrack(cameraTrack);
            }
          }

          // Show camera in local video
          if (myVideoRef.current) {
            myVideoRef.current.srcObject = localStreamRef.current;
          }
        }

        screenStreamRef.current = null;
        setIsScreenSharing(false);
      }
    } catch (err) {
      console.error("Error stopping screen share:", err);
    }
  };

  useEffect(() => {
    const initializeConnection = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

        localStreamRef.current = stream;
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
        }

        const peer = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" }
          ]
        });
        peerRef.current = peer;

        stream.getTracks().forEach(track => {
          peer.addTrack(track, stream);
        });

        peer.ontrack = (event) => {
          console.log("Received remote track");
          setRemoteStream(event.streams[0]);
        };

        peer.onicecandidate = (event) => {
          if (event.candidate) {
            console.log("Sending ICE candidate");
            socket.emit("send-ice-candidate", {
              meetId: meetId,
              candidate: event.candidate
            });
          }
        };

        socket.emit("join-room", meetId);
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    };

    initializeConnection();

    socket.on("user-connected", async (userId) => {
      console.log("User connected:", userId);
      try {
        if (peerRef.current) {
          const offer = await peerRef.current.createOffer();
          await peerRef.current.setLocalDescription(offer);
          socket.emit("send-offer", {
            meetId: meetId,
            userId,
            offer
          });
        }
      } catch (err) {
        console.error("Error creating offer:", err);
      }
    });

    socket.on("receive-offer", async ({ offer, senderId }) => {
      console.log("Received offer");
      try {
        const peer = peerRef.current;
        if (peer) {
          await peer.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await peer.createAnswer();
          await peer.setLocalDescription(answer);
          socket.emit("send-answer", {
            meetId,
            answer,
            senderId
          });
        }
      } catch (err) {
        console.error("Error handling offer:", err);
      }
    });

    socket.on("receive-answer", async ({ answer }) => {
      console.log("Received answer");
      try {
        const peer = peerRef.current;
        if (peer) {
          await peer.setRemoteDescription(new RTCSessionDescription(answer));
        }
      } catch (err) {
        console.error("Error handling answer:", err);
      }
    });

    socket.on("receive-ice-candidate", async ({ candidate }) => {
      console.log("Received ICE candidate");
      try {
        const peer = peerRef.current;
        if (peer) {
          await peer.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (err) {
        console.error("Error adding ICE candidate:", err);
      }
    });

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (peerRef.current) {
        peerRef.current.close();
      }
      socket.off("user-connected");
      socket.off("receive-offer");
      socket.off("receive-answer");
      socket.off("receive-ice-candidate");
    };
  }, []);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const leaveMeeting = () => {
    try {
      // Stop all tracks in local stream
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
        localStreamRef.current = null;
      }

      // Stop screen sharing if active
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
        screenStreamRef.current = null;
      }

      // Clean up peer connection
      if (peerRef.current) {
        peerRef.current.close();
        peerRef.current = null;
      }

      // Clear video elements
      if (myVideoRef.current) {
        myVideoRef.current.srcObject = null;
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }

      // Notify server
      socket.emit('leave-room', "1234");
      setRemoteStream(null);
      setIsScreenSharing(false);
      if (patientData?.doctorId) {
        navigate('/doctor-panel/prescription-form', { state: { appointmentId } })
      }
      else {
        navigate('/patient-panel')
      }
      axios.post(`${import.meta.env.VITE_API_URL}/doctor/status`, { appointmentId, status: "Completed" }, { withCredentials: true })
    } catch (err) {
      if (err.response.data.message === "Unauthorized: No token provided") {
        window.location.href = "/login";
      }
      console.error("Error leaving meeting:", err);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-900">
      {/* Remote Video (Full Screen) */}
      <div className="absolute inset-0 bg-gray-800">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        {!remoteStream && (
          <div className="absolute inset-0 flex items-center justify-center text-white text-lg">
            Waiting for others to join...
          </div>
        )}
      </div>

      {/* Local Video (Draggable & Bottom-Right Positioned) */}
      <Draggable bounds="parent">
        <div className="absolute bottom-4 right-4 w-40 h-28 bg-gray-800 rounded-lg overflow-hidden cursor-move">
          <video
            ref={myVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>
      </Draggable>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full ${isVideoOn ? "bg-gray-700 hover:bg-gray-600" : "bg-red-500 hover:bg-red-400"} transition-colors`}
        >
          {isVideoOn ? <Video className="w-6 h-6 text-white" /> : <VideoOff className="w-6 h-6 text-white" />}
        </button>

        <button
          onClick={toggleAudio}
          className={`p-4 rounded-full ${isAudioOn ? "bg-gray-700 hover:bg-gray-600" : "bg-red-500 hover:bg-red-400"} transition-colors`}
        >
          {isAudioOn ? <Mic className="w-6 h-6 text-white" /> : <MicOff className="w-6 h-6 text-white" />}
        </button>

        <button
          onClick={toggleScreenShare}
          className={`p-4 rounded-full ${isScreenSharing ? "bg-blue-500 hover:bg-blue-400" : "bg-gray-700 hover:bg-gray-600"} transition-colors`}
        >
          {isScreenSharing ? <Camera className="w-6 h-6 text-white" /> : <Monitor className="w-6 h-6 text-white" />}
        </button>

        <button
          onClick={leaveMeeting}
          className="p-4 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
        >
          <PhoneOff className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}

export default Meeting;