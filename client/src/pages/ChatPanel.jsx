import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { io } from 'socket.io-client';
import { fetchUserData, fetchUserList } from '../Store/patient/authslice';

const ChatPanel = () => {
    const dispatch = useDispatch();
    const { patientData } = useSelector((state) => state.auth);
    const [socket, setSocket] = useState(null);
    const [userlist, setUserList] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImagePreview, setSelectedImagePreview] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const messagesEndRef = useRef(null);
    const [isopen, setisopen] = useState(false)
    const [msgStatus, setMsgStatus] = useState("")
    const [typingUsers, setTypingUsers] = useState(new Set());
    const typingTimeoutRef = useRef(null);
    const navigate = useNavigate();


    useEffect(() => {
        dispatch(fetchUserData())
        const newSocket = io('http://localhost:5000', {
            path: "/chat-socket/",
            withCredentials: true,
            transports: ["websocket", "polling"]
        });

        newSocket.on('connect', () => {
            // console.log('Connected to socket');
        });

        newSocket.on('activeUsers', (activeUserIds) => {
            setOnlineUsers(new Set(activeUserIds));
        });

        newSocket.on('userConnected', (userId) => {
            setOnlineUsers(prev => new Set([...prev, userId]));
            // Update message status to delivered for all undelivered messages to this user
            setMessages(prev => prev.map(msg =>
                msg.receiverId === userId && msg.status === 'SENT'
                    ? { ...msg, status: 'DELIVERED' }
                    : msg
            ));
        });

        newSocket.on('userDisconnected', (userId) => {
            setOnlineUsers(prev => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
        });

        newSocket.on('previousMessages', (previousMessages) => {
            const messagesArray = Array.isArray(previousMessages)
                ? previousMessages
                : [previousMessages];
            setMessages(messagesArray);
            scrollToBottom();
        });

        newSocket.on('newMessage', (newMessage) => {
            setMessages(prev => {
                const isDuplicate = prev.some(msg => msg.id === newMessage.id);
                if (!isDuplicate) {
                    // Automatically mark as delivered if receiving
                    if (newMessage.receiverId === (patientData?.patientId || patientData?.doctorId)) {
                        newSocket.emit('markAsDelivered', newMessage.id);
                        newMessage.status = 'DELIVERED';
                    }
                    return [...prev, newMessage];
                }
                return prev;
            });
            scrollToBottom();
        });

        newSocket.on('messageStatusUpdated', ({ messageId, status }) => {
            console.log(status)
            setMessages(prev => prev.map(msg =>
                msg.id === messageId ? { ...msg, status } : { ...msg, status }
            ));

        });
        newSocket.on('userTyping', ({ userId, isTyping }) => {
            setTypingUsers(prev => {
                const newUsers = new Set(prev);
                if (isTyping) {
                    newUsers.add(userId);
                } else {
                    newUsers.delete(userId);
                }
                return newUsers;
            });
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        const fetchList = async () => {
            try {
                const data = await dispatch(fetchUserList());
                setUserList(data.payload);
                setFilteredUsers(data.payload);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch user list', error);
                setLoading(false);
            }
        };
        fetchList();
    }, [dispatch]);

    useEffect(() => {
        const filtered = userlist.filter(user =>
            `${user.first_name} ${user.last_name}`.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [search, userlist]);

    useEffect(() => {
        if (selectedUser && messages.length > 0) {
            messages.forEach(msg => {
                if (msg.status !== 'READ' &&
                    msg.receiverId === (patientData?.patientId || patientData?.doctorId)) {
                    socket?.emit('markAsRead', msg.id);
                }
            });
        }
        scrollToBottom()
    }, [selectedUser, messages]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setSelectedImagePreview(URL.createObjectURL(file));
        }
    };

    const sendMessage = () => {
        if (!messageInput.trim() || !selectedUser || !socket) return;
        const initialStatus = onlineUsers.has(selectedUser?.doctorId || selectedUser?.patientId)
            ? 'DELIVERED'
            : 'SENT';

        const messageData = {
            receiverId: selectedUser?.doctorId || selectedUser?.patientId || '',
            message: messageInput.trim(),
            messageType: "text",
            status: initialStatus,
            senderId: patientData?.patientId || patientData?.doctorId,
            senderType: patientData?.role
        };

        const tempMessage = {
            ...messageData,
            id: `temp-${Date.now()}`,
            createdAt: new Date().toISOString()
        };

        setMessages(prev => [...prev, tempMessage]);
        socket.emit('sendMessage', messageData);
        setMessageInput('');
        scrollToBottom();
    };

    const handleUpload = async () => {
        if (!selectedImage) return;

        const formData = new FormData();
        formData.append('image', selectedImage);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/uploads`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.url) {
                const initialStatus = onlineUsers.has(selectedUser?.doctorId || selectedUser?.patientId)
                    ? 'DELIVERED'
                    : 'SENT';

                const messageData = {
                    receiverId: selectedUser?.doctorId || selectedUser?.patientId || '',
                    message: response.data.url,
                    messageType: "image",
                    status: initialStatus,
                    senderId: patientData?.patientId || patientData?.doctorId,
                    senderType: patientData?.role
                };

                const tempMessage = {
                    ...messageData,
                    id: `temp-${Date.now()}`,
                    createdAt: new Date().toISOString()
                };

                setMessages(prev => [...prev, tempMessage]);
                socket.emit('sendMessage', messageData);
                setSelectedImage(null);
                setSelectedImagePreview(null);
                scrollToBottom();
            }
        } catch (error) {
            if (error.response.data.message === "Unauthorized: No token provided") {
                window.location.href = "/login"
            }

            console.error('Error uploading image:', error);
            alert('Failed to upload image');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const handleBack = () => {
        if (patientData?.patientId) {
            navigate("/patient-panel");
        }
        else {
            navigate("/doctor-panel");
        }
    };

    const isMessageFromCurrentUser = (message) => {
        const currentUserId = patientData?.patientId || patientData?.doctorId;
        return message.senderId === currentUserId;
    };

    const getMessageStatus = (message) => {
        switch (message.status) {
            case 'READ':
                return <div className="inline-flex relative w-4">
                    <i className="fa-solid fa-check text-xs"></i>
                    <i className="fa-solid fa-check text-xs -ml-1"></i>
                </div>
            case 'DELIVERED':
                return '✓✓';
            case 'SENT':
                return '✓';
            default:
                return '';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'READ':
                return 'text-blue-800';
            case 'DELIVERED':
                return 'text-gray-400';
            case 'SENT':
                return 'text-gray-400';
            default:
                return '';
        }
    }
    const handleTyping = (e) => {
        setMessageInput(e.target.value);

        // Emit typing event
        if (socket && selectedUser) {
            const receiverId = selectedUser?.doctorId || selectedUser?.patientId;

            // Clear previous timeout
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            // Emit typing start
            socket.emit('startTyping', { receiverId });

            // Set timeout to stop typing
            typingTimeoutRef.current = setTimeout(() => {
                socket.emit('stopTyping', { receiverId });
            }, 1000);
        }
    };

    return (
        <div className="flex h-screen bg-green-900">
            <div className={`w-full md:w-1/3 bg-green-50 shadow-lg p-4 overflow-y-auto ${selectedUser ? 'hidden md:block' : 'block'}`}>
                {/* Back Button */}
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-green-900 hover:text-green-600 mb-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Dashboard
                </button>
                <h2 className="text-xl font-semibold text-green-800 mb-4 mt-4">Chat With Users</h2>
                <input
                    type="text"
                    placeholder="Search Users..."
                    className="placeholder-green-900 w-full bg-green-200 p-2 mb-4 text-green-800 border border-green-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-950"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : (
                    <div className="space-y-3">
                        {filteredUsers.map((user, index) => (
                            <div
                                key={index}
                                className={`flex items-center p-2 rounded-lg cursor-pointer transition ${selectedUser?.id === user.id ? 'bg-green-300 text-green-900' : 'bg-gray-100 hover:bg-blue-100'}`}
                                onClick={() => {
                                    setSelectedUser(user);
                                    setMessages([]);
                                    socket?.emit('fetchPreviousMessages', {
                                        receiverId: user?.doctorId || user?.patientId
                                    });
                                }}
                            >
                                <div className="relative">
                                    <img
                                        src={user.profilepic || 'https://via.placeholder.com/40'}
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full mr-3"
                                    />
                                    <span className={`absolute bottom-0 right-2 w-3 h-3 rounded-full ${onlineUsers.has(user.doctorId || user.patientId) ? 'bg-green-500' : 'bg-gray-500'}`} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium">{user.first_name} {user.last_name}</span>
                                    <span className="text-sm text-green-900">{onlineUsers.has(user.doctorId || user.patientId) ? 'Online' : 'Offline'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className={`w-full md:w-2/3 flex flex-col bg-green-50 shadow-lg p-4 ${selectedUser ? 'block' : 'hidden md:block'}`}>
                {selectedUser ? (
                    <>
                        <div className="flex items-center mb-4 border-b pb-2">
                            <button className="md:hidden p-2 text-green-900" onClick={() => setSelectedUser(null)}>
                                ← Back
                            </button>
                            <div className="relative">
                                <img
                                    src={selectedUser.profilepic || 'https://via.placeholder.com/40'}
                                    alt="Profile"
                                    className="w-12 h-12 rounded-full mr-3"
                                />
                                <span className={`absolute bottom-0 right-2 w-3 h-3 rounded-full ${onlineUsers.has(selectedUser.doctorId || selectedUser.patientId) ? 'bg-green-500' : 'bg-gray-500'}`} />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-lg font-semibold text-green-900">{selectedUser.first_name} {selectedUser.last_name}</h2>
                                <span className="text-sm text-green-900">{onlineUsers.has(selectedUser.doctorId || selectedUser.patientId) ? 'Online' : 'Offline'}</span>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-scroll bg-green-50 p-3 rounded-lg space-y-4" ref={messagesEndRef}>
                            {messages.filter(msg => (msg.senderId === selectedUser?.doctorId || msg.senderId === selectedUser?.patientId) || (msg.receiverId === selectedUser?.doctorId || msg.receiverId === selectedUser?.patientId)).map((msg, idx) => (
                                <div key={idx} className={`flex ${isMessageFromCurrentUser(msg) ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-sm rounded-lg ${isMessageFromCurrentUser(msg) ? 'bg-green-300 text-green-900' : 'bg-green-400 text-green-900'}`}>
                                        {msg.messageType === "image" ? (
                                            <div className="p-1">
                                                <img src={msg.message} alt="Shared image" className="max-w-xs rounded-lg" />
                                            </div>
                                        ) : (
                                            <div className="p-2">{msg.message}</div>
                                        )}
                                        <div className="text-xs opacity-70 p-1 text-right flex items-center justify-end gap-1">
                                            <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            {isMessageFromCurrentUser(msg) && <span className={getStatusColor(msg.status)}>{getMessageStatus(msg)}</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {selectedUser && typingUsers.has(selectedUser?.doctorId || selectedUser?.patientId) && <div className="text-sm text-gray-500 italic">typing...</div>}
                        </div>
                        <div className="mt-4">
                            {selectedImagePreview && (
                                <div className="mb-2 relative">
                                    <img
                                        src={selectedImagePreview}
                                        alt="Selected"
                                        className="max-h-32 rounded"
                                    />
                                    <button
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                                        onClick={() => {
                                            setSelectedImage(null);
                                            setSelectedImagePreview(null);
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    className="placeholder-green-900 bg-green-100 flex-1 p-2 border border-green-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    value={messageInput}
                                    onChange={handleTyping}
                                    onKeyPress={handleKeyPress}
                                />
                                <label className="cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageSelect}
                                    />
                                    <span className="px-4 py-2 bg-green-500 text-green-900 rounded-md hover:bg-green-600">
                                        Image
                                    </span>
                                </label>
                                {selectedImage ? (
                                    <button
                                        className="px-4 py-2 bg-green-500 text-green-900 rounded-md hover:bg-green-600"
                                        onClick={handleUpload}
                                    >
                                        Send Image
                                    </button>
                                ) : (
                                    <button
                                        className="px-4 py-2 bg-green-500 text-green-900 rounded-md hover:bg-green-600"
                                        onClick={sendMessage}
                                    >
                                        Send
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <p className="text-center text-gray-500 mt-20">
                        Select a user to start chatting
                    </p>
                )}
            </div>
        </div>
    );

};

export default ChatPanel;