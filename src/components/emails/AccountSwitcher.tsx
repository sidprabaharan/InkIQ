import { ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { EmailAccount } from "@/types/email";

interface AccountSwitcherProps {
  accounts: EmailAccount[];
  selectedAccountId: string | null;
  onAccountSelect: (accountId: string | null) => void;
  onAddAccount: () => void;
}

export function AccountSwitcher({ 
  accounts, 
  selectedAccountId, 
  onAccountSelect, 
  onAddAccount 
}: AccountSwitcherProps) {
  const selectedAccount = selectedAccountId 
    ? accounts.find(acc => acc.id === selectedAccountId) 
    : null;

  const totalUnread = accounts.reduce((sum, acc) => sum + acc.unreadCount, 0);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between h-12 px-3">
          <div className="flex items-center gap-3">
            {selectedAccount ? (
              <>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={selectedAccount.avatar} />
                  <AvatarFallback>
                    {selectedAccount.displayName[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{selectedAccount.displayName}</span>
                  <span className="text-xs text-muted-foreground">{selectedAccount.email}</span>
                </div>
                {selectedAccount.unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {selectedAccount.unreadCount}
                  </Badge>
                )}
              </>
            ) : (
              <>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium">All</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">All Accounts</span>
                  <span className="text-xs text-muted-foreground">{accounts.length} connected</span>
                </div>
                {totalUnread > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {totalUnread}
                  </Badge>
                )}
              </>
            )}
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[320px]">
        <DropdownMenuItem onClick={() => onAccountSelect(null)}>
          <div className="flex items-center gap-3 w-full">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium">All</span>
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-sm font-medium">All Accounts</span>
              <span className="text-xs text-muted-foreground">{accounts.length} connected</span>
            </div>
            {totalUnread > 0 && (
              <Badge variant="secondary">{totalUnread}</Badge>
            )}
            {!selectedAccountId && <Check className="h-4 w-4" />}
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {accounts.map((account) => (
          <DropdownMenuItem key={account.id} onClick={() => onAccountSelect(account.id)}>
            <div className="flex items-center gap-3 w-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={account.avatar} />
                <AvatarFallback>
                  {account.displayName[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1">
                <span className="text-sm font-medium">{account.displayName}</span>
                <span className="text-xs text-muted-foreground">{account.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${
                  account.status === 'online' ? 'bg-green-500' :
                  account.status === 'syncing' ? 'bg-yellow-500' : 'bg-gray-400'
                }`} />
                {account.unreadCount > 0 && (
                  <Badge variant="secondary">{account.unreadCount}</Badge>
                )}
                {selectedAccountId === account.id && <Check className="h-4 w-4" />}
              </div>
            </div>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={onAddAccount}>
          <div className="flex items-center gap-3 w-full">
            <div className="h-8 w-8 rounded-full border-2 border-dashed border-muted-foreground/50 flex items-center justify-center">
              <span className="text-lg">+</span>
            </div>
            <span className="text-sm font-medium">Add Account</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}