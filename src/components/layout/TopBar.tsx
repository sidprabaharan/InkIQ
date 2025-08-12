
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export function TopBar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="h-16 border-b flex items-center justify-end px-6 bg-white">
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end">
          <span className="font-medium">{user?.email ?? 'Guest'}</span>
          <span className="text-sm text-gray-500">{user ? 'Signed in' : 'Signed out'}</span>
        </div>
        <Avatar className="h-9 w-9">
          <AvatarImage src="/lovable-uploads/d2507023-d2d7-428d-b225-4442856795ff.png" alt="User" />
          <AvatarFallback>{user?.email?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
        </Avatar>
        {user ? (
          <Button variant="outline" size="sm" onClick={() => navigate('/logout')}>Sign out</Button>
        ) : (
          <Button variant="default" size="sm" onClick={() => navigate('/login')}>Sign in</Button>
        )}
      </div>
    </header>
  );
}
