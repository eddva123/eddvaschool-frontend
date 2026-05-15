import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import Modal from '../../components/admin/Modal';

export default function Communications() {
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState({
      recipient: '',
      subject: '',
      body: ''
    });

    const handleSendMessage = () => {
      if (!newMessage.recipient || !newMessage.body) {
        alert('Please fill in all required fields');
        return;
      }
      setMessages([...messages, { ...newMessage, id: Date.now(), timestamp: new Date() }]);
      setNewMessage({ recipient: '', subject: '', body: '' });
      setIsMessageModalOpen(false);
    };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-surface-950">Communications</h1>
          <p className="mt-2 text-sm text-surface-500">Internal chat and broadcast messaging.</p>
        </div>
        <button 
          onClick={() => setIsMessageModalOpen(true)}
          className="rounded-lg bg-brand-600 px-4 py-2 font-bold text-white shadow-sm hover:bg-brand-700"
        >
          New Message
        </button>
      </div>

      <div className="flex h-[600px] rounded-lg border border-surface-200 bg-white shadow-sm overflow-hidden">
        <div className="w-1/3 border-r border-surface-200 bg-surface-50 p-4">
          <h3 className="mb-4 font-bold text-surface-950">Recent Conversations</h3>
          {messages.length === 0 ? (
            <div className="text-center text-sm text-surface-500 mt-10">No recent messages.</div>
          ) : (
            <div className="space-y-2">
              {messages.map(msg => (
                <div key={msg.id} className="p-2 bg-white rounded border border-surface-200 cursor-pointer hover:bg-brand-50">
                  <p className="font-semibold text-xs text-surface-600">{msg.recipient}</p>
                  <p className="text-xs text-surface-500 truncate">{msg.body}</p>
                  <p className="text-xs text-surface-400 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex w-2/3 flex-col items-center justify-center bg-white p-4">
          <MessageSquare className="h-12 w-12 text-surface-300 mb-4" />
          <h3 className="font-bold text-surface-950">Select a conversation</h3>
          <p className="text-sm text-surface-500">Choose a contact to start chatting.</p>

              <Modal
                isOpen={isMessageModalOpen}
                title="Send New Message"
                onClose={() => setIsMessageModalOpen(false)}
                size="md"
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-surface-700 mb-2">Recipient *</label>
                    <input
                      type="text"
                      placeholder="Select recipient or enter email"
                      value={newMessage.recipient}
                      onChange={(e) => setNewMessage({...newMessage, recipient: e.target.value})}
                      className="w-full rounded-lg border border-surface-200 px-4 py-2 outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-surface-700 mb-2">Subject</label>
                    <input
                      type="text"
                      placeholder="Message subject (optional)"
                      value={newMessage.subject}
                      onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                      className="w-full rounded-lg border border-surface-200 px-4 py-2 outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-surface-700 mb-2">Message *</label>
                    <textarea
                      placeholder="Type your message here..."
                      value={newMessage.body}
                      onChange={(e) => setNewMessage({...newMessage, body: e.target.value})}
                      className="w-full rounded-lg border border-surface-200 px-4 py-2 outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100 h-24"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleSendMessage}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2 font-bold text-white shadow-sm hover:bg-brand-700"
                    >
                      <Send className="h-4 w-4" />
                      Send Message
                    </button>
                    <button
                      onClick={() => setIsMessageModalOpen(false)}
                      className="flex-1 rounded-lg border border-surface-200 px-4 py-2 font-semibold text-surface-700 hover:bg-surface-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </Modal>
        </div>
      </div>
    </div>
  );
}
