
import React, { useState } from "react";
import { Contact } from "@/types/customer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ContactsTableProps {
  contacts: (Contact & { companyName: string })[];
  onSelectContact: (contact: Contact) => void;
}

export function ContactsTable({ contacts, onSelectContact }: ContactsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  
  const contactsPerPage = 10;
  
  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact => {
    const searchValue = searchTerm.toLowerCase();
    return (
      contact.firstName.toLowerCase().includes(searchValue) ||
      contact.lastName.toLowerCase().includes(searchValue) ||
      contact.email.toLowerCase().includes(searchValue) ||
      contact.phoneNumber.toLowerCase().includes(searchValue) ||
      contact.companyName.toLowerCase().includes(searchValue)
    );
  });
  
  // Calculate pagination
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleRowSelect = (contactId: string) => {
    setSelectedRows(prev => {
      if (prev.includes(contactId)) {
        return prev.filter(id => id !== contactId);
      } else {
        return [...prev, contactId];
      }
    });
  };
  
  const handleSelectAll = () => {
    if (selectedRows.length === currentContacts.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentContacts.map(contact => contact.id));
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search contacts..."
            className="pl-9"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Delete</Button>
          <Button variant="outline">Export</Button>
          <Button>Create New</Button>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedRows.length === currentContacts.length && currentContacts.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Contact Owner</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentContacts.map((contact) => (
              <TableRow 
                key={contact.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onSelectContact(contact)}
              >
                <TableCell className="font-medium" onClick={(e) => {
                  e.stopPropagation();
                  handleRowSelect(contact.id);
                }}>
                  <Checkbox checked={selectedRows.includes(contact.id)} />
                </TableCell>
                <TableCell>
                  {contact.firstName} {contact.lastName}
                </TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.phoneNumber}</TableCell>
                <TableCell>{contact.companyName}</TableCell>
                <TableCell>{contact.contactOwner || "Unassigned"}</TableCell>
              </TableRow>
            ))}
            {currentContacts.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No contacts found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Showing {indexOfFirstContact + 1} to {Math.min(indexOfLastContact, filteredContacts.length)} of {filteredContacts.length} contacts
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 3) {
                pageNumber = i + 1;
              } else if (currentPage <= 2) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 1) {
                pageNumber = totalPages - 2 + i;
              } else {
                pageNumber = currentPage - 1 + i;
              }
              
              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
