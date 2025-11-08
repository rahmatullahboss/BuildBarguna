import { getContacts, markContactAsRead, deleteContact } from "@/lib/actions/contact.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, MailOpen, Trash2, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default async function AdminContactsPage() {
  const contacts = await getContacts();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Contact Messages</h1>
        <p className="text-muted-foreground">Manage messages from the contact form</p>
      </div>

      {contacts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Mail className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No messages yet</h3>
            <p className="text-muted-foreground">Contact messages will appear here when submitted.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <Card key={contact.id} className={`transition-all ${contact.status === 'unread' ? 'border-primary/50 bg-primary/5' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">
                        {contact.firstName} {contact.lastName}
                      </CardTitle>
                      <Badge variant={contact.status === 'unread' ? 'default' : 'secondary'}>
                        {contact.status === 'unread' ? 'New' : 'Read'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{contact.email}</span>
                      {contact.phone && <span>📞 {contact.phone}</span>}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDistanceToNow(new Date(contact.createdAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                    <h4 className="font-medium text-foreground">{contact.subject}</h4>
                  </div>
                  <div className="flex gap-2">
                    {contact.status === 'unread' && (
                      <form action={markContactAsRead.bind(null, contact.id)}>
                        <Button type="submit" variant="outline" size="sm">
                          <MailOpen className="h-4 w-4 mr-2" />
                          Mark as Read
                        </Button>
                      </form>
                    )}
                    <form action={deleteContact.bind(null, contact.id)}>
                      <Button type="submit" variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </form>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <p className="text-foreground whitespace-pre-wrap">{contact.message}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" asChild>
                    <a href={`mailto:${contact.email}?subject=Re: ${contact.subject}&body=Hello ${contact.firstName},%0D%0A%0D%0AThank you for contacting Build Barguna Co-operative.%0D%0A%0D%0A`}>
                      Reply via Email
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}