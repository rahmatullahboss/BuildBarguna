"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, MailOpen, Trash2, Calendar, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { markContactAsRead, deleteContact } from "@/lib/actions/contact.actions";
import { useToast } from "@/components/ui/use-toast";

export interface ContactItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  status: string; // 'unread' | 'read' | 'replied'
  createdAt: string | Date;
}

export default function ContactsList({ contacts }: { contacts: ContactItem[] }) {
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const visibleContacts = contacts.filter(c => !removedIds.has(c.id));

  const doMarkRead = (id: string) => {
    setLoadingId(id);
    // optimistic
    setReadIds(prev => new Set(prev).add(id));
    startTransition(async () => {
      try {
        await markContactAsRead(id);
        toast({ title: "Marked as read" });
      } catch (e) {
        // revert
        setReadIds(prev => {
          const n = new Set(prev); n.delete(id); return n;
        });
        toast({ title: "Failed to mark as read", variant: "destructive" });
      } finally {
        setLoadingId(null);
      }
    });
  };

  const doDelete = (id: string) => {
    if (!confirm("Delete this message? This cannot be undone.")) return;
    setLoadingId(id);
    // optimistic
    setRemovedIds(prev => new Set(prev).add(id));
    startTransition(async () => {
      try {
        await deleteContact(id);
        toast({ title: "Message deleted" });
      } catch (e) {
        // revert
        setRemovedIds(prev => {
          const n = new Set(prev); n.delete(id); return n;
        });
        toast({ title: "Failed to delete message", variant: "destructive" });
      } finally {
        setLoadingId(null);
      }
    });
  };

  if (visibleContacts.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Mail className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No messages</h3>
          <p className="text-muted-foreground">Contact messages will appear here when submitted.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {visibleContacts.map((contact) => {
        const isRead = contact.status === "read" || readIds.has(contact.id);
        const isLoading = loadingId === contact.id || isPending;
        return (
          <Card key={contact.id} className={`transition-all ${!isRead ? 'border-primary/50 bg-primary/5' : ''}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg">
                      {contact.firstName} {contact.lastName}
                    </CardTitle>
                    <Badge variant={!isRead ? 'default' : 'secondary'}>
                      {!isRead ? 'New' : 'Read'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{contact.email}</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDistanceToNow(new Date(contact.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                  <h4 className="font-medium text-foreground">{contact.subject}</h4>
                </div>
                <div className="flex gap-2">
                  {!isRead && (
                    <Button variant="outline" size="sm" onClick={() => doMarkRead(contact.id)} disabled={isLoading}>
                      {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <MailOpen className="h-4 w-4 mr-2" />}
                      Mark as Read
                    </Button>
                  )}
                  <Button variant="destructive" size="sm" onClick={() => doDelete(contact.id)} disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-secondary/50 p-4 rounded-lg">
                <p className="text-foreground whitespace-pre-wrap">{contact.message}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" asChild>
                  <a href={`mailto:${contact.email}?subject=Re: ${contact.subject}&body=Hello ${contact.firstName},%0D%0A%0D%0AThank you for contacting Build Barguna Initiative.%0D%0A%0D%0A`}>
                    Reply via Email
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
