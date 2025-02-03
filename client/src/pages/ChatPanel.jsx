// Frontend: ChatPanel.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData, fetchUserList } from '../Store/patient/authslice';
import { io } from 'socket.io-client';

const ChatPanel = () => {
    const dispatch = useDispatch();
    const { patientData, error } = useSelector((state) => state.auth);
    const [socket, setSocket] = useState(null);
    const [userlist, setUserList] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        dispatch(fetchUserData())
        const newSocket = io('http://localhost:5000', {
            withCredentials: true,
            transports: ["websocket", "polling"]
        });

        newSocket.on('connect', () => {
            // console.log('Socket connected');
        });

        newSocket.on('previousMessages', (newMessage) => {
            setMessages(prev => [...prev, newMessage]);
            scrollToBottom();
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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const sendMessage = () => {
        if (!messageInput.trim() || !selectedUser || !socket) return;

        const messageData = {
            receiverId: selectedUser?.doctorId || selectedUser?.patientId || '',
            message: messageInput.trim(),
            messageType:"text",
            status: 'SENT'
        };

        socket.emit('sendMessage', messageData);
        setMessages(prev => [...prev, messageData]);
        setMessageInput('');
        scrollToBottom();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="w-1/3 bg-white shadow-lg p-4 overflow-y-auto">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Chat Users</h2>
                <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : (
                    <div className="space-y-3">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user,index) => (
                                <div
                                    key={index}
                                    className={`flex items-center p-2 rounded-lg cursor-pointer transition ${
                                        selectedUser?.id === user.id ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-blue-100'
                                    }`}
                                    onClick={() => {
                                        setSelectedUser(user);
                                        socket?.emit('fetchPreviousMessages', { 
                                            receiverId: user?.doctorId ||user?.patientId
                                        });
                                    }}
                                >
                                    <img
                                        src={user.profilepic || 'https://via.placeholder.com/40'}
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full mr-3"
                                    />
                                    <span className="font-medium">
                                        {user.first_name} {user.last_name}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No users found.</p>
                        )}
                    </div>
                )}
            </div>

            <div className="w-2/3 flex flex-col bg-white shadow-lg p-4">
                {selectedUser ? (
                    <>
                        <div className="flex items-center mb-4 border-b pb-2">
                            <img
                                src={selectedUser.profilepic || 'https://via.placeholder.com/40'}
                                alt="Profile"
                                className="w-12 h-12 rounded-full mr-3"
                            />
                            <h2 className="text-lg font-semibold">
                                {selectedUser.first_name} {selectedUser.last_name}
                            </h2>
                        </div>
                        <div className="flex-1 overflow-y-auto bg-gray-50 p-3 rounded-lg space-y-2">
                            {messages.length > 0 ? (
                                messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex ${
                                            msg.senderId === patientData?.patientId||patientData?.doctorId
                                                ? 'justify-end' 
                                                : 'justify-start'
                                        }`}
                                    >
                                        <div 
                                            className={`max-w-xs p-2 rounded-lg ${
                                                msg.senderId === patientData?.patientId||patientData?.doctorId
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-200 text-black'
                                            }`}
                                        >
                                            {msg.message}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500">
                                    Start chatting with {selectedUser.first_name}!
                                </p>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="mt-4 flex">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <button
                                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                onClick={sendMessage}
                            >
                                Send
                            </button>
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