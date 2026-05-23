<<<<<<< HEAD
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  Users,
  UserRound,
  BadgeCheck,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

function getSocketBaseUrl() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
  return apiUrl.replace(/\/api\/v1\/?$/, '');
}

const PANELS = [
  { key: 'TEACHER', label: 'Admin <-> Teacher' },
  { key: 'PARENT', label: 'Admin <-> Parent' },
];

export default function Communications() {
  const { user, institute } = useAuth();
  const [activePanel, setActivePanel] = useState('TEACHER');
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState('');
  const [messageText, setMessageText] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user?.id) return;
    const socket = io(getSocketBaseUrl(), { transports: ['websocket', 'polling'] });
    socketRef.current = socket;
    socket.emit('join_user', user.id);

    socket.on('direct_message', (msg) => {
      if (
        selectedUser &&
        (msg.sender_id === selectedUser.id || msg.receiver_id === selectedUser.id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
      void fetchConversations(activePanel);
    });

    socket.on('conversation_read', () => {
      void fetchConversations(activePanel);
    });

    return () => socket.disconnect();
  }, [user?.id, selectedUser, activePanel]);

  useEffect(() => {
    void fetchConversations(activePanel);
    void fetchUsers(activePanel, search);
    setSelectedUser(null);
    setMessages([]);
  }, [activePanel]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      void fetchUsers(activePanel, search);
    }, 250);
    return () => window.clearTimeout(t);
  }, [search, activePanel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function fetchConversations(role) {
    try {
      const res = await api.get('/chat/conversations', { params: { role } });
      const list = res.data?.data ?? [];
      setConversations(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load conversations', err);
      setConversations([]);
    }
  }

  async function fetchUsers(role, q = '') {
    try {
      const res = await api.get('/chat/users', { params: { role, q } });
      const list = res.data?.data ?? [];
      setUsers(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load chat users', err);
      setUsers([]);
    }
  }

  async function openConversation(peer) {
    setSelectedUser(peer);
    setLoading(true);
    try {
      const res = await api.get(`/chat/messages/${peer.id}`);
      const list = res.data?.data ?? [];
      setMessages(Array.isArray(list) ? list : []);
      await api.patch(`/chat/messages/${peer.id}/read`);
      socketRef.current?.emit('mark_direct_read', {
        institute_id: institute?.id || user?.instituteId,
        sender_id: peer.id,
        receiver_id: user.id,
      });
      await fetchConversations(activePanel);
    } catch (err) {
      console.error('Failed to open conversation', err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage() {
    if (!selectedUser) return;
    const trimmed = messageText.trim();
    if (!trimmed && !attachment) return;

    const text = attachment
      ? `${trimmed || 'Attachment'}\n[Attachment: ${attachment.name}]`
      : trimmed;

    try {
      const res = await api.post('/chat/messages', {
        receiverId: selectedUser.id,
        content: text,
      });
      const created = res.data?.data;
      if (created) {
        setMessages((prev) => [...prev, created]);
        socketRef.current?.emit('send_direct_message', { message: created });
      }

      setMessageText('');
      setAttachment(null);
      await fetchConversations(activePanel);
    } catch (err) {
      console.error('Failed to send message', err);
      alert('Failed to send message');
    }
  }

  const conversationMap = useMemo(() => {
    const map = new Map();
    conversations.forEach((c) => map.set(c.id, c));
    return map;
  }, [conversations]);

  const mergedList = useMemo(() => {
    return users.map((u) => ({ ...u, ...(conversationMap.get(u.id) || {}) }));
  }, [users, conversationMap]);

  return (
    <div className="mx-auto max-w-7xl px-2 sm:px-4">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-slate-950">Communications Hub</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Real-time role-based messaging with separate panels, unread badges, and live updates.
          </p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {PANELS.map((panel) => (
          <button
            key={panel.key}
            onClick={() => setActivePanel(panel.key)}
            className={`rounded-2xl px-4 py-2 text-sm font-black transition-all ${
              activePanel === panel.key
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20'
                : 'bg-white text-slate-600 hover:bg-blue-50'
            }`}
          >
            {panel.label}
          </button>
        ))}
      </div>

      <div className="grid h-[72vh] min-h-[560px] grid-cols-1 overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-xl lg:grid-cols-[360px_1fr]">
        <aside className="flex flex-col border-b border-blue-100 bg-slate-50/70 lg:border-b-0 lg:border-r">
          <div className="p-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${activePanel === 'TEACHER' ? 'teachers' : 'parents'}...`}
                className="w-full rounded-2xl border border-blue-100 bg-white py-2.5 pl-9 pr-3 text-sm font-semibold outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-3">
            {mergedList.length === 0 ? (
              <div className="grid h-full place-items-center rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-400">
                No users found in this panel.
              </div>
            ) : (
              <div className="space-y-2">
                {mergedList.map((item) => {
                  const unread = Number(item.unread_count || 0);
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ y: -1 }}
                      onClick={() => openConversation(item)}
                      className={`w-full rounded-2xl border p-3 text-left transition-all ${
                        selectedUser?.id === item.id
                          ? 'border-blue-300 bg-blue-50'
                          : 'border-transparent bg-white hover:border-blue-100'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-xs font-black text-white">
                            {(item.name || 'U').slice(0, 1).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-black text-slate-900">{item.name}</p>
                            <p className="truncate text-xs font-semibold text-slate-500">{item.email}</p>
                          </div>
                        </div>
                        {unread > 0 && (
                          <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-black text-white">
                            {unread}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 truncate text-xs font-semibold text-slate-500">
                        {item.last_message || 'No messages yet'}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        <section className="flex h-full flex-col bg-white">
          {!selectedUser ? (
            <div className="grid h-full place-items-center p-6 text-center">
              <div>
                <MessageSquare className="mx-auto h-12 w-12 text-slate-300" />
                <h3 className="mt-3 text-lg font-black text-slate-900">Select a conversation</h3>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Start messaging in {activePanel === 'TEACHER' ? 'Admin <-> Teacher' : 'Admin <-> Parent'} panel.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-blue-100 px-4 py-3 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-xs font-black text-white">
                    {(selectedUser.name || 'U').slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-slate-900">{selectedUser.name}</p>
                    <p className="truncate text-xs font-semibold text-slate-500">{selectedUser.email}</p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-1.5 text-[11px] font-black uppercase text-blue-700">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Live
                </div>
              </div>

              <div className="flex-1 overflow-y-auto bg-[linear-gradient(180deg,rgba(219,234,254,0.25)_0%,rgba(255,255,255,1)_45%)] p-4 sm:p-6">
                {loading ? (
                  <p className="text-sm font-semibold text-slate-500">Loading messages...</p>
                ) : messages.length === 0 ? (
                  <div className="grid h-full place-items-center text-sm font-semibold text-slate-400">
                    Start the conversation.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((msg) => {
                      const mine = msg.sender_id === user.id;
                      return (
                        <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm font-semibold shadow-sm ${
                              mine
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                                : 'border border-slate-100 bg-white text-slate-700'
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                            <p className={`mt-1 text-[10px] ${mine ? 'text-blue-100' : 'text-slate-400'}`}>
                              {new Date(msg.created_at || Date.now()).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              <div className="border-t border-blue-100 bg-white p-3 sm:p-4">
                <div className="flex items-end gap-2 sm:gap-3">
                  <label className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-blue-100 text-slate-500 hover:bg-blue-50">
                    <Paperclip className="h-4 w-4" />
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                    />
                  </label>
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        void sendMessage();
                      }
                    }}
                    placeholder="Type a message..."
                    className="max-h-36 min-h-[46px] flex-1 resize-y rounded-2xl border border-blue-100 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-400"
                  />
                  <button
                    onClick={() => void sendMessage()}
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25 transition hover:brightness-110"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                {attachment && (
                  <div className="mt-2 inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                    <Paperclip className="h-3.5 w-3.5" />
                    {attachment.name}
                    <button onClick={() => setAttachment(null)} className="text-blue-500 hover:text-blue-700">x</button>
                  </div>
                )}
              </div>
            </>
          )}
        </section>
=======
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
>>>>>>> d0524919e2fcd28a55b1beb4f369317937eec4de
      </div>
    </div>
  );
}
