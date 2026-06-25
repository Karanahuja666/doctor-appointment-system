'use client';
import { useEffect, useState } from 'react';
import { MessageSquare, Reply } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminContacts() {
  const [messages, setMessages] = useState<any[]>([]);
  const [replyModal, setReplyModal] = useState<any>(null);
  const [reply, setReply] = useState('');

  useEffect(() => { fetchData(); }, []);
  const fetchData = () => api.get('/admin/contacts').then(({ data }) => setMessages(data.data)).catch(() => {});

  const handleReply = async () => {
    try {
      await api.put(`/admin/contacts/${replyModal._id}/reply`, { reply });
      toast.success('Reply sent');
      setReplyModal(null);
      setReply('');
      fetchData();
    } catch { toast.error('Failed'); }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Contact Messages</h1>
      <p className="text-gray-600 mb-8">{messages.length} messages</p>
      <div className="space-y-4">
        {messages.map((m) => (
          <Card key={m._id}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-gray-900">{m.name}</p>
                  <Badge variant={m.status === 'new' ? 'warning' : m.status === 'replied' ? 'success' : 'default'}>{m.status}</Badge>
                </div>
                <p className="text-sm text-gray-500">{m.email} &bull; {formatDate(m.createdAt)}</p>
                <p className="text-sm font-medium text-gray-700 mt-2">{m.subject}</p>
                <p className="text-sm text-gray-600 mt-1">{m.message}</p>
                {m.reply && <div className="mt-3 p-3 bg-primary-50 rounded-lg text-sm text-primary-700"><strong>Reply:</strong> {m.reply}</div>}
              </div>
              {m.status !== 'replied' && (
                <Button size="sm" variant="ghost" onClick={() => setReplyModal(m)}>
                  <Reply className="w-4 h-4" />
                </Button>
              )}
            </div>
          </Card>
        ))}
        {messages.length === 0 && <div className="text-center py-12 text-gray-500">No messages</div>}
      </div>
      <Modal isOpen={!!replyModal} onClose={() => setReplyModal(null)} title="Reply to Message">
        <div className="space-y-4">
          <p className="text-sm text-gray-600"><strong>From:</strong> {replyModal?.name} ({replyModal?.email})</p>
          <p className="text-sm text-gray-600"><strong>Message:</strong> {replyModal?.message}</p>
          <textarea rows={4} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Type your reply..."
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none resize-none" />
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setReplyModal(null)}>Cancel</Button>
            <Button onClick={handleReply}>Send Reply</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
