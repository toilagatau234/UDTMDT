import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useAuth, useAuth2 } from '../../store/AuthStore.jsx';
import PropTypes from 'prop-types';

const ChatBubble = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]); 
  const [newMessage, setNewMessage] = useState(''); 
  const [idNguoiTao, setIdNguoiTao] = useState(null); 
  const [socket, setSocket] = useState(null); 
  const { authUser } = useAuth();
  const { authUser2 } = useAuth2();
  const [anhND, setAnhND] = useState(null); 
  const [tenNguoiDung, setTenNguoiDung] = useState(null); 

  useEffect(() => {
    const socketConnection = io('http://localhost:5000', {
      query: { idNguoidung: id }, 
    });
    setSocket(socketConnection);

    
    return () => {
      socketConnection.disconnect();
    };
  }, [id]);

  useEffect(() => {
    if (socket && idNguoiTao) {
      socket.on('tinNhanMoi', (tinNhanMoi) => {
        setMessages((prevMessages) => [...prevMessages, tinNhanMoi]);
      });

      socket.on('nhanThongBao', (thongBao) => {
        console.log(`Thông báo: ${thongBao.noiDungTB}`);
      });

      return () => {
        socket.off('tinNhanMoi');
        socket.off('nhanThongBao');
      };
    }
  }, [socket, idNguoiTao]);

  const toggleChat = async () => {
    setIsOpen(!isOpen);

    if (!isOpen) {
      try {
        const { data } = await axios.get(`/api/dichvu/laynguoitao/${id}`);
        setIdNguoiTao(data.idNguoiTao);
        setAnhND(data.anhND);
        setTenNguoiDung(data.tenNguoiDung);

        socket.emit('joinRoom', data.idNguoiTao);

        const response = await axios.get(`/api/chat/${data.idNguoiTao}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Lỗi khi mở hộp chat:', error);
      }
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post(`/api/chat/gui/${idNguoiTao}`, {
        idNguoiDungGui: authUser, 
        noiDungTN: newMessage, 
      });

      setMessages((prevMessages) => [...prevMessages, response.data]);
      setNewMessage('');

      socket.emit('sendMessage', {
        idNguoiDungGui: authUser, 
        idNguoiDungNhan: idNguoiTao, 
        noiDungTN: newMessage,
        time: new Date().toLocaleTimeString(),
      });

      socket.emit('sendNotification', {
        tuNguoiDung: authUser,
        denNguoiDung: idNguoiTao,
        noiDungTB: `Bạn có tin nhắn mới từ ${authUser2}!`,
      });
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn:', error);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <div
          className="px-5 py-2 bg-white text-slate-950 shadow-lg flex items-center justify-between cursor-pointer hover:bg-slate-50 rounded-3xl"
          onClick={toggleChat}
        >
          <img
            src={anhND}
            alt="Profile picture"
            className="rounded-full w-12 h-12"
          />
          <div className="flex flex-col ml-4">
            Trò chuyện cùng {tenNguoiDung} 
          </div>
        </div>
      )}

      {isOpen && (
        <div className="w-80 h-96 bg-white shadow-xl rounded-lg flex flex-col">
          <div className="bg-white text-black border-b p-4 flex justify-between items-center rounded-t-lg">
            <h3 className="text-lg font-semibold">{tenNguoiDung}</h3>
            <button
              className="text-slate-600 hover:text-gray-200"
              onClick={toggleChat}
            >
              ✖
            </button>
          </div>

          <div className="flex flex-col justify-between h-full p-4 overflow-y-auto space-y-4">
            <div className="flex-1 space-y-2">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.idNguoiDungGui === authUser ? "justify-end" : "justify-start"} mb-4`}>
                  <div className={`p-3 max-w-xs rounded-lg ${message.idNguoiDungGui === authUser ? "bg-blue-600 text-white" : "bg-slate-100"}`}>
                    <p className="text-sm">{message.noiDungTN}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center p-2 border-t">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 focus:outline-none p-2 border rounded-md"
                placeholder="Nhập tin nhắn"
              />
              <button
                onClick={sendMessage}
                className="ml-2 px-4 py-2 bg-slate-600 text-white rounded-md"
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default ChatBubble;

ChatBubble.propTypes = {
    id: PropTypes.string.isRequired, 
  };
  

