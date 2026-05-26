import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  BadgeCheck,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../components/admin/Skeleton';

function getSocketBaseUrl() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
  return apiUrl.replace(/\/api\/v1\/?$/, '');
}

export default function Chat() {
  const { user, institute } = useAuth();
  const [teachers, setTeachers] = useState([]);
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
      void fetchTeachers();
    });

    socket.on('conversation_read', () => {
      void fetchTeachers();
    });

    return () => socket.disconnect();
  }, [user?.id, selectedUser]);

  useEffect(() => {
    void fetchTeachers(search);
  }, [search]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function fetchTeachers(q = '') {
    try {
      const res = await api.get('/chat/users', { params: { role: 'TEACHER', q } });
      const list = res.data?.data ?? [];
      setTeachers(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load teachers', err);
      setTeachers([]);
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
      await fetchTeachers(search);
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
      await fetchTeachers(search);
    } catch (err) {
      console.error('Failed to send message', err);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-2 sm:px-4 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="text-blue-600" /> Messages
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-500">
          Real-time chat with your teachers. Ask doubts and get instant updates.
        </p>
      </div>

      <div className="grid h-[70vh] min-h-[500px] grid-cols-1 overflow-hidden rounded-[2rem] border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xl lg:grid-cols-[340px_1fr]">
        {/* Sidebar */}
        <aside className="flex flex-col border-b border-slate-150 bg-slate-50/40 dark:border-slate-800 lg:border-b-0 lg:border-r">
          <div className="p-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search teachers..."
                className="w-full rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white py-2.5 pl-9 pr-3 text-sm font-semibold outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-3">
            {teachers.length === 0 ? (
              <div className="grid h-full place-items-center rounded-[2rem] border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-400">
                No teachers found.
              </div>
            ) : (
              <div className="space-y-2">
                {teachers.map((item) => {
                  const unread = Number(item.unread_count || 0);
                  const isSelected = selectedUser?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => openConversation(item)}
                      className={cn(
                        "w-full rounded-2xl border p-3 text-left transition-all",
                        isSelected 
                          ? "border-blue-200 bg-blue-50/50 dark:border-blue-900/40 dark:bg-blue-950/20" 
                          : "border-transparent bg-white dark:bg-slate-950 hover:border-slate-100 dark:hover:border-slate-800"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-600 text-sm font-black text-white">
                            {(item.name || 'T').slice(0, 1).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-905 dark:text-white">{item.name}</p>
                            <p className="truncate text-xs font-semibold text-slate-500">{item.email}</p>
                          </div>
                        </div>
                        {unread > 0 && (
                          <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-black text-white">
                            {unread}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* Chat Section */}
        <section className="flex h-full flex-col bg-white dark:bg-slate-900">
          {!selectedUser ? (
            <div className="grid h-full place-items-center p-6 text-center">
              <div>
                <MessageSquare className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700" />
                <h3 className="mt-3 text-lg font-black text-slate-900 dark:text-white">Select a teacher</h3>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Choose a teacher from the sidebar to start a conversation.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-4 py-3 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-600 text-sm font-black text-white">
                    {(selectedUser.name || 'T').slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{selectedUser.name}</p>
                    <p className="truncate text-xs font-semibold text-slate-500">{selectedUser.email}</p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-1.5 text-[11px] font-black uppercase text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Online
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto bg-[linear-gradient(180deg,rgba(219,234,254,0.08)_0%,rgba(255,255,255,0)_45%)] p-4 sm:p-6">
                {loading ? (
                  <p className="text-sm font-semibold text-slate-500">Loading messages...</p>
                ) : messages.length === 0 ? (
                  <div className="grid h-full place-items-center text-sm font-semibold text-slate-400">
                    Send a message to start chatting.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((msg) => {
                      const mine = msg.sender_id === user.id;
                      return (
                        <div key={msg.id} className={cn("flex", mine ? 'justify-end' : 'justify-start')}>
                          <div
                            className={cn(
                              "max-w-[80%] rounded-2xl px-4 py-3 text-sm font-semibold shadow-sm",
                              mine
                                ? 'bg-blue-600 text-white'
                                : 'border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-950 text-slate-700 dark:text-slate-200'
                            )}
                          >
                            <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                            <p className={cn("mt-1 text-[9px]", mine ? 'text-blue-200' : 'text-slate-400')}>
                              {new Date(msg.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 sm:p-4">
                <div className="flex items-end gap-2 sm:gap-3">
                  <label className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800">
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
                    className="max-h-36 min-h-[46px] flex-1 resize-none rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 dark:text-white px-4 py-3 text-sm font-semibold outline-none focus:border-blue-400"
                  />
                  <button
                    onClick={() => void sendMessage()}
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                {attachment && (
                  <div className="mt-2 inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    <Paperclip className="h-3.5 w-3.5" />
                    {attachment.name}
                    <button onClick={() => setAttachment(null)} className="text-blue-500 hover:text-blue-700">x</button>
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
