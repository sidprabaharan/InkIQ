
import React from "react";
import { Contact } from "@/types/customer";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, Briefcase, Building, UserCog, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactsListProps {
  contacts: Contact[];
  primaryContact?: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  onEditContact?: (contact: Contact) => void;
  onEditPrimaryContact?: () => void;
  onSelectContact?: (contact: Contact) => void;
}

export function ContactsList({ 
  contacts, 
  primaryContact, 
  onEditContact,
  onEditPrimaryContact,
  onSelectContact
}: ContactsListProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleContactClick = (contact: Contact) => {
    if (onSelectContact) {
      onSelectContact(contact);
    }
  };

  return (
    <div className="space-y-4">
      {primaryContact && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10 bg-blue-100 text-blue-600">
                <AvatarFallback>
                  {getInitials(primaryContact.firstName, primaryContact.lastName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">
                      {primaryContact.firstName} {primaryContact.lastName}
                    </h4>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Primary</span>
                  </div>
                  {onEditPrimaryContact && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={onEditPrimaryContact}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit primary contact</span>
                    </Button>
                  )}
                </div>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{primaryContact.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{primaryContact.phoneNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {contacts.map((contact) => (
        <Card 
          key={contact.id} 
          className={onSelectContact ? "cursor-pointer hover:shadow-md transition-shadow" : ""}
          onClick={onSelectContact ? () => handleContactClick(contact) : undefined}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10 bg-gray-100">
                <AvatarFallback>
                  {getInitials(contact.firstName, contact.lastName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">
                    {contact.firstName} {contact.lastName}
                  </h4>
                  {onEditContact && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditContact(contact);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit contact</span>
                    </Button>
                  )}
                </div>
                <div className="mt-2 space-y-1 text-sm">
                  {contact.jobTitle && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-gray-500" />
                      <span>
                        {contact.jobTitle}
                      </span>
                    </div>
                  )}
                  {contact.department && (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-500" />
                      <span>{contact.department}</span>
                    </div>
                  )}
                  {contact.contactOwner && (
                    <div className="flex items-center gap-2">
                      <UserCog className="h-4 w-4 text-gray-500" />
                      <span>Owner: {contact.contactOwner}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{contact.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{contact.phoneNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
