import ContactsList from "@/components/admin/ContactsList";
import { getContacts } from "@/lib/actions/contact.actions";

export default async function AdminContactsPage() {
  const contacts = await getContacts();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Contact Messages</h1>
        <p className="text-muted-foreground">Manage messages from the contact form</p>
      </div>

      <ContactsList contacts={contacts as any} />
    </div>
  );
}
