import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth2 ,useAuth} from "../../store/AuthStore";
import io from "socket.io-client"; 

const socket = io("http://localhost:5000"); 

const Chat = () => {
  const [selectedContact, setSelectedContact] = useState(null); 
  const [contacts, setContacts] = useState([]); 
  const [messages, setMessages] = useState({}); 
  const [newMessage, setNewMessage] = useState("");
  const { authUser2 } = useAuth2(); 
  const { authUser } = useAuth();
 
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get("/api/chat/layfull");
        setContacts(response.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách liên hệ:", error);
      }
    };

    fetchContacts();
  }, []);


  useEffect(() => {
    if (!selectedContact) return;

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/chat/${selectedContact}`);
        setMessages((prev) => ({ ...prev, [selectedContact]: response.data }));
      } catch (error) {
        console.error("Lỗi khi tải tin nhắn:", error);
      }
    };

    fetchMessages();
  }, [selectedContact]);

  useEffect(() => {
    const handleNewMessage = (message) => {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [message.idNguoiDungNhan]: [
          ...(prevMessages[message.idNguoiDungNhan] || []),
          message,
        ],
      }));
    };

    socket.on("tinNhanMoi", handleNewMessage);

    return () => {
      socket.off("tinNhanMoi", handleNewMessage); 
    };
  }, []);

  // Gửi tin nhắn
  const guiTinNhan = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      idNguoiDungGui: authUser,
      idNguoiDungNhan: selectedContact,
      noiDungTN: newMessage,
    };

    try {
      const response = await axios.post(`/api/chat/gui/${selectedContact}`, messageData);


      setMessages((prevMessages) => ({
        ...prevMessages,
        [selectedContact]: [
          ...(prevMessages[selectedContact] || []),
          response.data,
        ],
      }));

      setNewMessage(""); 


      socket.emit("sendMessage", messageData);


      socket.emit("sendNotification", {
        tuNguoiDung: authUser, 
        denNguoiDung: selectedContact, 
        noiDungTB: `Bạn có tin nhắn từ ${authUser2}`,
      });
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex">
      {/* Danh sách liên hệ */}
      <div className="w-1/4  shadow-xl bg-slate-50 p-4">
        <h2 className="text-xl font-semibold mb-4">Liên hệ</h2>
        <div className="space-y-4 ">
          {contacts.map((contact) => (
            <div
            key={contact._id}
            className={`flex items-center shadow-md justify-between py-2 rounded-lg cursor-pointer ${
              selectedContact === contact._id
                ? "bg-slate-400 text-white"
                : "bg-slate-200"
            }`}
            onClick={() => setSelectedContact(contact._id)}
          >
            <div className="flex items-center">
              <img
                src={contact.anhND}
                alt={`Ảnh của ${contact.tenNguoiDung}`}
                className="w-11 shadow-xl h-11 rounded-full ml-6"
              />
              <span className="ml-7">{contact.tenNguoiDung}</span>
            </div>
          </div>          
          ))}
        </div>
      </div>

      {/* Chat box */}
      <div className="bg-slate-100 w-3/4 p-2 ">
        {selectedContact ? (
          <div className="space-y-3 h-full flex flex-col justify-between">
            <div className="flex-1 overflow-y-auto">
              {messages[selectedContact]?.map((message, index) => (
                <div
                  key={message._id || `${index}-${message.idNguoiDungGui}`}
                  className={`flex ${
                    message.idNguoiDungGui === authUser ? "justify-end" : "justify-start"
                  } mb-2`}
                >
                  <div
                    className={`p-3 max-w-xs rounded-lg ${
                      message.idNguoiDungGui === authUser
                        ? "bg-zinc-800 text-white"
                        : "bg-white "
                    }`}
                  >
                    <span>{message.noiDungTN}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-2 shadow-xl bg-slate-200 rounded-lg flex sticky bottom-5 left-0 right-0 z-10">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full p-2 focus:outline-none text-black rounded-lg"
                  placeholder="Type a message..."
                />
                <button
                  onClick={guiTinNhan}
                  className="ml-2 bg-slate-900 text-slate-50 px-6 py-1 rounded-lg"
                >
                  Gửi
                </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-full text-slate-400">
            Chọn một liên hệ để bắt đầu trò chuyện.
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
